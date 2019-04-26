import * as React from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  PanResponderInstance,
  PanResponderGestureState,
  NativeSyntheticEvent,
  TextStyle,
} from "react-native";
import { WIDTH } from "react-native-common-lib";
import { dummyData } from "./dummyData";
import { renderBodyItem } from "./renderBodyItem";
import { TabBodyScrollerHeader } from "./TabBodyScrollerHeader";
import { getTabStyle } from "./getTabStyle";

const X_SWIPE_THRESHOLD_COEFF: number = 0.5;
const SWIPE_THRESHOLD: number = WIDTH * X_SWIPE_THRESHOLD_COEFF;
const SWIPE_SPEED: number = 12; // Animated.spring
const VELOCITY_THRESHOLD: number = 0.55;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
});

interface ITabBodyScrollerProps<IContentItem> {
  titles: string[];
  content: IContentItem[];
  activeColors: string[];
  inactiveColors: string[];
  tabMarginHorizontal: number;
  renderBodyItem: (contentItem: IContentItem, index: number) => React.ReactNode;
  getTabStyle: (index: number, tabWidth: number, titles: string[]) => TextStyle;
}

interface ITabBodyScrollerState {
  swipeEnabled: boolean;
  tabTextWidthsInit: boolean;
  bodyIsScrolling: boolean;
  tabTextWidths: number[];
  colorOutputRanges: string[][];
  opacityOutputRanges: number[][];
  tabTextWidthAccSumsPos: number[];
  tabTextWidthAccSums: number[];
  tabTextWidthsSumNeg: number;
  index: number;
}

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
  _globalBodyX: number;
  _colorOutputRanges: string[][];
  _opacityOutputRanges: number[][];
  _animGlobalTabX: Animated.Value;
  _animGlobalTabXCol: Animated.Value;
  _animGlobalBodyX: Animated.Value;
  _bodyPanResponder: PanResponderInstance;
  _tabPanResponder: PanResponderInstance;
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
    tabMarginHorizontal: 30,
    renderBodyItem,
    getTabStyle,
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
    this._globalBodyX = 0;
    this._colorOutputRanges = [];
    this._opacityOutputRanges = [];
    this._animGlobalTabX = new Animated.Value(0);
    this._animGlobalTabXCol = new Animated.Value(0);
    this._animGlobalBodyX = new Animated.Value(0);

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
        const { tabTextWidthAccSumsPos, bodyIsScrolling } = this.state;
        const { dx: tabX } = gesture;
        // const tabX = this.getXPreventOverflow(gesture.dx, 5000, true);

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
        // console.log(`global anim X val is:`, globalAnimX);

        if (
          globalAnimX > 0 &&
          globalAnimX <
            tabTextWidthAccSumsPos[tabTextWidthAccSumsPos.length - 1]
        ) {
          console.log(`Setting tab Animated.Values to ${globalAnimX}`);
          this._animGlobalTabX.setValue(globalAnimX);
          this._animGlobalTabXCol.setValue(globalAnimX);
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
        const { tabTextWidthsInit, tabTextWidthAccSumsPos } = this.state;
        const { dx: bodyX } = gesture;
        const globalAnimBodyX = bodyX * -1 + this._globalBodyX * -1;

        const totalWidth = WIDTH * content.length - 1 - WIDTH / 2;
        const upperLimit = tabTextWidthsInit
          ? totalWidth -
            tabTextWidthAccSumsPos[tabTextWidthAccSumsPos.length - 1] / 2
          : totalWidth;

        if (globalAnimBodyX > 0 && globalAnimBodyX < upperLimit) {
          console.log(`setting this._animGlobalBodyX to:`, globalAnimBodyX);

          this._animGlobalBodyX.setValue(globalAnimBodyX);
        }
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
    const { content, tabMarginHorizontal } = this.props;

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
        console.log(`this._tabTextWidthSumNeg:`, this._tabTextWidthSumNeg);
        const nextWidth =
          i === initialTabTextWidths.length - 1
            ? 0
            : initialTabTextWidths[i + 1] / 2;

        this._tabTextWidthSumNeg -=
          num / 2 + tabMarginHorizontal * 2 + nextWidth;

        if (i < initialTabTextWidths.length - 1) {
          this._tabTextWidthAccSums.push(this._tabTextWidthSumNeg);

          this._tabTextWidthAccSumsPos.push(-this._tabTextWidthSumNeg);
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
    xMultiplier: number = 1,
  ): void => {
    const { index } = this.state;
    let newIndex = index;
    console.log(`onSwipeComplete...`);

    if (reset) {
      newIndex = 0;
    } else {
      if (direction === "left") {
        newIndex += 1 * xMultiplier;
      } else {
        if (newIndex > 0) {
          newIndex -= 1 * xMultiplier;
        }
      }
    }

    this.setState({
      swipeEnabled: true,
      index: newIndex,
      bodyIsScrolling: true,
    });
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

    const width = this._animGlobalTabXCol.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: tabTextWidths,
    });

    const backgroundColor = this._animGlobalTabXCol.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: activeColors,
    });

    return { width, backgroundColor };
  };

  private getBodyStyle = (i: number) => {
    const {
      bodyIsScrolling,
      tabTextWidthAccSumsPos,
      tabTextWidthsInit,
    } = this.state;
    // const { content } = this.props;

    if (!tabTextWidthsInit) {
      return {};
    }

    const inputRange = bodyIsScrolling
      ? tabTextWidthAccSumsPos.map((_, ind) => ind * WIDTH)
      : tabTextWidthAccSumsPos;
    const outputRange = tabTextWidthAccSumsPos.map((_, ind) => {
      const wOffset = i - ind;

      return WIDTH * wOffset;
    });

    const opacityOutputRange = inputRange.map((_, ind) => (ind === i ? 1 : 0));
    const animValToUse = bodyIsScrolling
      ? this._animGlobalBodyX
      : this._animGlobalTabX;

    // console.log(`body i is ${i}`);
    // console.log(`inputRange is:`, inputRange);
    // console.log(`outputRange is:`, outputRange);
    // console.log(`opacityOutputRange:`, opacityOutputRange);

    const translateX = animValToUse.interpolate({
      inputRange, // [-WIDTH, 0, WIDTH]
      outputRange,
      extrapolate: "clamp",
    });

    const opacity = animValToUse.interpolate({
      inputRange,
      outputRange: opacityOutputRange,
      extrapolate: "clamp",
    });
    return {
      opacity,
      transform: [{ translateX }],
    };
  };

  private getTabContainerStyle = () => {
    const {
      tabTextWidthsInit,
      tabTextWidthAccSums,
      tabTextWidthAccSumsPos,
      bodyIsScrolling,
    } = this.state;

    if (!tabTextWidthsInit) {
      return {};
    }

    const animValToUse = bodyIsScrolling
      ? this._animGlobalBodyX
      : this._animGlobalTabX;
    const inputRange = bodyIsScrolling
      ? tabTextWidthAccSums.map((_, i) => WIDTH * i)
      : tabTextWidthAccSumsPos;

    const translateX = animValToUse.interpolate({
      inputRange,
      outputRange: tabTextWidthAccSums,
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
    const newGlobalBodyX = isRight
      ? WIDTH * (index - 1 * xMultiplier)
      : WIDTH * (index + 1 * xMultiplier);

    console.log(`force swiping to bodyX`, bodyX);
    console.log(`force swiping to tabX:`, tabX);
    console.log(`newGlobalTabX:`, newGlobalTabX);
    console.log(`newGlobalBodyX:`, newGlobalBodyX);

    this._globalBodyX = -newGlobalBodyX;

    const colorAnimation = Animated.spring(this._animGlobalTabXCol, {
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

    const bodyAnimation = Animated.spring(this._animGlobalBodyX, {
      toValue: newGlobalBodyX,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true,
    });

    console.log(`About to do the animation`);
    Animated.parallel([tabAnimation, colorAnimation, bodyAnimation]).start(
      () => {
        console.log(`calling onSwipeComplete`);
        this.onSwipeComplete(direction, false, xMultiplier);
      },
    );
  };

  private getTabXFromIndex = (
    indexArg: number,
    direction: string,
    xMultiplier: number = 1,
  ): number => {
    const {
      tabTextWidths,
      tabTextWidthsInit,
      tabTextWidthAccSums,
    } = this.state;

    if (console.groupCollapsed) {
      console.groupCollapsed("getTabXFromIndex");
      console.log("indexArg:", indexArg);
      console.log(`direction:`, direction);
      console.log("xMultiplier:", xMultiplier);
      console.groupEnd();
    }

    const isRight = direction === "right";
    const index =
      indexArg > 0 && isRight
        ? (indexArg - 1) * xMultiplier
        : (indexArg + 1) * xMultiplier;

    if (!tabTextWidthsInit) {
      return 0;
    }

    const tabX = tabTextWidthAccSums[index];
    // let tabX = 0;

    // for (let i = 0; i < index; i += 1) {
    //   tabX -= tabTextWidths[i];
    // }

    // console.log(`tabX return val:`, tabX);
    // console.log(`this._globalTabX before it is ${tabX}: ${this._globalTabX}`);

    this._globalTabX = tabX;

    return tabX;
  };

  private resetPosition = (): void => {
    console.log(`Resetting position.`);
    const { index, bodyIsScrolling } = this.state;

    const globalBodyReset = Animated.spring(this._animGlobalBodyX, {
      toValue: WIDTH * index,
      useNativeDriver: true,
    });

    const tabColorReset = Animated.spring(this._animGlobalTabXCol, {
      toValue: this._globalTabX,
    });

    const globalTabXReset = Animated.spring(this._animGlobalTabX, {
      toValue: this._tabTextWidthAccSumsPos[index],
      useNativeDriver: true,
    });

    Animated.parallel([globalTabXReset, globalBodyReset]).start(() => {
      if (!bodyIsScrolling) {
        this.setState({ bodyIsScrolling: true });
      }
    });
  };

  private renderBodys = (): React.ReactNodeArray => {
    const { index, bodyIsScrolling } = this.state;
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

  private handleSwipeToStart = (): void => {};

  private handleTabPress = (index: number): void => {
    console.log(`handling tab press for index ${index}.`);

    const { swipeEnabled, index: stateIndex } = this.state;

    if (!swipeEnabled) {
      return;
    }

    const direction = index > stateIndex ? "left" : "right";
    const diff = Math.abs(index - stateIndex);

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
    const { titles, tabMarginHorizontal } = this.props;

    if (!tabTextWidthsInit) {
      return {
        opacity: 0,
      };
    }

    const color = this._animGlobalTabXCol.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: colorOutputRanges[i],
      extrapolate: "clamp",
    });

    const opacity = this._animGlobalTabXCol.interpolate({
      inputRange: tabTextWidthAccSumsPos,
      outputRange: opacityOutputRanges[i],
      extrapolate: "clamp",
    });

    return [
      this.props.getTabStyle(i, tabTextWidths[i], titles),
      { color, opacity, marginHorizontal: tabMarginHorizontal },
      //   { opacity, marginHorizontal: tabMarginHorizontal },
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
