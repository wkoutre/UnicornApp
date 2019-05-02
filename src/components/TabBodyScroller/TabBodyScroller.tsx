import * as React from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  PanResponderGestureState,
  NativeSyntheticEvent,
  Dimensions,
  PanResponderInstance,
} from "react-native";
import { renderBodyItem } from "./renderBodyItem";
import { TabBodyScrollerHeader } from "./TabBodyScrollerHeader";
import {
  findRelevantValFromSwipe,
  getTabTextContainerStyle,
  dummyData,
} from "./helpers";
import {
  ITabBodyScrollerProps,
  ITabBodyScrollerState,
} from "./tabBodyScrollerInterfaces";

const WIDTH = Dimensions.get("screen").width;
const X_SWIPE_THRESHOLD_COEFF: number = 0.5;
const SWIPE_THRESHOLD: number = WIDTH * X_SWIPE_THRESHOLD_COEFF;
const SWIPE_SPEED: number = 12; // Animated.spring
const VELOCITY_THRESHOLD: number = 0.55;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  commonCard: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  animTabText: {
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "System",
  },
  tabItemBorder: {
    marginTop: 2,
    height: 2,
  },
});

/*
    tslint:disable:interface-name
  */
interface TabBodyScroller<IContentItem> {
  _tabTextContWidths: number[];
  _trackingTabX: number;
  _globalTabX: number;
  _globalBodyX: number;
  _animGlobalTabX: Animated.Value;
  _animGlobalTabXCol: Animated.Value;
  _animGlobalBodyX: Animated.Value;
  _animGlobalBodyXCol: Animated.Value;
  _bodyPanResponder: PanResponderInstance;
  _tabPanResponder: PanResponderInstance;
}

class TabBodyScroller<IContentItem> extends React.PureComponent<
  ITabBodyScrollerProps<IContentItem>,
  ITabBodyScrollerState
