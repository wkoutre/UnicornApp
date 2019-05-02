import * as React from "react";
import { StyleSheet, View, Animated } from "react-native";
import { ScrollerTabItem } from "./ScrollerTabItem";
import { ITabBodyScrollerHeaderProps } from "./tabBodyScrollerInterfaces";

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tabBorder: {
    position: "absolute",
    bottom: -4,
    zIndex: 2,
  },
});

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
      getAnimTabTextStyle,
      getHeaderContainerStyle,
      panResponder,
      titles,
      tabMarginHorizontal,
      getTabTextContainerStyle,
      getTabItemBorderStyle,
    } = this.props;

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[localStyles.tabContainer, getHeaderContainerStyle()]}
      >
        {titles.map((title, i: number) => (
          <ScrollerTabItem
            getTabTextContainerStyle={getTabTextContainerStyle}
            tabMarginHorizontal={tabMarginHorizontal}
            key={`tab-title-${i}`}
            title={title}
            handleTabLayout={handleTabLayout}
            handleTabPress={handleTabPress}
            getAnimTabTextStyle={getAnimTabTextStyle}
            getTabItemBorderStyle={getTabItemBorderStyle}
            i={i}
          />
        ))}
      </Animated.View>
    );
  };

  render(): React.ReactNode {
    return (
      <View style={localStyles.container}>
        {this.renderTabs()}
        {/* <Animated.View
          style={[localStyles.tabBorder, getTabItemBorderStyle()]}
        /> */}
      </View>
    );
  }
}

export { TabBodyScrollerHeader };
