import { NavigationState } from "react-navigation";
import { IUserReducer } from "./userInterfaces";
import { IAccountMapReducer } from "./accountMapInterfaces";

export interface IRootState {
  nav: NavigationState;
  user: IUserReducer;
  accountMap: IAccountMapReducer;
}

export interface IPTextSizes {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  p6: number;
  p7?: number;
  h8?: number;
}

export interface IHTextSizes {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  h7?: number;
  h8?: number;
}

export interface ITextStylesConfig {
  applyHLetterSpacing: boolean;
  applyPLetterSpacing: boolean;
  fontFamily: string;
  headerSizes: IHTextSizes;
  hFontWeight: string;
  hLineHeightCoefficient: number;
  paragraphSizes: IPTextSizes;
  pFontWeight: string;
  pLineHeightCoefficient: number;
}

export interface IError {
  code: number;
  message?: string;
}

export type ActionResponse = IError | boolean;
