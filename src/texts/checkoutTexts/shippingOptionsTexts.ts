import LocalizedStrings, {
  LocalizedStrings as LocalizedStringsType,
} from "react-native-localization";
import { IPaymentShippingOptions } from "@interfaces/paymentInterfaces";
import { cnLanguageCodes } from "../textsLoader";

export interface IShippingOptionsTexts {
  title: string;
  navTitle: string;
  continueButton: string;
  shippingOptions: IPaymentShippingOptions[];
}

const cnShippingOptionsTexts = {
  navTitle: `Shipping Options`,
  title: `SELECT A SHIPPING OPTION`,
  continueButton: `CONTINUE TO PAYMENT OPTIONS`,
  shippingOptions: [
    {
      selected: true,
      id: "ground",
      label: "FedEx Ground:",
      amount: { currency: "¥", value: "12.14" },
      detail: "Arrives in 3-5 business days",
    },
    {
      selected: false,
      id: "express",
      label: "FedEx 2 Day:",
      amount: { currency: "¥", value: "16.48" },
      detail: "Arrives in 2 business days",
    },
    {
      selected: false,
      id: "next-day",
      label: "FedEx 1 Day:",
      amount: { currency: "¥", value: "29.18" },
      detail: "Arrives in 1 business day",
    },
  ],
};

export const shippingOptionsTexts: LocalizedStringsType<
  IShippingOptionsTexts
> = new LocalizedStrings({
  en: {
    navTitle: `Shipping Options`,
    title: `SELECT A SHIPPING OPTION`,
    continueButton: `CONTINUE TO PAYMENT OPTIONS`,
    shippingOptions: [
      {
        selected: true,
        id: "ground",
        label: "FedEx Ground:",
        amount: { currency: "$", value: "12.14" },
        detail: "Arrives in 3-5 business days",
      },
      {
        selected: false,
        id: "express",
        label: "FedEx 2 Day:",
        amount: { currency: "$", value: "16.48" },
        detail: "Arrives in 2 business days",
      },
      {
        selected: false,
        id: "next-day",
        label: "FedEx 1 Day:",
        amount: { currency: "$", value: "29.18" },
        detail: "Arrives in 1 business day",
      },
    ],
  },
  // ...cnLanguageCodes.reduce(
  //   (prev, curr) => (prev[curr] = cnShippingOptionsTexts),
  //   {},
  // ),
});
