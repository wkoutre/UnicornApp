import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface ISearchSortFilterTexts {
  placeholder: string;
  cancel: string;
  navTitle: string;
  searchResults: string[];
  resultTexts: string[];
  noResultTexts: string[];
  isLoading: string;
}

const cnSearchSortFilterTexts = {
  placeholder: "搜索",
  cancel: "取消",
  navTitle: `搜索结果`,
  resultTexts: [`您搜索的`, `返回`, `结果`],
  isLoading: `仍在加载...`,
  noResultTexts: [
    `未找到匹配结果`,
    `. 请再尝试其他搜索。您可能会对下面的热门商品感兴趣:`,
  ],
};

export const searchSortFilterTexts: LocalizedStringsType<
  ISearchSortFilterTexts
> = new LocalizedStrings({
  en: {
    placeholder: "What are you looking for?",
    cancel: "CANCEL",
    navTitle: `Search Results`,
    resultTexts: [`Your search for`, `returned`, `results`],
    isLoading: `is still loading...`,
    noResultTexts: [
      `Search was unable to find any results for`,
      `. You may have typed your word incorrectly, or are being too specific. Try using a broader search phrase or try one of our most popular search phrases.`,
    ],
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnSearchSortFilterTexts),
    {},
  ),
});
