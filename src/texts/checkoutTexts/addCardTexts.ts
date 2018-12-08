import { IOS } from "react-native-common-lib";
import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType
} from "react-native-localization";
import { cnLanguageCodes } from "../textsLoader";

interface IAddCardTexts {
  title: string;
  enterCardDetails: string;
  cancel: string;
  addCard: string;
  cardNumberErrorMessage: string;
  scanCard: string;
  scanCardAfterScanButtonText: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardNumberPlaceholder: string;
  expMonthPlaceholder: string;
  expYearPlaceholder: string;
  cvvPlaceholder: string;
  postalPlaceholder: string;
  next: string;
}

const cnAddCardTexts: IAddCardTexts = {
  title: "卡详细信息",
  enterCardDetails: "输入卡号，以卡号开头。",
  cancel: "取消",
  addCard: "添加卡片",
  cardNumberErrorMessage: "您必须提供有效的卡号",
  scanCard: "用相机扫描",
  scanCardAfterScanButtonText: "再次扫描卡片",
  cardNumber: "卡号",
  expirationDate: "截止日期",
  cvv: "安全码",
  expMonthPlaceholder: "MM",
  expYearPlaceholder: "YYYY",
  cardNumberPlaceholder: "卡号",
  cvvPlaceholder: "CVV",
  postalPlaceholder: "邮政编码",
  next: "下一个"
};

export const addCardTexts: LocalizedStringsType<
  IAddCardTexts
> = new LocalizedStrings({
  en: {
    title: "Card Details",
    enterCardDetails: "Enter your card details starting with the card number.",
    cancel: "Cancel",
    addCard: "Add Card",
    cardNumberErrorMessage: "You must provide a valid card number",
    scanCard: "Scan With Camera",
    scanCardAfterScanButtonText: "Scan Card Again",
    cardNumber: "Card Number",
    expirationDate: "Expiration Date",
    cvv: "Security Code",
    expMonthPlaceholder: "MM",
    expYearPlaceholder: "YYYY",
    cardNumberPlaceholder: "Card Number",
    cvvPlaceholder: IOS ? "CVV" : "CVC",
    postalPlaceholder: "Postal Code",
    next: "Next"
  },
  ...cnLanguageCodes.reduce((prev, curr) => (prev[curr] = cnAddCardTexts), {})
});
