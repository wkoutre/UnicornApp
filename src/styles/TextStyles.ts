/*
  tslint:disable:no-unused-expression
*/

import { ViewStyle } from "react-native";
import { CommonAssets } from "react-native-common-lib";
import { IPTextSizes, IHTextSizes, ITextStylesConfig } from "@interfaces";
import { Colors } from "@assets";

const getPTextSizes = (): IPTextSizes => {
  return {
    p1: 18,
    p2: 16,
    p3: 14,
    p4: 13,
    p5: 12,
    p6: 10,
    p7: 9
  };
};

const getHTextSizes = (): IHTextSizes => {
  return {
    h1: 40,
    h2: 36,
    h3: 32,
    h4: 28,
    h5: 24,
    h6: 22,
    h7: 20,
    h8: 18
  };
};

export const TEXT_SHADOW: ViewStyle = {
  shadowColor: Colors.black,
  shadowOffset: {
    width: 0,
    height: 3
  },
  elevation: 2,
  shadowRadius: 4,
  shadowOpacity: 0.8
};

export const DEFAULT_PARAGRAPH_SIZES: IPTextSizes = getPTextSizes();

export const DEFAULT_HEADER_SIZES: IHTextSizes = getHTextSizes();

export const DEFAULT_H_FONT_WEIGHT = "300";
export const DEFAULT_P_FONT_WEIGHT = "300";
export const DEFAULT_FONT_FAMILY: string = "System";

const textStylesConfig: ITextStylesConfig = {
  applyHLetterSpacing: false,
  applyPLetterSpacing: false,
  fontFamily: DEFAULT_FONT_FAMILY,
  headerSizes: DEFAULT_HEADER_SIZES,
  hFontWeight: DEFAULT_H_FONT_WEIGHT,
  hLineHeightCoefficient: 1.25,
  paragraphSizes: DEFAULT_PARAGRAPH_SIZES,
  pFontWeight: DEFAULT_P_FONT_WEIGHT,
  pLineHeightCoefficient: 1.25
};

const Assets = new CommonAssets({
  Colors,
  textStylesConfig
});

export const TextStyles: any = Assets.textStyles;
