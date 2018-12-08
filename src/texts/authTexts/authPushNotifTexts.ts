import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "../textsLoader";

interface IAuthPushNotifTexts {
  title: string;
  body: string;
  continue: string;
}

const cnAuthPushNotifTexts = {
  title: `获得独家优惠的即时提醒！`,
  body: `通知可能包括警报，声音和图标徽章。`,
  continue: `确定`,
};

export const authPushNotifTexts: LocalizedStringsType<
  IAuthPushNotifTexts
> = new LocalizedStrings({
  en: {
    title: `Get instant alerts on exclusive offers!`,
    body: `Tap OK when prompted to allow us to send you notifications or Don’t Allow to skip. You can change permissions later in your Settings.`,
    continue: `CONTINUE`,
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnAuthPushNotifTexts),
    {},
  ),
});
