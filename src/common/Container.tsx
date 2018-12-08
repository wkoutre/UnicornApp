import * as React from "react";
import * as Animatable from "react-native-animatable";
import { View, ViewProperties, StyleSheet } from "react-native";
import { Colors } from "@assets";

interface IContainerProps extends ViewProperties {
  fade?: boolean;
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: "5%"
  }
});

class Container extends React.PureComponent<IContainerProps> {
  render(): React.ReactNode {
    const { style, fade, children, ...otherProps } = this.props;

    if (fade) {
      return (
        <Animatable.View
          animation={"fadeIn"}
          useNativeDriver={true}
          {...otherProps}
          style={[localStyles.container, style]}
        >
          {children}
        </Animatable.View>
      );
    }
    return (
      <View {...otherProps} style={[localStyles.container, style]}>
        {children}
      </View>
    );
  }
}

export { Container };
