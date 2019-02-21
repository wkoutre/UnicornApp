import * as React from "react";
import { isEqual } from "underscore";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  PanResponderInstance,
  PanResponderGestureState,
  NativeSyntheticEvent,
} from "react-native";
import { WIDTH } from "react-native-common-lib";
import { dummyData } from "./dummyData";
import { renderBodyItem } from "./renderBodyItem";
import { TabBodyScrollerHeader } from "./TabBodyScrollerHeader";
import { ITabBodyScrollerProps } from "./tabBodyScrollerInterfaces";
import { getTabStyle } from "./getTabStyle";

const X_SWIPE_THRESHOLD_COEFF: number = 0.5;
const SWIPE_THRESHOLD: number = WIDTH * X_SWIPE_THRESHOLD_COEFF;
// const SWIPE_DURATION: number = 250; // Animated.timing
const SWIPE_SPEED: number = 12; // Animated.spring
const VELOCITY_THRESHOLD: number = 0.55;
const COMMON_RANGE: number[] = [-WIDTH, 0, WIDTH];

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
  },
  commonCard: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
});

/*
  tslint:disable:interface-name
*/
interface TabBodyScroller<IContentItem> {
  _tabTextWidths: number[];
  _tabTextWidthAccSums: number[];
  _tabTextWidthAccSumsPos: number[];
  _tabTextWidthsInit: boolean;
  _tabTextWidthSumNeg: number;
  _globalTabX: number;
  _colorOutputRanges: string[][];
  _opacityOutputRanges: number[][];
  _animGlobalTabX: Animated.Value;
  _bodyPosition: Animated.Value;
  _tabPosition: Animated.Value;
  _bodyPanResponder: PanResponderInstance;
  _tabPanResponder: PanResponderInstance;
}

interface ITabBodyScrollerState {
  swipeEnabled: boolean;
  tabTextWidthsInit: boolean;
  tabTextWidths: number[];
  colorOutputRanges: string[][];
  opacityOutputRanges: number[][];
  tabTextWidthAccSumsPos: number[];
  tabTextWidthAccSums: number[];
  tabTextWidthsSumNeg: number;
  index: number;
}

class TabBodyScroller<IContentItem> extends React.PureComponent<
  ITabBodyScrollerProps<IContentItem>,
  ITabBodyScrollerState
