import * as React from "react";
import {
  NativeSyntheticEvent,
  PanResponderInstance,
  StyleSheet,
  View,
  Animated,
} from "react-native";
import { ScrollerTabItem } from "./ScrollerTabItem";

const localStyles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    zIndex: 1,
    backgroundColor: "brown",
    // if we want to blur/have opacity, need to adjust layout such that it's absolutely positioned at the top, giving the featured image a marginTop
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "yellow",
  },
  tabBorder: {
    position: "absolute",
    bottom: -4,
    zIndex: 2,
  },
});

interface ITabBodyScrollerHeaderProps {
  handleTabLayout: (event: NativeSyntheticEvent<any>, index: number) => void;
  handleTabPress: (index: number) => void;
  getTextStyle: (i: number) => any;
  getTabContainerStyle: () => {
    transform: Array<{
      translateX: Animated.AnimatedInterpolation;
    }>;
  };
  getBorderProps: () => any;
  handleSwipeToStart: () => void;
  titles: string[];
  panResponder: PanResponderInstance;
  index: number;
}

class TabBodyScrollerHeader extends React.Component<
  ITabBodyScrollerHeaderProps
> {
  public static defaultProps = {
    index: 0,
  };

  private renderTabs = (): React.ReactNode => {
    const {
      handleTabLayout,
      handleTabPress,
      getTextStyle,
      getTabContainerStyle,
      panResponder,
      titles,
    } = this.props;

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[localStyles.tabContainer, getTabContainerStyle()]}
      >
        {titles.map((title, i: number) => (
          <ScrollerTabItem
            key={`tab-title-${i}`}
            title={title}
            handleTabLayout={handleTabLayout}
            handleTabPress={handleTabPress}
            getTextStyle={getTextStyle}
            i={i}
          />
        ))}
      </Animated.View>
    );
  };

  render(): React.ReactNode {
    const { getBorderProps } = this.props;

    return (
      <View style={localStyles.container}>
        {this.renderTabs()}
        <Animated.View style={[localStyles.tabBorder, getBorderProps()]} />
      </View>
    );
  }
}

export { TabBodyScrollerHeader };
