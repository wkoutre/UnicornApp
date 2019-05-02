import * as React from "react";
import { NativeSyntheticEvent, Animated, View } from "react-native";
import { IScrollerTabItemProps } from "./tabBodyScrollerInterfaces";

class ScrollerTabItem extends React.Component<IScrollerTabItemProps, {}> {
  private handleTabLayout = (e: NativeSyntheticEvent<any>) => {
    const { handleTabLayout, i } = this.props;

    handleTabLayout(e, i);
  };

  private handleTabPress = (): void => {
    const { handleTabPress, i } = this.props;

    handleTabPress(i);
  };

  render(): React.ReactNode {
    const {
      title,
      i,
      getAnimTabTextStyle,
      getTabTextContainerStyle,
      getTabItemBorderStyle,
    } = this.props;

    return (
      <View style={getTabTextContainerStyle(i)}>
        <Animated.Text
          onPress={this.handleTabPress}
          onLayout={this.handleTabLayout}
          style={getAnimTabTextStyle(i)}
        >
          {title}
        </Animated.Text>
        <Animated.View style={getTabItemBorderStyle(i)} />
      </View>
    );
  }
}

export { ScrollerTabItem };