> {
  public static defaultProps = {
    titles: dummyData.titles,
    content: dummyData.content,
    activeColors: dummyData.activeColors,
    inactiveColors: dummyData.inactiveColors,
    renderBodyItem,
    getTabStyle,
  };

  constructor(props: ITabBodyScrollerProps<IContentItem>) {
    super(props);

    this.state = {
      swipeEnabled: true,
      tabTextWidthsInit: false,
      tabTextWidths: [],
      colorOutputRanges: [[]],
      opacityOutputRanges: [[]],
      tabTextWidthAccSumsPos: [],
      tabTextWidthAccSums: [],
      tabTextWidthsSumNeg: 0,
      index: 0,
    };

    this._tabTextWidths = [];
    this._tabTextWidthAccSums = [0];
    this._tabTextWidthAccSumsPos = [0];
    this._tabTextWidthsInit = false;
    this._tabTextWidthSumNeg = 0;
    this._globalTabX = 0;
    this._colorOutputRanges = [];
    this._opacityOutputRanges = [];
    this._animGlobalTabX = new Animated.Value(0);
    this._bodyPosition = new Animated.Value(0);
    this._tabPosition = new Animated.Value(0);

    // this.buildColorAndOpacityArrs();

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
        const { tabTextWidthAccSumsPos } = this.state;
        const tabX = this.getXPreventOverflow(gesture.dx, 5000, true);

        // console.log(`tabX from TAB`, tabX);
        // console.log(`tabX from pan move:`, tabX);

        const bodyX = this.getBodyXFromTabPan(tabX);

        /*
        For if we want to enable tab flick-scrolling OR pan scrolling more than (this._index +- 1)

        const { x: bodyX, y: bodyY } = this.getBodyXFromTabPan({
          tabX: gesture.dx,
          tabY,
        });
      */

        const globalAnimX = tabX * -1 + this._globalTabX * -1;
        // console.log(`global anim X val is:`, globalAnimX);

        if (
          globalAnimX > 0 &&
          globalAnimX <
            tabTextWidthAccSumsPos[tabTextWidthAccSumsPos.length - 1]
        ) {
          this._animGlobalTabX.setValue(globalAnimX);
        }

        this._tabPosition.setValue(tabX + this._globalTabX);
        this._bodyPosition.setValue(bodyX);
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
        const { tabTextWidthAccSumsPos } = this.state;
        const bodyX = this.getXPreventOverflow(gesture.dx, 1500, false);

        const tabX = this.getTabXFromBodyPan(bodyX);

        // console.log(`tabX from BODY`, tabX);

        const globalAnimX = tabX * -1;
        // console.log(`global anim X val is:`, globalAnimX);

        if (
          globalAnimX > 0 &&
          globalAnimX <
            tabTextWidthAccSumsPos[tabTextWidthAccSumsPos.length - 1]
        ) {
          this._animGlobalTabX.setValue(globalAnimX);
        }

        this._tabPosition.setValue(tabX);
        this._bodyPosition.setValue(bodyX);
      },
      onPanResponderRelease: this.handleSettingPosition,
    });
  }

  //   componentDidUpdate(prevProps: ITabBodyScrollerProps) {
  //     const { categoriesData } = this.props;
  //     const { categoriesData: prevCategoriesData } = prevProps;

  //     if (
  //       this._tabTextWidthsInit &&
  //       !isEqual(prevCategoriesData, categoriesData)
  //     ) {
  //       this.buildColorAndOpacityArrs();
  //     }
  //   }

  private getXPreventOverflow = (
    x: number,
    divisor: number,
    fromTab: boolean,
  ): number => {
    // we're on the first tab
    const { index, tabTextWidthsInit, tabTextWidthAccSums } = this.state;

    const slowingConstant = x * (WIDTH / divisor);
    const edgeSlowConstant = x * (WIDTH / 25000);

    if (!this._globalTabX && x > 0) {
      return fromTab ? 0 : slowingConstant;
    }

    // we're on the last tab
    if (
      tabTextWidthsInit &&
      tabTextWidthAccSums[tabTextWidthAccSums.length - 1] >= this._globalTabX &&
      x < 0
    ) {
      return fromTab ? 0 : slowingConstant;
      // return 0
    }

    /*
      - Only allow one tab to be scrolled at a time
      - Logic could change (not too bad), in which case it would be like Hulu

    */

    if (fromTab) {
      const accWidthFrom = this._tabTextWidthAccSums[index];
      let accWidthTo;
      if (x < 0) {
        accWidthTo = this._tabTextWidthAccSums[index + 1];

        // prevents scroll LEFT from tab bar
        if (accWidthFrom + x < accWidthTo + edgeSlowConstant) {
          return accWidthTo - accWidthFrom + edgeSlowConstant;
        }
      } else {
        accWidthTo = this._tabTextWidthAccSums[index - 1];

        // console.log(`x`, x);
        // console.log(`accWidthFrom`, accWidthFrom);
        // console.log(`accWidthTo`, accWidthTo);
        // console.log(`accWidthFrom + x`, accWidthFrom + x);

        // prevents scroll RIGHT from tab bar
        if (accWidthFrom + x > accWidthTo + edgeSlowConstant) {
          return accWidthFrom * -1 + accWidthTo + edgeSlowConstant;
        }
      }
    }

    return x;
  };

  private getTabXFromBodyPan = (bodyX: number): number => {
    const { tabTextWidthsInit, tabTextWidths, index } = this.state;

    if (!tabTextWidthsInit) {
      return bodyX;
    }

    const relevantTabWidth =
      bodyX < 0
        ? tabTextWidths[index]
        : tabTextWidths[index - 1] || tabTextWidths[index];
    const widthToConsider = relevantTabWidth;

    const x = (widthToConsider / WIDTH) * bodyX + this._globalTabX;

    return x;
  };

  //   getDynamicTabWidth = (startIndex: number, dx: number) => {
  //     /*
  //       Experimental: for scrolling past more than 1 section on Tab Header

  //        For iPhoneX:

  //         *** this._tabTextWidths = [48, 78.66667175292969, 70, 164.66665649414062, 80.33331298828125, 76.33331298828125];
  //         *** this._tabTextWidthAccSums = [-64, -158.667, -244.667, -425.333, -521.667];

  //      */
  //     const { content } = this.props;

  //     const startingPoint = this._tabTextWidthAccSums[startIndex];
  //     const livePoint = startingPoint + dx;

  //     // console.log(`livePoint:`, livePoint);

  //     if (livePoint <= startingPoint) {
  //       // swiping left to GO right... bigger negative
  //       for (let i = startIndex; i < content.length; i += 1) {
  //         if (livePoint > this._tabTextWidthAccSums[i]) {
  //           console.log(`Going RIGHT, got index ${i}`);
  //           console.log(`returning relevantWidth: ${this._tabTextWidths[i]}`);
  //           console.log(
  //             `this._tabTextWidthAccSums[i]`,
  //             this._tabTextWidthAccSums[i],
  //           );

  //           // need to find a good way to forceUpdate the index

  //           return this._tabTextWidths[i];
  //         }
  //       }
  //     } else {
  //       // swiping right to GO left... smaller negative
  //       console.log(`going LEFT`);

  //       for (let i = startIndex; i >= 0; i -= 1) {
  //         console.log(`i: ${i}`);
  //         console.log(
  //           `this._tabTextWidthAccSums[i]`,
  //           this._tabTextWidthAccSums[i],
  //         );

  //         if (livePoint >= this._tabTextWidthAccSums[i]) {
  //           console.log(`Going LEFT, got index ${i}`);
  //           console.log(`returning relevantWidth: ${this._tabTextWidths[i]}`);

  //           return this._tabTextWidths[i];
  //         }
  //       }
  //     }
  //   };

  private getBodyXFromTabPan = (tabX: number): number => {
    // console.log(`dx from tab:`, dx);
    const { tabTextWidthsInit, tabTextWidths, index } = this.state;

    if (!tabTextWidthsInit) {
      return tabX;
    }

    const relevantTabWidth =
      tabX < 0
        ? tabTextWidths[index]
        : tabTextWidths[index - 1] || tabTextWidths[index];
    const widthToConsider = relevantTabWidth;

    console.log(`widthToConsider`, widthToConsider);
    // console.log(`dx is`, dx);

    const x = (WIDTH / widthToConsider) * tabX;

    console.log(`bodyX:`, x);

    return x;
  };

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
    const { content } = this.props;

    this._tabTextWidths[index] = width;

    if (
      this._tabTextWidths.filter((n) => n).length === content.length &&
      !this._tabTextWidthSumNeg
    ) {
      console.log(
        `handling tabLayout: this._tabTextWidths`,
        this._tabTextWidths,
      );
      const initialTabTextWidths = [...this._tabTextWidths];

      initialTabTextWidths.forEach((num, i) => {
        this._tabTextWidthSumNeg -= num;

        if (i < initialTabTextWidths.length - 1) {
          this._tabTextWidthAccSums.push(this._tabTextWidthSumNeg * (i + 1));

          this._tabTextWidthAccSumsPos.push(
            -this._tabTextWidthSumNeg * (i + 1),
          );
        }
      });

      console.log(`this._tabTextWidthAccSumsPos`, this._tabTextWidthAccSumsPos);
      console.log(`this._tabTextWidthSumNeg`, this._tabTextWidthSumNeg);
      console.log(`this._tabTextWidthAccSums`, this._tabTextWidthAccSums);

      this.setState(
        {
          tabTextWidths: initialTabTextWidths,
          tabTextWidthAccSums: this._tabTextWidthAccSums,
          tabTextWidthAccSumsPos: this._tabTextWidthAccSumsPos,
          tabTextWidthsSumNeg: this._tabTextWidthSumNeg,
        },
        this.buildColorAndOpacityArrs,
      );
    }
  };

  private resetStateInitializers = () => {
    this._colorOutputRanges = [];
    this._opacityOutputRanges = [];
  };

  private buildColorAndOpacityArrs = (): void => {
    // these 3 all rely on this.props.categoriesData
    const { content, inactiveColors, activeColors } = this.props;

    if (this.state.tabTextWidthsInit) {
      this.setState({ tabTextWidthsInit: false });
    }

    console.log(`building with:`, content);

    content.forEach((_, index: number) => {
      activeColors.forEach((color: string, colorIndex: number) => {
        const colorToPush =
          colorIndex === index ? color : inactiveColors[index];

        if (!this._colorOutputRanges[index]) {
          this._colorOutputRanges[index] = [];
        }

        if (!this._opacityOutputRanges[index]) {
          this._opacityOutputRanges[index] = [];
        }

        this._colorOutputRanges[index].push(colorToPush);
        if (index >= colorIndex) {
          this._opacityOutputRanges[index].push(1);
        } else {
          this._opacityOutputRanges[index].push(0.5);
        }
      });
    });

    console.log(`this._opacityOutputRanges:`, this._opacityOutputRanges);
    console.log("this.props.activeColors:", this.props.activeColors);
    console.log(`this._colorOutputRanges`, this._colorOutputRanges);

    this.setState(
      {
        tabTextWidthsInit: true,
        colorOutputRanges: this._colorOutputRanges,
        opacityOutputRanges: this._opacityOutputRanges,
      },
      this.resetStateInitializers,
    );
  };

  private onSwipeComplete = (
    direction: string,
    reset: boolean = false,
    xMultipler: number = 1,
  ): void => {
    const { index } = this.state;
    const tabX = reset
      ? 0
      : this.getTabXFromIndex(index, direction, xMultipler);
    let newIndex = index;

    console.log(`Completing swipe. Setting tab container to x: ${tabX}`);
    this._bodyPosition.setValue(0);
    this._tabPosition.setValue(tabX);

    if (reset) {
      newIndex = 0;
    } else {
      if (direction === "left") {
        newIndex += 1 * xMultipler;
      } else {
        if (newIndex > 0) {
          newIndex -= 1 * xMultipler;
        }
      }
    }

    this.setState({ swipeEnabled: true, index: newIndex });
  };

  private getBorderProps = () => {
    const {
      tabTextWidthsInit,
      tabTextWidthAccSumsPos,
      tabTextWidths,
    } = this.state;
    const { activeColors } = this.props;

    if (!tabTextWidthsInit) {
      return {};
    }

    // if (console.groupCollapsed) {
    //   console.groupCollapsed("getBorderProps");
    //   console.log(`width:`, {
    //     inputRange: this._tabTextWidthAccSumsPos,
    //     outputRange: this._tabTextWidths,
    //   });
    //   console.log(`bgColor:`, {
    //     inputRange: this._tabTextWidthAccSumsPos,
    //     outputRange: this.props.activeColors,
    //   });
    //   console.groupEnd();
    // }

    const width = this._animGlobalTabX.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: tabTextWidths,
    });

    const backgroundColor = this._animGlobalTabX.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: activeColors,
    });

    return { width, backgroundColor };
  };

  private getBodyStyle = (i: number) => {
    const { index } = this.state;

    const isActive = i === index;
    const offsetMult = isActive ? 1 : i - index;
    const offset = WIDTH * offsetMult;
    const negOffset = offset > 0 ? offset * -1 : offset;

    const outputRange =
      offset > 0 ? [-offset, 0, offset] : [offset, 0, -offset];

    const translateX = this._bodyPosition.interpolate({
      inputRange: [negOffset, 0, negOffset * -1], // [-WIDTH, 0, WIDTH]
      outputRange,
    });

    const opacity = this._bodyPosition.interpolate({
      inputRange: COMMON_RANGE,
      outputRange: isActive ? [0, 1, 0] : [1, 0, 1],
    });
    return {
      opacity,
      transform: [{ translateX }],
    };
  };

  private getTabContainerStyle = (): {
    transform: Array<{
      translateX: Animated.AnimatedInterpolation;
    }>;
  } => {
    const { index, tabTextWidths } = this.state;

    const activeWidth = tabTextWidths[index] || 0;
    const nextWidth = tabTextWidths[index + 1] || 0;

    const translateX = this._tabPosition.interpolate({
      inputRange: [-activeWidth, 0, activeWidth],
      outputRange: [-activeWidth, 0, nextWidth],
    });

    return {
      transform: [{ translateX }],
    };
  };

  private handleSettingTabPosition = (
    _: NativeSyntheticEvent<any>,
    gesture: PanResponderGestureState,
  ): void => {
    const { dx, vx } = gesture;

    if (!dx) {
      return;
    }

    console.log(`handling setting tab position on release`);

    const TAB_SWIPE_THRESHOLD = WIDTH * 0.2 * X_SWIPE_THRESHOLD_COEFF;

    if (dx < -TAB_SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
      this.forceSwipe("left");
    } else if (dx > TAB_SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
      this.forceSwipe("right");
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

  private forceSwipe = (direction: string, xMultiplier: number = 1): void => {
    const { index, tabTextWidthAccSumsPos } = this.state;
    const { content } = this.props;

    const isRight = direction === "right";

    console.log(`forceSwiping to the ${direction}`);

    if (
      (index === content.length - 1 && !isRight) ||
      (index === 0 && isRight)
    ) {
      console.log(`force swiping -> resetting position`);
      return this.resetPosition();
    }

    this.setState({ swipeEnabled: false });

    const bodyX = isRight ? WIDTH * xMultiplier : -WIDTH * xMultiplier;
    const tabX = this.getTabXFromIndex(index, direction, xMultiplier);
    const newGlobalTabX = isRight
      ? tabTextWidthAccSumsPos[index - 1 * xMultiplier]
      : tabTextWidthAccSumsPos[index + 1 * xMultiplier];

    console.log(`force swiping to bodyX`, bodyX);
    console.log(`force swiping to tabX:`, tabX);
    console.log(`newGlobalTabX:`, newGlobalTabX);

    const bodyAnimation = Animated.spring(this._bodyPosition, {
      toValue: bodyX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true,
    });

    const tabAnimation = Animated.spring(this._tabPosition, {
      toValue: tabX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true,
    });

    const borderAnimation = Animated.spring(this._animGlobalTabX, {
      toValue: newGlobalTabX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
    });

    console.log(`About to do the animation`);
    Animated.parallel([bodyAnimation, tabAnimation, borderAnimation]).start(
      () => {
        console.log(`calling onSwipeComplete`);
        this.onSwipeComplete(direction, false, xMultiplier);
      },
    );
    // bodyAnimation.start(() => {
    //   console.log(`calling onSwipeComplete`);
    //   this.onSwipeComplete(direction);
    // });
  };

  private getTabXFromIndex = (
    indexArg: number,
    direction: string,
    xMultipler: number = 1,
  ): number => {
    const { tabTextWidths, tabTextWidthsInit } = this.state;

    const isRight = direction === "right";
    const index =
      indexArg > 0 && isRight
        ? indexArg - 1 * xMultipler
        : indexArg + 1 * xMultipler;

    if (!tabTextWidthsInit) {
      return 0;
    }

    let tabX = 0;

    for (let i = 0; i < index; i += 1) {
      tabX -= tabTextWidths[i];
    }

    console.log(`tabX return val:`, tabX);
    console.log(`this._globalTabX before it is ${tabX}: ${this._globalTabX}`);

    this._globalTabX = tabX;

    return tabX;
  };

  private resetPosition = (): void => {
    console.log(`Resetting position.`);
    const { index } = this.state;

    const bodyReset = Animated.spring(this._bodyPosition, {
      toValue: 0,
      useNativeDriver: true,
    });

    const tabReset = Animated.spring(this._tabPosition, {
      toValue: this._globalTabX,
      useNativeDriver: true,
    });

    const globalTabXReset = Animated.spring(this._animGlobalTabX, {
      toValue: this._tabTextWidthAccSumsPos[index],
    });

    Animated.parallel([bodyReset, tabReset, globalTabXReset]).start();
  };

  private renderBodys = (): React.ReactNodeArray => {
    const { index } = this.state;
    const { content } = this.props;

    return content
      .map((contentItem, i: number) => {
        const offset = WIDTH * (i - index);

        const activeProps =
          i === index ? this._bodyPanResponder.panHandlers : {};

        return (
          <Animated.View
            key={i}
            {...activeProps}
            style={[
              this.getBodyStyle(i),
              localStyles.commonCard,
              {
                left: offset,
              },
            ]}
          >
            {this.props.renderBodyItem(contentItem, i)}
          </Animated.View>
        );
      })
      .reverse();
  };

  private handleSwipeToStart = (): void => {
    const { index } = this.state;

    const x = WIDTH * index;
    const tabX = this.getTabXFromIndex(1, "right");

    const bodyAnimation = Animated.spring(this._bodyPosition, {
      toValue: x,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true,
    });

    const tabAnimation = Animated.spring(this._tabPosition, {
      toValue: tabX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true,
    });

    const borderAnimation = Animated.spring(this._animGlobalTabX, {
      toValue: this._tabTextWidthAccSumsPos[0],
      speed: SWIPE_SPEED,
      overshootClamping: true,
    });

    Animated.parallel([bodyAnimation, tabAnimation, borderAnimation]).start(
      () => {
        this.onSwipeComplete("right", true);
      },
    );
  };

  private handleTabPress = (index: number): void => {
    console.log(
      `handling tab press for index ${index}. Might need to fix this for delta > 1`,
    );
    const { swipeEnabled, index: stateIndex } = this.state;

    if (!swipeEnabled) {
      return;
    }

    const direction = index > stateIndex ? "left" : "right";

    // let xMultiplier = 1;
    const diff = Math.abs(index - stateIndex);

    // if (index - this._index === 2) {
    //   this._index += 1;
    //   xMultiplier = 2;
    // }

    this.forceSwipe(direction, diff);
  };

  private getTextStyle = (i: number) => {
    const {
      tabTextWidthsInit,
      tabTextWidthAccSumsPos,
      tabTextWidths,
      colorOutputRanges,
      opacityOutputRanges,
    } = this.state;

    if (!tabTextWidthsInit) {
      return {
        opacity: 0,
      };
    }

    // if (console.groupCollapsed) {
    //   console.groupCollapsed("getTextStyle:");
    //   console.log(`color:`, {
    //     inputRange: this._tabTextWidthAccSumsPos,
    //     outputRange: this._colorOutputRanges[i],
    //   });

    //   console.log(`opacity:`, {
    //     inputRange: this._tabTextWidthAccSumsPos,
    //     outputRange: this._opacityOutputRanges[i],
    //   });

    //   console.groupEnd();
    // }

    const color = this._animGlobalTabX.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: colorOutputRanges[i],
    });

    const opacity = this._animGlobalTabX.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: opacityOutputRanges[i],
    });

    return [
      this.props.getTabStyle(i, tabTextWidths[i], tabTextWidths),
      { color, opacity },
    ];
  };

  render(): React.ReactNode {
    const { index } = this.state;
    const { titles } = this.props;

    return (
      <View style={localStyles.container}>
        <TabBodyScrollerHeader
          titles={titles}
          handleTabLayout={this.handleTabLayout}
          handleTabPress={this.handleTabPress}
          getTextStyle={this.getTextStyle}
          getTabContainerStyle={this.getTabContainerStyle}
          getBorderProps={this.getBorderProps}
          handleSwipeToStart={this.handleSwipeToStart}
          panResponder={this._tabPanResponder}
          index={index}
        />
        <View style={localStyles.bodyContainer}>{this.renderBodys()}</View>
      </View>
    );
  }
}

export { TabBodyScroller };
