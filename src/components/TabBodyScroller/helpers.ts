import { Dimensions } from "react-native";
const { width: WIDTH } = Dimensions.get("screen");

export const dummyData = {
  titles: ["Tab 1", "Tab 2", "Tab 3 That is Long", "Last Tab"],
  content: ["First Title", "Second", "Third Title", "Final"],
  //   activeColors: ["red", "blue", "green", "orange"],
  activeColors: ["blue", "blue", "blue", "blue"],
  inactiveColors: ["gray", "gray", "gray", "gray"],
};

export const getTabTextContainerStyle = (
  index: number,
  tabWidth: number,
  titles: string[],
  marginHorizontal: number,
) => {
  if (index === 0) {
    return {
      marginLeft: WIDTH / 2 - tabWidth / 2,
      marginRight: marginHorizontal,
    };
  }

  if (index === titles.length - 1) {
    return {
      marginLeft: marginHorizontal,
      marginRight: WIDTH / 2 - tabWidth / 2,
    };
  }

  return { marginHorizontal };
};

export const findRelevantValFromSwipe = (
  arrOfVals: number[],
  direction: "right" | "left",
  offsetX: number,
  returnIndex?: boolean,
) => {
  let left = 0;
  let lastMid = 0;
  let right = arrOfVals.length - 1;

  // binary search
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    lastMid = mid;

    if (arrOfVals[mid] > offsetX && arrOfVals[mid - 1] < offsetX) {
      const currDiff = Math.abs(arrOfVals[mid] - offsetX);
      const prevDiff = Math.abs(arrOfVals[mid - 1] - offsetX);

      const indexToReturn =
        direction === "left"
          ? currDiff < prevDiff
            ? mid
            : mid - 1
          : currDiff > prevDiff
          ? mid - 1
          : mid;

      if (returnIndex) {
        return indexToReturn;
      }

      return arrOfVals[indexToReturn];
    }
    if (arrOfVals[mid] < offsetX) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (returnIndex) {
    return lastMid;
  }

  return arrOfVals[lastMid];
};
