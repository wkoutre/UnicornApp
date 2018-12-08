import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "../textsLoader";

interface IAuthAccountOptionsTexts {
  title: string;
  body: string;
  goToAccount: string;
  skip: string;
}

const cnAuthAccountOptionsTexts = {
  title: `Log In or Create an Account`,
  body: `Check out faster when you log in or create a Stadium Goods account.`,
  goToAccount: `LOG IN / CREATE AN ACCOUNT`,
  skip: `SKIP`,
};

export const authAccountOptionsTexts: LocalizedStringsType<
  IAuthAccountOptionsTexts
> = new LocalizedStrings({
  en: {
    title: `Log In or Create an Account`,
    body: `Check out faster when you log in or create a Stadium Goods account.`,
    goToAccount: `LOG IN / CREATE AN ACCOUNT`,
    skip: `SKIP`,
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnAuthAccountOptionsTexts),
    {},
  ),
});
