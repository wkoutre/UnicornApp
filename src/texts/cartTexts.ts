import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "./textsLoader";

interface ICartTexts {
  headerTitle: string;
  empty: string;
  subTotal: string;
  freeShipping: string;
  discount: string;
  total: string;
  currencySymbol: string;
  enterPromoCode: string;
  buyWith: string;
  checkout: string;
  delete: string;
  cancel: string;
  apply: string;
  invalidCode: string;
  discountApplied: string;
  remove: string;
  size: string;
  centsSeparator: string;
  quantity: string;
}

const cnCartTexts = {
  headerTitle: `购物车`,
  empty: `您的购物车中没有商品。`,
  subTotal: `小计`,
  freeShipping: "免费送货 ",
  discount: `折扣 `,
  total: `订单总计:`,
  currencySymbol: "¥",
  enterPromoCode: ``,
  buyWith: ``,
  checkout: `结帐`,
  delete: `删除`,
  cancel: ``,
  apply: ``,
  invalidCode: ``,
  discountApplied: ``,
  remove: ``,
  size: "尺寸",
  centsSeparator: ".",
  quantity: `数量`,
};

export const cartTexts: LocalizedStringsType<ICartTexts> = new LocalizedStrings(
  {
    en: {
      headerTitle: `Cart`,
      empty: `Your Cart is Empty`,
      subTotal: `Subtotal`,
      freeShipping: "Free Shipping",
      discount: `Discount`,
      total: `Total:`,
      currencySymbol: "$",
      enterPromoCode: `Enter Promotion Code`,
      buyWith: `Buy with`,
      checkout: `CHECKOUT`,
      delete: `Delete`,
      cancel: `Cancel`,
      apply: `Apply`,
      invalidCode: `Invalid Promo Code`,
      discountApplied: `APPLIED`,
      remove: `REMOVE`,
      size: "Size",
      centsSeparator: ".",
      quantity: `Quantity`,
    },
    ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnCartTexts), {}),
  },
);
