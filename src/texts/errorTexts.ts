import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface IErrorTexts {
  text1: string;
  text2: string;
  buttonTitle: string;
  networkError: string;
}

const cnErrorTexts = {
  text1: "抱歉，出错了。",
  text2: "请再试一次。",
  buttonTitle: "刷新",
  networkError: `当您的互联网连接恢复后，页面将自动刷新。`,
};

export const errorTexts: LocalizedStringsType<
  IErrorTexts
> = new LocalizedStrings({
  en: {
    text1: "Sorry, something went wrong.",
    text2: "please try again",
    buttonTitle: "Refresh",
    networkError: `When your internet connection is back, the screen will automatically refresh.`,
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnErrorTexts), {}),
});
