import { IOS } from "react-native-common-lib";
import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface ICommonTexts {
  currencySymbol: string;
  centsSeparator: string;
  paymentMethods: string[];
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantName: string;
  totalToFixed: string;
  shipping: string;
  noSize: string;
  noData: string;
  use: string;
  toBuy: string;
  search: string;
  shop: string;
  cart: string;
}

const cnCommonTexts = {
  currencySymbol: "¥",
  centsSeparator: ".",
  paymentMethods: IOS ? ["apple-pay"] : ["android-pay"],
  countryCode: "CN",
  currencyCode: "CNY",
  supportedNetworks: ["visa", "mastercard"],
  merchantName: `Stadium Goods`,
  totalToFixed: "2",
  shipping: `CN-Shipping`,
  noSize: `N/A`,
  noData: "No results",
  use: "用",
  toBuy: "付款",
  search: "搜索",
  shop: "购买",
  cart: "购物车",
};

export const commonTexts: LocalizedStringsType<
  ICommonTexts
> = new LocalizedStrings({
  en: {
    currencySymbol: "$",
    centsSeparator: ".",
    paymentMethods: IOS ? ["apple-pay"] : ["android-pay"],
    countryCode: "US",
    currencyCode: "USD",
    supportedNetworks: ["visa", "mastercard", "amex"],
    merchantName: `Stadium Goods`,
    totalToFixed: "2",
    shipping: `shipping`,
    noSize: `N/A`,
    noData: "No results",
    use: "Use",
    toBuy: "to Buy",
    search: "Search",
    shop: "Shop",
    cart: "Cart",
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnCommonTexts), {}),
});
