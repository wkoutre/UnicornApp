import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface IAccountScreenTexts {
  button: string;
  email: string;
  emailSubject: string;
  phone: string;
}

interface IAccountScreenRowTexts {
  locations?: string;
  feedback?: string;
  about: string;
  authenticity: string;
  shipping: string;
  privacy: string;
  toc: string;
  contactUs: string;
  version: string;
}

const cnRowTexts = {
  locations: "",
  feedback: "",
  about: `关于我们`,
  authenticity: `真伪`,
  shipping: `交货和退货政策`,
  privacy: `隐私政策`,
  toc: `使用条款和条件`,
  contactUs: `联系我们`,
  version: `应用版本`,
};

const cnAccountScreenTexts = {
  button: `LOG IN / CREATE ACCOUNT`,
  email: `support@stadiumgoods.com`,
  emailSubject: "Hello",
  phone: ``,
};

export const accountScreenRowTexts: LocalizedStringsType<
  IAccountScreenRowTexts
> = new LocalizedStrings({
  en: {
    locations: `STORE LOCATIONS`,
    about: `ABOUT US`,
    authenticity: `AUTHENTICITY`,
    shipping: `DELIVERY AND RETURNS`,
    privacy: `PRIVACY POLICY`,
    feedback: `PROVIDE FEEDBACK`,
    toc: `TERMS AND CONDITIONS`,
    contactUs: `CONTACT US`,
    version: `App Version`,
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnRowTexts), {}),
});

export const accountScreenTexts: LocalizedStringsType<
  IAccountScreenTexts
> = new LocalizedStrings({
  en: {
    button: `LOG IN / CREATE ACCOUNT`,
    email: `support@stadiumgoods.com`,
    emailSubject: "Hello",
    phone: `+1 646-779-8410`,
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnAccountScreenTexts),
    {},
  ),
});
