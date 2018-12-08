import { Reducer } from "redux";
import * as T from "@actionTypes";

const INITIAL_STATE: "foreground" | "background" | "inactive" = "foreground";

export const appStateReducer: Reducer<string> = (
  state: string = INITIAL_STATE,
  action,
): string => {
  switch (action.type) {
    case T.BACKGROUND:
      return "background";
    case T.FOREGROUND:
      return "foreground";
    case T.INACTIVE:
      return "inactive";

    default:
      return state;
  }
};
