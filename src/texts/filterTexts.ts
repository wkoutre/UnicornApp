import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface ICommonFilterTexts {
  reset: string;
  filter: string;
  sort: string;
  apply: string;
}

const cnCommonFilterTexts = {
  reset: `重置筛选`,
  filter: `筛选`,
  sort: `排序方式`,
  apply: ` 确认`,
};

export const commonFilterTexts: LocalizedStringsType<
  IObj<string>
> = new LocalizedStrings({
  en: {
    reset: `RESET`,
    filter: `FILTER`,
    sort: `SORT`,
    apply: `APPLY`,
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnCommonFilterTexts),
    {},
  ),
});
