import { AsyncStorage } from "react-native";
import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import applyAppStateListener from "redux-enhancer-react-native-appstate";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import ReduxThunk from "redux-thunk";
import { PURGE, blacklist } from "@config";

const composeEnhancers =
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  __DEV__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const persistConfig = {
  key: "root", // the key for the persist
  storage: AsyncStorage, // the storage adapter, following the AsyncStorage api
  version: 1, // the state version as an integer (defaults to -1)
  blacklist, // do not persist these keys
};

const navMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);

// Root reducer must be called  after
// createReactNavigationReduxMiddleware, not before
const RootReducer = require("@reducers").default;

const persistedReducer = persistReducer(persistConfig, RootReducer);
const middlewares = [ReduxThunk, navMiddleware];

const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyAppStateListener(), applyMiddleware(...middlewares)),
);

const persistor = persistStore(store);

if (PURGE) {
  persistor.purge();
}

if (module.hot) {
  // Enable hot module replacement for reducers
  module.hot.accept(() => {
    store.replaceReducer(RootReducer);
  });
}

export { store, persistor };
