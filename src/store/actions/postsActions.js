import moment from "moment";
import { FIREBASE_COLLECTIONS } from "../../config/firebaseConfig";
import firebase from "firebase/compat";

export const getPosts = (props = { author: "", offset: 0 }) => {
  const { author, offset } = props;

  return async (dispatch, getState) => {
    const loggedUserId = getState().auth?.loggedUser?.id;
    const lastFetchedData = getState().posts?.lastFetched;

    dispatch({
      type: "GET_POSTS",
      payload: offset > 0 ? getState().posts?.list || [] : [],
      isPosting: true,
    });

    let targetPosts = await FIREBASE_COLLECTIONS.POSTS.get();

    if (!!author) {
      targetPosts = await FIREBASE_COLLECTIONS.POSTS.where(
        "author",
        "==",
        author
      ).get();
    }

    const totalSize = targetPosts.size;

    dispatch({
      type: "GET_TOTAL_POSTS",
      payload: totalSize,
    });

    let query = FIREBASE_COLLECTIONS.POSTS.orderBy("createdAt", "desc").limit(
      10
    );

    if (!!author) {
      query = query.where("author", "==", author);
    }

    if (!!offset && !!lastFetchedData) {
      query = query.startAfter(lastFetchedData);
    }

    query.onSnapshot((querySnapshot) => {
      const fetchedData = [];

      if (!!offset) {
        if (offset < totalSize) {
          query.get().then((querySnapshot) => {
            const lastFetched =
              querySnapshot.docs[querySnapshot.docs.length - 1];

            dispatch({
              type: "GET_LAST_FETCHED",
              lastFetched: lastFetched,
            });

            query
              .startAfter(lastFetched)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  const isHidden = !!doc
                    .data()
                    .hiddenFrom?.find((hiders) => hiders === loggedUserId);

                  if (!isHidden) {
                    fetchedData.push({
                      id: doc.id,
                      ...doc.data(),
                    });
                  }
                });

                dispatch({
                  type: "GET_POSTS",
                  isPosting: false,
                  payload: [...getState().posts?.list, ...fetchedData],
                });
              });
          });
        }
      } else {
        dispatch({
          type: "GET_LAST_FETCHED",
          lastFetched: null,
        });

        querySnapshot?.forEach(async (doc) => {
          const isHidden = !!doc
            .data()
            .hiddenFrom?.find((hiders) => hiders === loggedUserId);

          if (!isHidden) {
            fetchedData.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });

        dispatch({
          type: "GET_POSTS",
          isPosting: false,
          payload: fetchedData,
        });
      }
    });
  };
};

export const createPost = (post) => {
  return (dispatch, getState) => {
    const authorData = getState().auth?.loggedUser;
    const totalPosts = getState().posts?.total;

    dispatch({
      type: "CREATE_POST",
      payload: true,
    });

    if (!!post.image) {
      const firebaseStorage = firebase.storage();
      const uploadTask = firebaseStorage
        .ref(`postPhotos/${post.image.name}`)
        .put(post.image);

      uploadTask.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          FIREBASE_COLLECTIONS.POSTS.add({
            content: post.content,
            image: url,
            author: authorData.id,
            createdAt: moment().format(),
          })
            .then((doc) => {
              setTimeout(() => {
                dispatch({
                  type: "CREATE_POST_SUCCESS",
                  payload: false,
                  newTotal: totalPosts + 1,
                });
              }, 3000);
            })
            .catch((err) => {
              dispatch({ type: "CREATE_POST_ERR", err });
            });
        });
      });
    } else {
      FIREBASE_COLLECTIONS.POSTS.add({
        content: post.content,
        author: authorData.id,
        createdAt: moment().format(),
      })
        .then((doc) => {
          dispatch({
            type: "CREATE_POST_SUCCESS",
            payload: false,
            newTotal: totalPosts + 1,
          });
        })
        .catch((err) => {
          dispatch({ type: "CREATE_POST_ERR", err });
        });
    }
  };
};

