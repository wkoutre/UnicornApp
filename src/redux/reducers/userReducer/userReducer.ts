import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as T from "@actionTypes";
import * as userActions from "@actions";
import { IUserReducer } from "@interfaces";

export const InitialUserState: IUserReducer = {
  name: "",
  email: ""
};

export type UserAction = ActionType<typeof userActions>;

export const userReducer: Reducer<IUserReducer, UserAction> = (
  state = InitialUserState,
  action
) => {
  switch (action.type) {
    case T.LOGIN_USER:
      return { ...action.payload };

    case T.LOGOUT_USER:
      return { ...InitialUserState };

    default:
      return state;
  }
};
