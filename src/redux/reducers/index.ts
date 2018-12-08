import { combineReducers } from "redux";
import { appStateReducer } from "./appStateReducer";
import { userReducer } from "./userReducer/userReducer";
import { navReducer } from "./navReducer";
import { accountMapReducer } from "./accountMapReducer";

export default combineReducers({
  appState: appStateReducer,
  user: userReducer,
  nav: navReducer,
  accountMap: accountMapReducer
});
