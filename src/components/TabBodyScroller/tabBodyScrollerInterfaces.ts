import {
  TextStyle,
  ViewStyle,
  PanResponderInstance,
  NativeSyntheticEvent,
  Animated,
} from "react-native";

export interface ITabBodyScrollerProps<IContentItem> {
  titles: string[];
  content: IContentItem[];
  activeColors: string[];
  inactiveColors: string[];
  tabMarginHorizontal: number;
  animTabTextStyle: TextStyle;
  tabItemBorderStyle: ViewStyle;
  bodyContainerStyle: ViewStyle;
  tabTextContainerStyle: ViewStyle;
  renderBodyItem: (contentItem: IContentItem, index: number) => React.ReactNode;
  getTabTextContainerStyle: (
    index: number,
    tabWidth: number,
    titles: string[],
  ) => TextStyle;
}

export interface ITabBodyScrollerState {
  swipeEnabled: boolean;
  tabTextWidthsInit: boolean;
  bodyIsScrolling: boolean;
  tabTextWidths: number[];
  bodyContainerInputRange: number[];
  colorOutputRanges: string[][];
  opacityOutputRanges: number[][];
  tabTextContWidthAccSumsPos: number[];
  tabTextContWidthAccSums: number[];
  index: number;
}

export interface IScrollerTabItemProps {
  getTabTextContainerStyle: (i: number) => ViewStyle;
  getAnimTabTextStyle: (i: number) => TextStyle;
  handleTabPress: (i: number) => void;
  getTabItemBorderStyle: (i: number) => void;
  handleTabLayout: (event: NativeSyntheticEvent<any>, i: number) => void;
  tabMarginHorizontal: number;
  i: number;
  title: string;
}

export interface ITabBodyScrollerHeaderProps {
  handleTabLayout: (event: NativeSyntheticEvent<any>, index: number) => void;
  handleTabPress: (index: number) => void;
  getAnimTabTextStyle: (i: number) => any;
  getHeaderContainerStyle: () => any;
  getTabTextContainerStyle: (index: number) => ViewStyle;
  getTabItemBorderStyle: (index: number) => any;
  handleSwipeToStart: () => void;
  tabMarginHorizontal: number;
  titles: string[];
  panResponder: PanResponderInstance;
  index: number;
}

export interface ITabBodyScroller {
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
