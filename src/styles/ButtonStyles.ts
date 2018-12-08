import { StyleSheet } from "react-native";

export const DEFAULT_HIT_SLOP = {
  top: 5,
  right: 5,
  left: 5,
  bottom: 5
};

export const LARGE_HIT_SLOP = {
  top: 10,
  right: 10,
  left: 10,
  bottom: 10
};

export const BUTTON_HEIGHT: number = 44;

export const BUTTON_DEFAULTS = {
  height: BUTTON_HEIGHT
};

const BUTTON_FONT_WEIGHT = "400";

export const ButtonStyles = StyleSheet.create({
  full: {
    ...BUTTON_DEFAULTS,
    width: "100%"
  },
  absoluteBottom: { position: "absolute", bottom: 0 }
});

export const ButtonTextStyles = {
  whiteText: {
    color: "white",
    fontWeight: BUTTON_FONT_WEIGHT,
    textAlign: "center"
  },
  blackText: {
    color: "black",
    fontWeight: BUTTON_FONT_WEIGHT,
    textAlign: "center"
  },
  largeText: {
    size: 1
  }
};
