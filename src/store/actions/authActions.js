import firebase from "firebase/compat";
import { FIREBASE_COLLECTIONS } from "src/config/firebaseConfig";

export const logIn = (credentials) => {
  return (dispatch) => {
    dispatch({
      type: "LOG_IN",
      isPosting: true,
    });

    FIREBASE_COLLECTIONS.USERS.where("username", "==", credentials.username)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          dispatch({
            type: "LOGIN_ERROR",
            isPosting: false,
            err: { message: "Username does not exist." },
          });
        } else {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();

            if (userData.password === credentials.password) {
              dispatch({
                type: "LOGIN_SUCCESS",
                isPosting: false,
                payload: { username: userData.username },
              });

              dispatch({
                type: "GET_USER",
                profileData: {
                  id: doc.id,
                  avatar: userData.avatar,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  initials: userData.initials,
                  username: userData.username,
                },
                isFetching: false,
              });
            } else {
              dispatch({
                type: "LOGIN_ERROR",
                isPosting: false,
                err: { message: "Password is incorrect." },
                payload: {},
              });
            }
          });
        }
      });
  };
};

export const logOut = () => {
  return (dispatch) => {
    dispatch({
      type: "LOGOUT_SUCCESS",
    });

    dispatch({
      type: "REMOVE_PROFILE",
    });
  };
};

export const signUp = (newUser) => {
  return (dispatch) => {
    dispatch({
      type: "SIGN_UP",
      isPosting: true,
    });

    FIREBASE_COLLECTIONS.USERS.where("username", "==", newUser.username)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          if (newUser.avatarType === "uploadedPhoto") {
            const firebaseStorage = firebase.storage();
            const uploadTask = firebaseStorage
              .ref(`profilePhotos/${newUser.avatarImage.name}`)
              .put(newUser.avatarImage);

            uploadTask.then((snapshot) => {
              snapshot.ref.getDownloadURL().then((url) => {
                const newUserData = {
                  username: newUser.username,
                  password: newUser.password,
                  firstName: newUser.firstName,
                  lastName: newUser.lastName,
                  initials: newUser.firstName[0] + newUser.lastName[0],
                  avatar: url,
                };

                FIREBASE_COLLECTIONS.USERS.add(newUserData)
                  .then((doc) => {
                    dispatch({
                      type: "SIGNUP_SUCCESS",
                      isPosting: false,
                      payload: { username: newUser.username },
                    });
                  })
                  .catch((err) => {
                    dispatch({
                      type: "SIGNUP_ERROR",
                      isPosting: false,
                      err,
                    });
                  });
              });
            });
          } else {
            const newUserData = {
              username: newUser.username,
              password: newUser.password,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              initials: newUser.firstName[0] + newUser.lastName[0],
              avatar: newUser.avatarImage,
            };

            FIREBASE_COLLECTIONS.USERS.add(newUserData)
              .then((doc) => {
                dispatch({
                  type: "SIGNUP_SUCCESS",
                  isPosting: false,
                  payload: { username: newUser.username },
                });
              })
              .catch((err) => {
                dispatch({
                  type: "SIGNUP_ERROR",
                  isPosting: false,
                  err,
                });
              });
          }
        } else {
          dispatch({
            type: "SIGNUP_ERROR",
            isPosting: false,
            err: { message: "Username already exists." },
          });
        }
      });
  };
};

export const getLoggedUserData = () => {
  return (dispatch, getState) => {
    const loggedUsername = getState().auth?.loggedUser?.username;

    if (!!loggedUsername) {
      FIREBASE_COLLECTIONS.USERS.where(
        "username",
        "==",
        loggedUsername
      ).onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          logOut();
        } else {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();

            dispatch({
              type: "FETCH_LOGGED_USER_DATA",
              payload: {
                id: doc.id,
                avatar: userData.avatar,
                firstName: userData.firstName,
                lastName: userData.lastName,
                initials: userData.initials,
                username: userData.username,
              },
            });
          });
        }
      });
    }
  };
};

export const clearAuth = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET_AUTH_SUCCESS",
    });
  };
};
