import { Platform, Dimensions } from "react-native";
import { IRootState } from "@interfaces";

export const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

export const IOS = Platform.OS === "ios";
export const IOSX = HEIGHT >= 812 && IOS;
export const DEV: boolean = process.env.NODE_ENV === "development";

if (DEV) {
  console.disableYellowBox = true;
}

export const PURGE: boolean = DEV ? false : false;
export const FIRST_SCREEN = "RegistrationScreen";

export const blacklist: Array<keyof IRootState> = ["nav"];
export const defaultRefs = {
  nullFunc: () => null,
  emptyObj: {},
  emptyArr: [],
  emptyStr: ""
};

export const KEYBOARD_ENTER_DELAY: number = 650;
