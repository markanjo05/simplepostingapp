import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./store/reducers";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import firebase from "firebase/compat";
import moment from "moment";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Navbar, Dashboard } from "src/components";
import { Login, Signup, Profile, InvalidPage, InvalidUser } from "src/pages";

const rrfConfig = { userProfile: "users", useFirestoreForProfile: true };

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const persistor = persistStore(store);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: (number) => number + "s",
    ss: (number) => number + "s",
    m: (number) => number + "m",
    mm: (number) => number + "m",
    h: (number) => number + "h",
    hh: (number) => number + "h",
    d: (number) => number + "d",
    dd: (number) => number + "d",
    w: (number) => number + "w",
    ww: (number) => number + "w",
    M: (number) => number + "m",
    MM: (number) => number + "m",
    y: (number) => number + "y",
    yy: (number) => number + "y",
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <div className="contentWrapper pb-3">
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/nouser" component={InvalidUser} />
                <Route path="/profile/:id" component={Profile} />
                {/* default */}
                <Route path="*" component={InvalidPage} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </PersistGate>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
