import * as React from "react";
import { ImageSourcePropType, StyleSheet, Image, View } from "react-native";
import { IOS, Touchable, PText } from "react-native-common-lib";
import { INavLeftElementProps } from "@interfaces";
import { Icons, Colors } from "@assets";
import { IconStyles, LARGE_HIT_SLOP } from "@styles";
import { defaultRefs } from "@config";

const localStyles = StyleSheet.create({
  container: {
    marginLeft: 20
  },
  arrowTextContainer: { flexDirection: "row", alignItems: "center" },
  redArrow: {
    tintColor: Colors.red
  }
});

const NavLeftElement: React.SFC<INavLeftElementProps> = ({
  navigation,
  style,
  onPress,
  disabled,
  commonTextProps,
  arrowStyle,
  renderArrowWithText
}) => {
  const handleOnPress = (): void => {
    if (onPress) {
      onPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const handleImageSource = (): ImageSourcePropType => {
    return IOS ? Icons.blackBackArrow : Icons.androidBackArrow;
  };

  const renderBody = (): React.ReactNode => {
    if (commonTextProps) {
      if (renderArrowWithText) {
        return (
          <View style={localStyles.arrowTextContainer}>
            <Image
              source={handleImageSource()}
              style={[
                IconStyles.navBackArrow,
                localStyles.redArrow,
                arrowStyle
              ]}
              resizeMode={"contain"}
            />
            <PText {...commonTextProps} />
          </View>
        );
      }

      return <PText {...commonTextProps} />;
    }

    return (
      <Image
        source={handleImageSource()}
        style={[IconStyles.navBackArrow, arrowStyle]}
        resizeMode={"contain"}
      />
    );
  };

  return (
    <Touchable
      disabled={disabled}
      onPress={handleOnPress}
      hitSlop={LARGE_HIT_SLOP}
      style={[localStyles.container, style]}
    >
      {renderBody()}
    </Touchable>
  );
};

NavLeftElement.defaultProps = {
  style: defaultRefs.emptyObj,
  arrowStyle: defaultRefs.emptyObj
};

export { NavLeftElement };
