import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// update below settings w/ your own firebase config
export const fbConfig = {
  apiKey: "AIzaSyD-EenkLuEykZvniwuttxfbv1ZAFjSZr5U",
  authDomain: "planscreator-269db.firebaseapp.com",
  projectId: "planscreator-269db",
  storageBucket: "planscreator-269db.appspot.com",
  messagingSenderId: "350697489765",
  appId: "1:350697489765:web:2727a7c5117987e1d5cd8c",
};

firebase.initializeApp(fbConfig);

export const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

export const FIREBASE_COLLECTIONS = {
  POSTS: firestore.collection("posts"),
  USERS: firestore.collection("users"),
};

export default firebase;
