import { Alert } from "react-native";
import { action } from "typesafe-actions";
import { IUserReducer } from "@interfaces";
import * as T from "@actionTypes/userTypes";
import { customNavigate, resetToScreen } from "./navActions";

export const loginUser = (user: IUserReducer) => dispatch => {
  dispatch(action(T.LOGIN_USER, user));
  dispatch(customNavigate("AudioScreen"));
};

export const logoutUser = () => dispatch => {
  dispatch(action(T.LOGOUT_USER));
  dispatch(resetToScreen("RegistrationScreen"));
  Alert.alert("You got logged out!");
};
