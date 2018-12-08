import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { cnLanguageCodes } from "../textsLoader";

interface IOrderConfirmationTexts {
  navTitle: string;
  title: string;
  emailBody: string[];
  orderInfo: string;
  orderNumber: string;
  orderPlaced: string;
  momentFormat: string;
  shippingInfo: string;
  name: string;
  address: string;
  phoneNumber: string;
  shippingMethod: string;
  paymentMethod: string;
  paymentMethodType: string;
  amount: string;
  paymentTotal: string;
  subtotal: string;
  shipHandling: string;
  tax: string;
  discount: string;
  total: string;
  cartDetails: string;
  buttonTitle: string;
  cnOriginalShipping: string;
  cnFreeShipping: string;
  alipay: string;
}

const cnShippingFormTexts = {
  navTitle: `订单确认`,
  title: "感谢您的购买!",
  emailBody: [
    "确认您的订单的电子邮件已发送至 ",
    "。当您的货物已经发货时，您将收到一封电子邮件。",
  ],
  orderInfo: `订单信息`,
  orderNumber: `订单号:`,
  orderPlaced: `订单日期:`,
  momentFormat: `YYYY-MM-DD`,
  shippingInfo: `送货信息`,
  name: `姓名:`,
  address: `地址:`,
  phoneNumber: `电话:`,
  paymentMethod: `付款方法`,
  paymentMethodType: `银联/信用卡/借记卡:`,
  amount: `金额:`,
  paymentTotal: "",
  subtotal: `小计`,
  shipHandling: `免费送货`,
  tax: `税额`,
  discount: `折扣`,
  total: `订单总计`,
  cartDetails: `订单汇总`,
  buttonTitle: "继续购物",
  cnOriginalShipping: `¥120.00`,
  cnFreeShipping: "¥0",
  alipay: `支付宝`,
};

export const orderConfirmationTexts: LocalizedStringsType<
  IOrderConfirmationTexts
> = new LocalizedStrings({
  en: {
    navTitle: `Order Confirmation`,
    title: "Thank you for your order!",
    emailBody: [
      "An email confirming your order has been sent to ",
      ". You will be sent a further email when your goods have been dispatched.",
    ],
    orderInfo: "ORDER INFORMATION",
    orderNumber: "Order Number:",
    orderPlaced: "Order Placed:",
    momentFormat: `MMM DD, YYYY`,
    shippingInfo: "SHIPPING INFORMATION",
    name: "",
    address: "",
    phoneNumber: `Phone Number:`,
    shippingMethod: "Method:",
    paymentMethod: "PAYMENT METHOD",
    paymentMethodType: "Credit Card",
    amount: "Amount:",
    paymentTotal: "PAYMENT TOTAL",
    subtotal: "Subtotal",
    shipHandling: "Shipping & Handling",
    tax: "Tax",
    discount: "Discount",
    total: "Total:",
    cartDetails: "CART DETAILS",
    buttonTitle: "CONTINUE SHOPPING",
    cnOriginalShipping: "",
    cnFreeShipping: "",
    alipay: `Alipay`,
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnShippingFormTexts),
    {},
  ),
});
