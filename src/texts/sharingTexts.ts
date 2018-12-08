import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

const cnShareShoeTexts = {
  title: "Stadium Goods",
  messageFront: "Checkout the",
  messageBack: "on Stadium Goods!",
};

export const shareShoeTexts: LocalizedStringsType<{
  [key: string]: string;
}> = new LocalizedStrings({
  en: {
    title: "Stadium Goods",
    messageFront: "Checkout the",
    messageBack: "on Stadium Goods!",
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnShareShoeTexts),
    {},
  ),
});
