import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType
} from "react-native-localization";
import { IOS } from "react-native-common-lib";
import { cnLanguageCodes } from "../textsLoader";

interface IPaymentOptionTexts {
  navTitle: string;
  billingTitle: string;
  useShipForBilling: string;
  paymentTitle: string;
  summaryTitle: string;
  cartDetails: string;
  subtotal: string;
  shipHandling: string;
  tax: string;
  total: string;
  buttonTitle: string;
  cancel: string;
  title: string;
  options: {
    paypal: string;
    credit: string;
    applePay?: string;
  };
}

const cnPaymentOptionTexts: IPaymentOptionTexts = {
  navTitle: "付款方式",
  billingTitle: "输入账单地址",
  useShipForBilling: "使用送货地址进行结算",
  paymentTitle: "付款方法",
  summaryTitle: "订购摘要",
  cartDetails: "购物车详情",
  subtotal: "小计",
  shipHandling: "运输和处理",
  tax: "税",
  total: "总:",
  buttonTitle: "放置我的订单",
  cancel: "取消",
  title: "选择付款选项",
  options: IOS
    ? {
        paypal: "贝宝",
        credit: "信用卡或借记卡",
        applePay: "Apple Pay"
      }
    : {
        paypal: "贝宝",
        credit: "信用卡或借记卡"
      }
};

export const paymentOptionTexts: LocalizedStringsType<
  IPaymentOptionTexts
> = new LocalizedStrings({
  en: {
    navTitle: "Payment Options",
    billingTitle: "ENTER A BILLING ADDRESS",
    useShipForBilling: "Use shipping address for Billing",
    paymentTitle: "PAYMENT METHOD",
    summaryTitle: "ORDER SUMMARY",
    cartDetails: "CART DETAILS",
    subtotal: "Subtotal",
    shipHandling: "Shipping & Handling",
    tax: "Tax",
    total: "Total:",
    buttonTitle: "PLACE MY ORDER",
    cancel: "Cancel",
    title: "Select Payment Option",
    options: IOS
      ? {
          paypal: "PayPal",
          credit: "Credit or Debit Card",
          applePay: "Apple Pay"
        }
      : {
          paypal: "PayPal",
          credit: "Credit or Debit Card"
        }
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnPaymentOptionTexts),
    {}
  )
});
