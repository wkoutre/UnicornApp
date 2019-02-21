import * as React from "react";
import { NativeSyntheticEvent, Animated, TouchableOpacity } from "react-native";

interface IScrollerTabItemProps {
  getTextStyle: (i: number) => any;
  handleTabPress: (i: number) => void;
  handleTabLayout: (event: NativeSyntheticEvent<any>, i: number) => void;
  i: number;
  title: string;
}

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
    const { title, i, getTextStyle } = this.props;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this.handleTabPress}>
        <Animated.Text
          onLayout={this.handleTabLayout}
          style={[getTextStyle(i), { backgroundColor: "violet" }]}
        >
          {title}
        </Animated.Text>
      </TouchableOpacity>
    );
  }
}

export { ScrollerTabItem };
