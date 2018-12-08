import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface IHomeNavTexts {
  HomeScreen: string;
  ShopNav: string;
  AccountScreen: string;
}

const cnHomeNavTexts = {
  HomeScreen: `主页`,
  ShopNav: `购物`,
  AccountScreen: `关于`,
};

export const homeNavTexts: LocalizedStringsType<
  IHomeNavTexts
> = new LocalizedStrings({
  en: {
    HomeScreen: `HOME`,
    ShopNav: `SHOP`,
    AccountScreen: `ACCOUNT`,
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnHomeNavTexts), {}),
});