export const updatePost = (post) => {
  return (dispatch, getState) => {
    dispatch({
      type: "UPDATE_POST",
      payload: true,
    });

    if (!!post.image) {
      const firebaseStorage = firebase.storage();
      const uploadTask = firebaseStorage
        .ref(`postPhotos/${post.image.name}`)
        .put(post.image);

      uploadTask.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          FIREBASE_COLLECTIONS.POSTS.doc(post.id)
            .get()
            .then((doc) => {
              doc.ref
                .update({
                  ...doc.data(),
                  content: post.content,
                  image: url,
                  updatedAt: moment().format(),
                })
                .then(() => {
                  setTimeout(() => {
                    dispatch({
                      type: "UPDATE_POST",
                      payload: false,
                    });
                  }, 3000);
                })
                .catch((err) => {
                  dispatch({ type: "UPDATE_POST_ERR", err });
                });
            })
            .catch((err) => {
              dispatch({ type: "UPDATE_POST_ERR", err });
            });
        });
      });
    } else {
      FIREBASE_COLLECTIONS.POSTS.doc(post.id)
        .get()
        .then((doc) => {
          doc.ref
            .update({
              ...doc.data(),
              content: post.content,
              updatedAt: moment().format(),
              image: null,
            })
            .then(() => {
              dispatch({
                type: "UPDATE_POST",
                payload: false,
              });
            })
            .catch((err) => {
              dispatch({ type: "UPDATE_POST_ERR", err });
            });
        })
        .catch((err) => {
          dispatch({ type: "UPDATE_POST_ERR", err });
        });
    }
  };
};

export const likePost = ({ postId, isLiked }) => {
  return (dispatch, getState) => {
    const likerId = getState().auth?.loggedUser?.id;

    dispatch({
      type: "UPDATE_POST",
      payload: true,
    });

    FIREBASE_COLLECTIONS.POSTS.doc(postId)
      .get()
      .then((doc) => {
        const currentLikes = doc.data().likes || [];

        doc.ref
          .update({
            ...doc.data(),
            likes: isLiked
              ? [...currentLikes, likerId]
              : currentLikes.filter((liker) => liker !== likerId),
          })
          .then(() => {
            dispatch({
              type: "UPDATE_POST",
              payload: false,
            });
          })
          .catch((err) => {
            console.log(err.message);
            dispatch({ type: "UPDATE_POST_ERR", err });
          });
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({ type: "UPDATE_POST_ERR", err });
      });
  };
};

export const hidePost = (postId) => {
  return (dispatch, getState) => {
    const hiderId = getState().auth?.loggedUser?.id;

    dispatch({
      type: "UPDATE_POST",
      payload: true,
    });

    FIREBASE_COLLECTIONS.POSTS.doc(postId)
      .get()
      .then((doc) => {
        const currentHiders = doc.data().hiddenFrom || [];

        doc.ref
          .update({
            ...doc.data(),
            hiddenFrom: [...currentHiders, hiderId],
          })
          .then(() => {
            dispatch({
              type: "UPDATE_POST",
              payload: false,
            });
          })
          .catch((err) => {
            console.log(err.message);
            dispatch({ type: "UPDATE_POST_ERR", err });
          });
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({ type: "UPDATE_POST_ERR", err });
      });
  };
};

export const deletePost = (id) => {
  return (dispatch, getState) => {
    const totalPosts = getState().posts?.total;

    dispatch({
      type: "DELETE_POST",
      payload: true,
    });

    FIREBASE_COLLECTIONS.POSTS.doc(id)
      .get()
      .then((doc) => {
        doc.ref
          .delete()
          .then(() => {
            dispatch({
              type: "DELETE_POST",
              payload: false,
              newTotal: totalPosts - 1,
            });
          })
          .catch((err) => {
            dispatch({ type: "DELETE_POST_ERR", err });
          });
      })
      .catch((err) => {
        dispatch({ type: "DELETE_POST_ERR", err });
      });
  };
};

