import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface IButtonTexts {
  apply: string;
  addToCartSuccess: string;
  restart: string;
  applyUpdate: string;
}

const cnButtonTexts = {
  apply: `应用`,
  addToCartSuccess: `已成功添加到您的购物车!`,
  restart: `重新开始`,
  applyUpdate: `应用更新`,
};

export const buttonTexts: LocalizedStringsType<
  IButtonTexts
> = new LocalizedStrings({
  en: {
    apply: `APPLY`,
    addToCartSuccess: `Successfully Added To Bag!`,
    restart: `RESTART`,
    applyUpdate: `APPLY UPDATE`,
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnButtonTexts), {}),
});
