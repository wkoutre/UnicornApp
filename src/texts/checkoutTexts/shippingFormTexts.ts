import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType
} from "react-native-localization";
import { IShippingFormTexts } from "@interfaces/checkoutInterfaces";
import { isChinese, cnLanguageCodes } from "../textsLoader";

const cnShippingFormTexts = {
  reset: "重置",
  errorTitle: "交易错误",
  errorBody: "您尚未收费。请重试或联系 support@stadiumgoods.com",
  errorAfterPaymentTitle: "支付处理器和Stadium Stadium之间存在通信错误。",
  errorAfterPaymentBody: "请联系support@stadiumgoods.com",
  navTitle: `发货信息`,
  title: `输入收货地址`,
  continueButton: `确认`,
  placeholders: {
    notice: `*必填`,
    last_name: `姓*`,
    first_name: `名*`,
    address_line_1: `街道*`,
    postal: `邮政编码*`,
    city: `市级行政区*`,
    province: `省份*`,
    phone: `电话*`,
    email: `电子邮件*`,
    country: `国家：中国`
  }
};

export const shippingFormTexts: LocalizedStringsType<
  IShippingFormTexts
> = new LocalizedStrings({
  en: {
    reset: "Reset",
    navTitle: `Shipping Information`,
    title: `ENTER A SHIPPING ADDRESS`,
    // continueButton: `CONTINUE TO SHIPPING OPTIONS`,
    continueButton: `CONTINUE TO SHIPPING OPTIONS`,
    errorTitle: "Transaction Error",
    errorBody:
      "You have not charged. Please try again or contact support@stadiumgoods.com",
    errorAfterPaymentTitle:
      "There has been a communication error between the payment processor and Stadium Goods.",
    errorAfterPaymentBody: "Please contact support@stadiumgoods.com",
    placeholders: {
      notice: "",
      first_name: `First Name*`,
      last_name: `Last Name*`,
      address_line_1: `Street Address*`,
      address_line_2: `Apt/Suite`,
      postal: `Zip/Postal*`,
      city: `City*`,
      province: `State*`,
      country: `Country*`,
      phone: `Phone*`,
      email: `Email*`
    },
    checkoutParams: {
      destination: {
        address_line_1: "",
        address_line_2: "",
        city: "",
        province: "",
        postal: "",
        country: ""
      },
      customer: {
        first_name: "",
        last_name: "",
        phone: "",
        email: ""
      }
    }
  },
  ...cnLanguageCodes.reduce(
    (prev, curr) => (prev[curr] = cnShippingFormTexts),
    {}
  )
});

const keys = Object.keys(shippingFormTexts.placeholders);
const values = isChinese
  ? [
      "",
      "Koutrelakos",
      "Nick",
      "10 Beverly Hills Dr",
      "90024",
      "Los Angeles",
      "CA",
      "4438788819",
      "nick@seriesx.io"
    ]
  : [
      "",
      "Nick",
      "Koutrelakos",
      "10 Beverly Hills Dr",
      "",
      "90024",
      "Los Angeles",
      "CA",
      "USA",
      "4438788819",
      "nick@seriesx.io"
    ];

export const devMockData = keys.map((key, i) => {
  return {
    key,
    value: values[i]
  };
});
