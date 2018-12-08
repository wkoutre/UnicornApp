import { IAccountMapReducer } from "@interfaces";
import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as T from "@actionTypes";
import * as accountMapActions from "@actions/accountMapActions";

export const InitialState: IAccountMapReducer = {};

export type UserAction = ActionType<typeof accountMapActions>;

export const accountMapReducer: Reducer<IAccountMapReducer, UserAction> = (
  state = InitialState,
  action
) => {
  switch (action.type) {
    case T.STORE_ACCOUNT: {
      const { email, ...rest } = action.payload;

      return {
        ...state,
        [`${email}`]: {
          ...rest
        }
      };
    }
    default:
      return state;
  }
};