> {
  public static defaultProps = {
    animTabTextStyle: localStyles.animTabText,
    tabItemBorderStyle: localStyles.tabItemBorder,
    titles: dummyData.titles,
    content: dummyData.content,
    activeColors: dummyData.activeColors,
    inactiveColors: dummyData.inactiveColors,
    tabMarginHorizontal: 30,
    renderBodyItem,
    getTabTextContainerStyle,
    bodyContainerStyle: localStyles.bodyContainer,
  };

  constructor(props: ITabBodyScrollerProps<IContentItem>) {
    super(props);

    this.state = {
      swipeEnabled: true,
      bodyIsScrolling: true,
      tabTextWidthsInit: false,
      tabTextWidths: [],
      colorOutputRanges: [[]],
      opacityOutputRanges: [[]],
      tabTextContWidthAccSumsPos: [],
      tabTextContWidthAccSums: [],
      index: 0,
      bodyContainerInputRange: props.content.map((_text, i) => WIDTH * i),
    };

    this._tabTextContWidths = [];
    this._globalTabX = 0;
    this._globalBodyX = 0;
    this._trackingTabX = 0;
    this._animGlobalTabX = new Animated.Value(0);
    this._animGlobalTabXCol = new Animated.Value(0);
    this._animGlobalBodyX = new Animated.Value(0);
    this._animGlobalBodyXCol = new Animated.Value(0);

    /*
     *
     * Create tab pan responder
     *
     */

    this._tabPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        // return true if user is swiping, return false if it's a single click

        return !(gesture.dx === 0 && gesture.dy === 0);
      },
      onPanResponderMove: (_, gesture) => {
        const { tabTextContWidthAccSumsPos, bodyIsScrolling } = this.state;
        const { dx: tabX } = gesture;

        if (bodyIsScrolling) {
          this.setState({ bodyIsScrolling: false });
        }

        /*
        For if we want to enable tab flick-scrolling OR pan scrolling more than (this._index +- 1)

          tabX: gesture.dx,
          tabY,
        });
      */

        const globalAnimX = tabX * -1 + this._globalTabX * -1;

        if (
          globalAnimX > -25 &&
          globalAnimX <
            tabTextContWidthAccSumsPos[tabTextContWidthAccSumsPos.length - 1] +
              25
        ) {
          //   console.log(`Setting tab Animated.Values to ${globalAnimX}`);
          this._animGlobalTabX.setValue(globalAnimX);
          this._animGlobalTabXCol.setValue(globalAnimX);
          this._trackingTabX = globalAnimX;
        }
      },
      onPanResponderRelease: this.handleSettingTabPosition,
    });

    /*
     *
     * Create body pan responder
     *
     */
    this._bodyPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_event, gesture) => {
        const { dx, dy, vy } = gesture;

        if (
          (dx < -2 || dx > 2) && // low dx
          (dy > -5 || dy < 5) && // accounts for +- of gesture direction
          (vy > -VELOCITY_THRESHOLD && vy < VELOCITY_THRESHOLD) // disable when vy is high
        ) {
          return true;
        }

        return false;
      },
      onPanResponderMove: (_event, gesture) => {
        const { content } = this.props;
        const { tabTextWidthsInit, tabTextContWidthAccSumsPos } = this.state;
        const { dx: bodyX } = gesture;
        const globalAnimBodyX = bodyX * -1 + this._globalBodyX * -1;

        const totalWidth = WIDTH * content.length - 1 - WIDTH / 2 + 25;
        const upperLimit = tabTextWidthsInit
          ? totalWidth -
            tabTextContWidthAccSumsPos[tabTextContWidthAccSumsPos.length - 1] /
              2
          : totalWidth;

        if (globalAnimBodyX > -25 && globalAnimBodyX < upperLimit) {
          //   console.log(`Setting body Animated.Values to:`, globalAnimBodyX);

          this._animGlobalBodyX.setValue(globalAnimBodyX);
          this._animGlobalBodyXCol.setValue(globalAnimBodyX);
        }
      },
      onPanResponderRelease: this.handleSettingPosition,
    });
  }

  private handleTabLayout = (
    {
      nativeEvent: {
        layout: { width },
      },
    }: {
      nativeEvent: { layout: { width: number } };
    },
    index: number,
  ): void => {
    const { tabTextWidthsInit } = this.state;
    const {
      content,
      tabMarginHorizontal,
      inactiveColors,
      activeColors,
    } = this.props;

    this._tabTextContWidths[index] = width;

    if (
      this._tabTextContWidths.filter((n) => !!n).length === content.length &&
      !tabTextWidthsInit
    ) {
      //   console.log(
      //     `handling tabLayout: this._tabTextContWidths`,
      //     this._tabTextContWidths,
      //   );
      const initialTabTextWidths = [...this._tabTextContWidths];
      const tabTextContWidthAccSumsPos = [0];
      const tabTextContWidthAccSums = [0];
      let tabTextContWidthSumNeg = 0;

      initialTabTextWidths.forEach((num, i) => {
        const nextWidth =
          i === initialTabTextWidths.length - 1
            ? 0
            : initialTabTextWidths[i + 1] / 2;

        tabTextContWidthSumNeg -= num / 2 + tabMarginHorizontal * 2 + nextWidth;

        if (i < initialTabTextWidths.length - 1) {
          tabTextContWidthAccSums.push(tabTextContWidthSumNeg);

          tabTextContWidthAccSumsPos.push(-tabTextContWidthSumNeg);
        }
      });

      const colorOutputRanges: string[][] = content.map((_text) => []);
      const opacityOutputRanges: number[][] = content.map((_text) => []);

      content.forEach((_, ind: number) => {
        activeColors.forEach((color: string, colorIndex: number) => {
          const colorToPush = colorIndex === ind ? color : inactiveColors[ind];

          colorOutputRanges[ind].push(colorToPush);

          if (ind === colorIndex) {
            opacityOutputRanges[ind].push(1);
          } else {
            opacityOutputRanges[ind].push(0.5);
          }
        });
      });

      if (console.groupCollapsed) {
        console.groupCollapsed("*** All widths initialized ***");
        console.log(`tabTextContWidthAccSumsPos`, tabTextContWidthAccSumsPos);
        console.log(`tabTextContWidthAccSums`, tabTextContWidthAccSums);
        console.log(`opacityOutputRanges:`, opacityOutputRanges);
        console.log(`colorOutputRanges`, colorOutputRanges);
        console.groupEnd();
      }

      this.setState({
        tabTextWidths: initialTabTextWidths,
        tabTextContWidthAccSums,
        tabTextContWidthAccSumsPos,
        tabTextWidthsInit: true,
        colorOutputRanges,
        opacityOutputRanges,
      });
    }
  };

  private onSwipeComplete = (newIndex: number): void => {
    this.setState({
      swipeEnabled: true,
      index: newIndex,
      bodyIsScrolling: true,
    });
  };

  private getTabItemBorderStyle = (tabIndex: number) => {
    const { tabTextWidthsInit, tabTextWidths } = this.state;
    const { activeColors, tabItemBorderStyle } = this.props;

    if (!tabTextWidthsInit) {
      return {};
    }

    const inputRange = this.getContainerInputRange();
    const outputRange = inputRange.map((_, ind) =>
      ind === tabIndex ? tabTextWidths[ind] : 0,
    );

    const width = this.getAnimValToUse().interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });

    const backgroundColor = this.getAnimValToUse().interpolate({
      inputRange,
      outputRange: activeColors,
      extrapolate: "clamp",
    });

    return [tabItemBorderStyle, { width, backgroundColor }];
  };

  private getBodyStyle = (bodyIndex: number) => {
    const { tabTextContWidthAccSumsPos, tabTextWidthsInit } = this.state;

    if (!tabTextWidthsInit) {
      return { opacity: !bodyIndex ? 1 : 0 };
    }

    const inputRange = this.getContainerInputRange();
    const outputRange = tabTextContWidthAccSumsPos.map(
      (_, ind) => WIDTH * (bodyIndex - ind),
    );

    const opacityOutputRange = inputRange.map((_, ind) =>
      ind === bodyIndex ? 1 : 0,
    );

    // console.log(`body i is ${bodyIndex}`);
    // console.log(`inputRange is:`, inputRange);
    // console.log(`outputRange is:`, outputRange);
    // console.log(`opacityOutputRange:`, opacityOutputRange);

    const translateX = this.getAnimValToUse().interpolate({
      inputRange,
      outputRange,
    });

    const opacity = this.getAnimValToUse().interpolate({
      inputRange,
      outputRange: opacityOutputRange,
      extrapolate: "clamp",
    });
    return {
      opacity,
      transform: [{ translateX }],
    };
  };

  private getTabTextContainerStyle = (tabIndex: number) => {
    const { tabTextWidthsInit, tabTextWidths } = this.state;
    const { titles, tabMarginHorizontal } = this.props;

    if (!tabTextWidthsInit) {
      return {};
    }

    return getTabTextContainerStyle(
      tabIndex,
      tabTextWidths[tabIndex],
      titles,
      tabMarginHorizontal,
    );
  };

  private getHeaderContainerStyle = () => {
    const { tabTextWidthsInit, tabTextContWidthAccSums } = this.state;

    if (!tabTextWidthsInit) {
      return {};
    }

    const animValToUse = this.getAnimValToUse();
    const inputRange = this.getContainerInputRange();

    const translateX = animValToUse.interpolate({
      inputRange,
      outputRange: tabTextContWidthAccSums,
    });

    return {
      transform: [{ translateX }],
    };
  };

  private handleSettingTabPosition = (
    _: NativeSyntheticEvent<any>,
    gesture: PanResponderGestureState,
  ): void => {
    const {
      tabTextWidthsInit,
      tabTextContWidthAccSumsPos,
      tabTextContWidthAccSums,
      index,
    } = this.state;
    const { dx, vx } = gesture;

    if (!dx || !tabTextWidthsInit) {
      return;
    }

    console.log(`handling setting tab position on release. dx is ${dx}`);

    const TAB_SWIPE_THRESHOLD = WIDTH * 0.2 * X_SWIPE_THRESHOLD_COEFF;

    if (dx < -TAB_SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
      const startingPos = tabTextContWidthAccSums[index];
      const newSnapshotPos = startingPos + dx;
      const isOneAway =
        index + 1 < tabTextContWidthAccSums.length &&
        newSnapshotPos < startingPos &&
        newSnapshotPos > tabTextContWidthAccSums[index + 1];

      console.log(`isOneAway:`, isOneAway);

      if (vx < -VELOCITY_THRESHOLD && isOneAway) {
        this.forceSwipe("left");
      } else {
        const forcedIndex = findRelevantValFromSwipe(
          tabTextContWidthAccSumsPos,
          "left",
          this._trackingTabX,
          true,
        );

        console.log(`forcedIndex going left:`, forcedIndex);
        this.forceSwipe("left", 1, forcedIndex);
      }
    } else if (dx > TAB_SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
      const startingPos = tabTextContWidthAccSums[index];
      const newSnapshotPos = startingPos + dx;
      const isOneAway =
        index - 1 >= 0 &&
        newSnapshotPos > startingPos &&
        newSnapshotPos < tabTextContWidthAccSums[index - 1];

      console.log(`isOneAway:`, isOneAway);

      if (vx > VELOCITY_THRESHOLD && isOneAway) {
        this.forceSwipe("right");
      } else {
        const forcedIndex = findRelevantValFromSwipe(
          tabTextContWidthAccSumsPos,
          "right",
          this._trackingTabX,
          true,
        );

        console.log(`forcedIndex going right:`, forcedIndex);
        this.forceSwipe("right", 1, forcedIndex);
      }
    } else {
      this.resetPosition();
    }
  };

  private handleSettingPosition = (
    _event: NativeSyntheticEvent<any>,
    gesture: PanResponderGestureState,
  ): void => {
    const { dx, vx } = gesture;

    console.log(`handling setting body position on release`);

    if (dx < -SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
      this.forceSwipe("left");
    } else if (dx > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
      this.forceSwipe("right");
    } else {
      this.resetPosition();
    }
  };

  private forceSwipe = (
    direction: string,
    xMultiplier: number = 1,
    forceIndex?: number,
  ): void => {
    const { index, tabTextContWidthAccSumsPos } = this.state;
    const { content } = this.props;

    const isRight = direction === "right";

    console.log(
      `forceSwiping to the ${direction} with forceIndex of ${forceIndex}`,
    );

    if (
      (index === content.length - 1 && !isRight) ||
      (index === 0 && isRight)
    ) {
      console.log(`force swiping -> resetting position`);
      return this.resetPosition();
    }

    this.setState({ swipeEnabled: false });

    const bodyX = isRight ? WIDTH * xMultiplier : -WIDTH * xMultiplier;
    const { tabX, newIndex } = this.getTabXAndNewIndexFromCurrIndex(
      index,
      direction,
      xMultiplier,
      forceIndex,
    );

    const newGlobalTabX = tabTextContWidthAccSumsPos[newIndex * xMultiplier];

    const newGlobalBodyX = WIDTH * (newIndex * xMultiplier);

    if (console.groupCollapsed) {
      console.groupCollapsed("forceSwipe results:");
      console.log(`bodyX`, bodyX);
      console.log(`tabX:`, tabX);
      console.log(`newGlobalTabX:`, newGlobalTabX);
      console.log(`newGlobalBodyX:`, newGlobalBodyX);
      console.groupEnd("");
    }

    this._globalBodyX = -newGlobalBodyX;

    const tabColorAnimation = Animated.spring(this._animGlobalTabXCol, {
      toValue: newGlobalTabX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
    });
    const tabAnimation = Animated.spring(this._animGlobalTabX, {
      toValue: newGlobalTabX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true,
    });

    const bodyColorAnimation = Animated.spring(this._animGlobalBodyXCol, {
      toValue: newGlobalBodyX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
    });
    const bodyAnimation = Animated.spring(this._animGlobalBodyX, {
      toValue: newGlobalBodyX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true,
    });

    console.log(`About to do the animation`);
    Animated.parallel([
      tabAnimation,
      tabColorAnimation,
      bodyAnimation,
      bodyColorAnimation,
    ]).start(() => {
      console.log(`calling onSwipeComplete`);
      this.onSwipeComplete(newIndex);
    });
  };

  private getTabXAndNewIndexFromCurrIndex = (
    indexArg: number,
    direction: string,
    xMultiplier: number = 1,
    forceIndex?: number,
  ): { tabX: number; newIndex: number } => {
    const { tabTextWidthsInit, tabTextContWidthAccSums } = this.state;

    if (console.groupCollapsed) {
      console.groupCollapsed("getTabXAndNewIndexFromCurrIndex");
      console.log(`tabTextWidthsInit:`, tabTextWidthsInit);
      console.log("indexArg:", indexArg);
      console.log(`direction:`, direction);
      console.log("xMultiplier:", xMultiplier);
      console.log(`forceIndex:`, forceIndex);

      console.groupEnd();
    }

    if (!tabTextWidthsInit) {
      return {
        tabX: 0,
        newIndex: 0,
      };
    }

    const isRight = direction === "right";
    const newIndex =
      forceIndex !== undefined
        ? forceIndex
        : indexArg > 0 && isRight
        ? (indexArg - 1) * xMultiplier
        : (indexArg + 1) * xMultiplier;

    const tabX = tabTextContWidthAccSums[newIndex];

    this._globalTabX = tabX;
    this._trackingTabX = tabX;

    return {
      tabX,
      newIndex,
    };
  };

  private resetPosition = (): void => {
    const { index, bodyIsScrolling, tabTextContWidthAccSumsPos } = this.state;
    console.log(`Resetting position. bodyIsScrolling: ${bodyIsScrolling}`);

    const globalBodyReset = Animated.spring(this._animGlobalBodyX, {
      toValue: WIDTH * index,
      useNativeDriver: true,
    });

    const globalBodyColReset = Animated.spring(this._animGlobalBodyXCol, {
      toValue: WIDTH * index,
    });

    const globalTabXReset = Animated.spring(this._animGlobalTabX, {
      toValue: tabTextContWidthAccSumsPos[index],
      useNativeDriver: true,
    });

    const globalTabXColReset = Animated.spring(this._animGlobalTabXCol, {
      toValue: tabTextContWidthAccSumsPos[index],
    });

    Animated.parallel([
      globalTabXReset,
      globalTabXColReset,
      globalBodyReset,
      globalBodyColReset,
    ]).start(() => {
      if (!bodyIsScrolling) {
        this.setState({ bodyIsScrolling: true });
      }
    });
  };

  private renderBodys = (): React.ReactNodeArray => {
    const { index } = this.state;
    const { content } = this.props;

    return content
      .map((contentItem, i: number) => {
        const activeProps =
          i === index ? this._bodyPanResponder.panHandlers : {};

        return (
          <Animated.View
            key={i}
            {...activeProps}
            style={[this.getBodyStyle(i), localStyles.commonCard]}
          >
            {this.props.renderBodyItem(contentItem, i)}
          </Animated.View>
        );
      })
      .reverse();
  };

  private handleSwipeToStart = (): void => {
    this.handleTabPress(0);
  };

  private handleTabPress = (index: number): void => {
    const { swipeEnabled, index: stateIndex, bodyIsScrolling } = this.state;

    if (!swipeEnabled) {
      return;
    }

    console.log(
      `handling tab press for index ${index}. bodyIsScrolling: ${bodyIsScrolling}`,
    );

    const direction = index > stateIndex ? "left" : "right";

    this.forceSwipe(direction, 1, index);
  };

  private getContainerInputRange = () =>
    this.state.bodyIsScrolling
      ? this.state.bodyContainerInputRange
      : this.state.tabTextContWidthAccSumsPos;

  private getAnimValToUse = () =>
    this.state.bodyIsScrolling
      ? this._animGlobalBodyXCol
      : this._animGlobalTabXCol;

  private getAnimTabTextStyle = (i: number) => {
    const {
      tabTextWidthsInit,
      colorOutputRanges,
      opacityOutputRanges,
    } = this.state;
    const { animTabTextStyle } = this.props;

    if (!tabTextWidthsInit) {
      return {
        opacity: 0,
      };
    }

    const inputRange = this.getContainerInputRange();

    const color = this.getAnimValToUse().interpolate({
      inputRange,
      outputRange: colorOutputRanges[i],
      extrapolate: "clamp",
    });

    const opacity = this.getAnimValToUse().interpolate({
      inputRange,
      outputRange: opacityOutputRanges[i],
      extrapolate: "clamp",
    });

    return [animTabTextStyle, { color, opacity }];
  };

  render(): React.ReactNode {
    const { index } = this.state;
    const { titles, tabMarginHorizontal, bodyContainerStyle } = this.props;

    return (
      <View style={localStyles.container}>
        <TabBodyScrollerHeader
          titles={titles}
          tabMarginHorizontal={tabMarginHorizontal}
          handleTabLayout={this.handleTabLayout}
          handleTabPress={this.handleTabPress}
          getAnimTabTextStyle={this.getAnimTabTextStyle}
          getTabTextContainerStyle={this.getTabTextContainerStyle}
          getHeaderContainerStyle={this.getHeaderContainerStyle}
          getTabItemBorderStyle={this.getTabItemBorderStyle}
          handleSwipeToStart={this.handleSwipeToStart}
          panResponder={this._tabPanResponder}
          index={index}
        />
        <View style={bodyContainerStyle}>{this.renderBodys()}</View>
      </View>
    );
  }
}

export { TabBodyScroller };
