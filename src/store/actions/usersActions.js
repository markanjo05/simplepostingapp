import { FIREBASE_COLLECTIONS } from "src/config/firebaseConfig";
import firebase from "firebase/compat";

export const getUsers = () => {
  return (dispatch, getState) => {
    dispatch({
      type: "GET_USERS",
      payload: [],
      isFetching: true,
    });

    FIREBASE_COLLECTIONS.USERS.onSnapshot((querySnapshot) => {
      const fetchedData = [];

      querySnapshot?.forEach(async (doc) => {
        const userData = doc.data();

        fetchedData.push({
          id: doc.id,
          avatar: userData.avatar,
          firstName: userData.firstName,
          lastName: userData.lastName,
          initials: userData.initials,
        });
      });

      dispatch({
        type: "GET_USERS",
        payload: fetchedData,
        isFetching: false,
      });
    });
  };
};

export const getUser = (id) => {
  return (dispatch, getState) => {
    dispatch({
      type: "GET_USER",
      payload: [],
      isFetching: true,
    });

    FIREBASE_COLLECTIONS.USERS.doc(id).onSnapshot((querySnapshot) => {
      const userData = querySnapshot.data();

      dispatch({
        type: "GET_USER",
        profileData: {
          id: querySnapshot.id,
          isFetching: false,
          avatar: userData.avatar,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          initials: userData.initials,
        },
      });
    });
  };
};

export const updateProfile = (newProfileData) => {
  return (dispatch, getState) => {
    const loggedUserId = getState().auth?.loggedUser?.id;

    dispatch({
      type: "UPDATE_PROFILE",
      isPosting: true,
    });

    if (newProfileData.avatarType === "uploadedPhoto") {
      const firebaseStorage = firebase.storage();
      const uploadTask = firebaseStorage
        .ref(`profilePhotos/${newProfileData.avatarImage.name}`)
        .put(newProfileData.avatarImage);

      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (progress === 100) {
          setTimeout(async () => {
            await snapshot.ref.getDownloadURL().then((url) => {
              FIREBASE_COLLECTIONS.USERS.doc(loggedUserId)
                .get()
                .then((doc) => {
                  doc.ref
                    .update({
                      ...doc.data(),
                      firstName: newProfileData.firstName,
                      lastName: newProfileData.lastName,
                      initials:
                        newProfileData.firstName[0] +
                        newProfileData.lastName[0],
                      avatar: url,
                      // updatedAt: moment().format(),
                    })
                    .then(() => {
                      dispatch({
                        type: "UPDATE_PROFILE",
                        isPosting: false,
                      });
                    })
                    .catch((err) => {
                      dispatch({
                        type: "UPDATE_PROFILE_ERR",
                        isPosting: false,
                        err,
                      });
                    });
                })
                .catch((err) => {
                  dispatch({
                    type: "UPDATE_PROFILE_ERR",
                    isPosting: false,
                    err,
                  });
                });
            });
          }, 5000);
        }
      });
    } else {
      FIREBASE_COLLECTIONS.USERS.doc(loggedUserId)
        .get()
        .then((doc) => {
          doc.ref
            .update({
              ...doc.data(),
              firstName: newProfileData.firstName,
              lastName: newProfileData.lastName,
              initials:
                newProfileData.firstName[0] + newProfileData.lastName[0],
              avatar: newProfileData.avatarImage,
              // updatedAt: moment().format(),
            })
            .then(() => {
              dispatch({
                type: "UPDATE_PROFILE",
                isPosting: false,
              });
            })
            .catch((err) => {
              dispatch({ type: "UPDATE_PROFILE_ERR", isPosting: false, err });
            });
        })
        .catch((err) => {
          dispatch({ type: "UPDATE_PROFILE_ERR", isPosting: false, err });
        });
    }
  };
};
