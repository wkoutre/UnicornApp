import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { IOS } from "react-native-common-lib";
import { cnLanguageCodes } from "./textsLoader";

const cnShopPDPTexts = {
  details: `商品描述`,
  sizing: ``,
  select: `选择尺码`,
  size: ``,
  addToCart: `加入购物车`,
};

export const shopPDPTexts: LocalizedStringsType<{
  details: string;
  sizing: string;
  select: string;
  size: string;
  addToCart: string;
}> = new LocalizedStrings({
  en: {
    details: `DETAILS`,
    sizing: `SIZING`,
    select: IOS ? `Select` : `SELECT`,
    size: `Size`,
    addToCart: `ADD TO CART`,
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnShopPDPTexts), {}),
});
