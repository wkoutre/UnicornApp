import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "../textsLoader";

interface IAuthLocationTexts {
  title: string;
  body: string;
  continue: string;
}

const cnAuthLocationTexts = {
  title: `不要错过当地的活动和优惠！`,
  body: `当提示打开位置服务或不允许跳过时，点击确定。 您可以稍后在“设置”中更改权限。`,
  continue: `确定`,
};

export const authLocationTexts: LocalizedStringsType<
  IAuthLocationTexts
> = new LocalizedStrings({
  en: {
    title: `Don't miss out on local events and deals!`,
    body: `Tap OK when prompted to turn on location services or Don’t Allow to skip. You can change permissions later in your Settings.`,
    continue: `CONTINUE`,
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnAuthLocationTexts),
    {},
  ),
});
