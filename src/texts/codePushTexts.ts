import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface ICodePushTexts {
  title: string;
  mandatoryUpdateMessage: string;
  mandatoryContinueButtonLabel: string;
}

const cnCodePushTexts = {
  title: `好消息!`,
  mandatoryUpdateMessage: `有更新可用!`,
  mandatoryContinueButtonLabel: `下载并安装`,
};

export const codePushTexts: LocalizedStringsType<
  ICodePushTexts
> = new LocalizedStrings({
  en: {
    title: `Great news!`,
    mandatoryUpdateMessage: `There's an update available!`,
    mandatoryContinueButtonLabel: `Download and Install`,
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnCodePushTexts), {}),
});
