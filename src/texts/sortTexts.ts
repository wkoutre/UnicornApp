import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface ISortTexts {
  title: string;
}

const cnSortTexts = {
  title: `排序方式`,
};

export const sortTexts: LocalizedStringsType<ISortTexts> = new LocalizedStrings(
  {
    en: {
      title: `Sort By`,
    },
    ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnSortTexts), {}),
  },
);
