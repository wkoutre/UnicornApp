import { action } from "typesafe-actions";
import { IAccountMapReducer } from "@interfaces";
import * as T from "@actionTypes";

export const storeAccount = (account: IAccountMapReducer) =>
  action(T.STORE_ACCOUNT, account);