export const addComment = ({ postId, comment }) => {
  return (dispatch, getState) => {
    const authorData = getState().auth?.loggedUser;

    dispatch({
      type: "UPDATE_POST",
      payload: true,
    });

    FIREBASE_COLLECTIONS.POSTS.doc(postId)
      .get()
      .then((doc) => {
        const currentComments = doc.data().comments || [];
        const newCommentId = `${Date.now()
          .toString(36)
          .toUpperCase()}${Math.floor(Math.random() * 123)}`;
        const newCommentData = {
          id: newCommentId,
          content: comment,
          author: authorData?.id,
          createdAt: moment().format(),
        };

        doc.ref
          .update({
            ...doc.data(),
            comments: [...currentComments, newCommentData],
          })
          .then(() => {
            dispatch({
              type: "UPDATE_POST",
              payload: false,
            });
          })
          .catch((err) => {
            console.log(err.message);
            dispatch({ type: "UPDATE_POST_ERR", err });
          });
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({ type: "UPDATE_POST_ERR", err });
      });
  };
};

export const deleteComment = (postId, commentId) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_POST",
      payload: true,
    });

    FIREBASE_COLLECTIONS.POSTS.doc(postId)
      .get()
      .then((doc) => {
        doc.ref
          .update({
            ...doc.data(),
            comments: doc
              .data()
              .comments.filter((comment) => comment.id !== commentId),
          })
          .then(() => {
            dispatch({
              type: "UPDATE_POST",
              payload: false,
            });
          })
          .catch((err) => {
            console.log(err.message);
            dispatch({ type: "UPDATE_POST_ERR", err });
          });
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({ type: "UPDATE_POST_ERR", err });
      });
  };
};

export const updateComment = (postId, commentId, newContent) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_POST",
      payload: true,
    });

    FIREBASE_COLLECTIONS.POSTS.doc(postId)
      .get()
      .then((doc) => {
        const data = doc.data();
        const targetComment = data.comments.find(
          (comment) => comment.id === commentId
        );

        doc.ref
          .update({
            ...data,
            comments: [
              ...data.comments.filter((comment) => comment.id !== commentId),
              {
                ...targetComment,
                content: newContent,
                updatedAt: moment().format(),
              },
            ],
          })
          .then(() => {
            dispatch({
              type: "UPDATE_POST",
              payload: false,
            });
          })
          .catch((err) => {
            console.log(err.message);
            dispatch({ type: "UPDATE_POST_ERR", err });
          });
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({ type: "UPDATE_POST_ERR", err });
      });
  };
};

export const hideComment = (postId, commentId) => {
  return (dispatch, getState) => {
    const hiderId = getState().auth?.loggedUser?.id;

    dispatch({
      type: "UPDATE_POST",
      payload: true,
    });

    FIREBASE_COLLECTIONS.POSTS.doc(postId)
      .get()
      .then((doc) => {
        const data = doc.data();
        const targetComment = data.comments.find(
          (comment) => comment.id === commentId
        );

        const currentHiders = targetComment.hiddenFrom || [];

        doc.ref
          .update({
            ...data,
            comments: [
              ...data.comments.filter((comment) => comment.id !== commentId),
              {
                ...targetComment,
                hiddenFrom: [...currentHiders, hiderId],
              },
            ],
          })
          .then(() => {
            dispatch({
              type: "UPDATE_POST",
              payload: false,
            });
          })
          .catch((err) => {
            console.log(err.message);
            dispatch({ type: "UPDATE_POST_ERR", err });
          });
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({ type: "UPDATE_POST_ERR", err });
      });
  };
};

export const seeLikers = (users) => {
  return (dispatch) => {
    dispatch({
      type: "GET_POST_LIKERS",
      isPosting: true,
      payload: [],
    });

    FIREBASE_COLLECTIONS.USERS.onSnapshot((querySnapshot) => {
      const fetchedData = [];

      querySnapshot?.forEach((doc) => {
        const userData = doc.data();
        const isLiker = !!users.find((user) => user === doc.id);

        if (isLiker) {
          fetchedData.push({
            id: doc.id,
            avatar: userData.avatar,
            firstName: userData.firstName,
            lastName: userData.lastName,
            initials: userData.initials,
            username: userData.username,
          });
        }
      });

      dispatch({
        type: "GET_POST_LIKERS",
        isPosting: false,
        payload: fetchedData,
      });
    });
  };
};
