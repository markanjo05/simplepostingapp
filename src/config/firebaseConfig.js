import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// update below settings w/ your own firebase config
export const fbConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
};

firebase.initializeApp(fbConfig);

export const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

export const FIREBASE_COLLECTIONS = {
  POSTS: firestore.collection("posts"),
  USERS: firestore.collection("users"),
};

export default firebase;
