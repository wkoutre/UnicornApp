import { StyleSheet, Dimensions, TextStyle } from "react-native";

const localStyles = StyleSheet.create<{
  tab: TextStyle;
}>({
  tab: {
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "System",

    marginHorizontal: 30,
  },
});

const { width: WIDTH } = Dimensions.get("screen");

export const getTabStyle = (
  index: number,
  tabWidth: number,
  titles: string[],
) => {
  if (index === 0) {
    return [
      localStyles.tab,
      {
        marginLeft: WIDTH / 2 - tabWidth / 2,
      },
    ];
  }

  if (index === titles.length - 1) {
    return [
      localStyles.tab,
      {
        marginRight: WIDTH / 2 - tabWidth / 2,
      },
    ];
  }

  return localStyles.tab;
};
