import { NativeModules } from "react-native";

export const cnLanguageCodes = [
  "zh-Hans-CN",
  "zh-Hant-CN",
  "zh-HK-CN",
  "zh-Hans",
  "zh-Hant",
  "zh-HK",
  "zh-TW",
  "zh",
];

export const deviceLanguage = NativeModules.ReactLocalization.language;

export const isChinese = deviceLanguage.includes("zh");
