import { combineReducers } from "redux";
import authReducer from "./authReducer";
import postsReducer from "./postsReducer";
import { firebaseReducer } from "react-redux-firebase";
import usersReducer from "./usersReducer";

const rootReducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
  firebase: firebaseReducer,
  users: usersReducer,
});

export default rootReducer;
