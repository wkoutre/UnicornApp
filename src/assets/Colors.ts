const createDisabledColors = (
  regCols: { [colorName: string]: string },
  opacity: number = 0.7
): { [colorName: string]: string } => {
  const disabledCols: { [colorName: string]: string } = {};

  for (const [key, val] of Object.entries(regCols)) {
    // if it's an rgb
    if (val.includes("rgb") && !val.includes("rgba")) {
      const split = val.split(",");
      const disabledKey = `disabled${key[0].toUpperCase()}${key.slice(1)}`;

      split.push(` ${opacity}`);
      split[0] = split[0].replace("rgb(", "");

      const newColor = `rgba(${split.join(",").replace(")", "")})`;

      disabledCols[disabledKey] = newColor;
    }
  }

  return disabledCols;
};

const regularColors: { [colorName: string]: string } = {
  navBorder: "#A7A7AA",
  black10: "rgba(0, 0, 0, 0.1)",
  black19s: "rgb(19, 19, 19)",
  black19s80: "rgba(19, 19, 19, 0.8)",
  black19s10: "rgba(19, 19, 19, 0.1)",
  black20: "rgba(0, 0, 0, 0.2)",
  black3s: "rgb(3, 3, 3)",
  black51s: "rgb(51, 51, 51)",
  black50: "rgba(0, 0, 0, 0.5)",
  black80: "rgba(0, 0, 0, 0.8)",
  black: "rgb(0, 0, 0)",
  iosGray: "rgb(239, 239, 244)",
  blueGray50: "rgba(171, 179, 189, 0.5)",
  gray162s: "rgb(162, 162, 162)",
  gray204s: "rgb(204, 204, 204)",
  gray206s: "rgb(206, 206, 206)",
  gray227s: "rgb(227, 227, 227)",
  gray238s: "rgb(238, 238, 238)",
  grayBrown78: "rgba(77, 77, 77, 0.78)",
  green: "rgb(24, 165, 67)",
  hyperlink: "rgb(0, 122, 255)",
  paleGrey: "rgb(237, 239, 240)",
  red: "rgb(164, 29, 35)",
  bloodRed: "rgb(208, 2, 27)",
  steel: "rgb(137, 139, 142)",
  white20: "rgba(255, 255, 255, 0.2)",
  white128s: "rgb(128, 128, 128)",
  white229s: "rgb(229, 229, 229)",
  white238s: "rgb(238, 238, 238)",
  white247s: "rgb(247, 247, 247)",
  white253s: "rgb(253, 253, 253)",
  white50: "rgba(255, 255, 255, 0.5)",
  white80: "rgba(255, 255, 255, 0.8)",
  white90: "rgba(255, 255, 255, 0.9)",
  white: "rgb(255, 255, 255)"
};

export const Colors: { [colorName: string]: string } = {
  ...regularColors,
  ...createDisabledColors(regularColors)
};
