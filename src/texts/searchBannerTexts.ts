import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface ISearchBannerTexts {
  nike: string;
  jordan: string;
  adidas: string;
}

const cnSearchBannerTexts = {
  nike: `购买 Nike`,
  jordan: `购买 Jordan`,
  adidas: `购买 Adidas`,
};

export const searchBannerTexts: LocalizedStringsType<
  ISearchBannerTexts
> = new LocalizedStrings({
  en: {
    nike: `Shop Nike`,
    jordan: `Shop Jordan`,
    adidas: `Shop Adidas`,
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnSearchBannerTexts),
    {},
  ),
});
