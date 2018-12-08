import * as React from "react";
import {
  TextInputFocusEventData,
  NativeSyntheticEvent,
  TextInputProps,
  TextStyle,
  StyleProp,
  ViewStyle,
  TextInput,
  StyleSheet
} from "react-native";
import validator from "validator";
import { Touchable, PText, Input, IOS } from "react-native-common-lib";
import { Colors } from "@assets";
import { DEFAULT_FONT_FAMILY, DEFAULT_PARAGRAPH_SIZES } from "@styles";

interface ICommonInputProps extends TextInputProps {
  onChangeText: (text: string, stateKey?: string) => void;
  getRef?: (r: TextInput, stateKey: string) => void;
  assignValidity: (
    stateKeyAndValidation: { stateKey: string; isValid: boolean }
  ) => void;
  stateKey: string;
  errorText: string;
  accentColor: string;
  errorAccentColor: string;
  textColor: string;
  placeholderTextColor: string;
  selectionColor: string;
  containerStyle: StyleProp<ViewStyle>;
  inputStyle: StyleProp<ViewStyle | TextStyle>;
  commonTextPlaceholderProps: object;
  value: string;
}

const localStyles = StyleSheet.create({
  focusedOrFilledPlaceholder: {
    transform: [{ translateY: IOS ? -15 : -22.5 }]
  },
  unfocusedPlaceholder: {
    transform: [{ translateY: 0 }]
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: IOS ? 5 : 2,
    marginTop: 10
  },
  inputContainer: {
    justifyContent: "center",
    borderRadius: 4
  },
  label: { flex: 1.15 },
  input: {
    color: Colors.black19s,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_PARAGRAPH_SIZES.p1,
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  placeholder: {
    position: "absolute",
    bottom: 10
  }
});

interface ICommonInputState {
  labelStyle: StyleProp<ViewStyle>;
  isFocused: boolean;
  isRequired: boolean;
  isName: boolean;
  isEmail: boolean;
  isAddress: boolean;
  isCity: boolean;
  isZip: boolean;
  isState: boolean;
  isRegion: boolean;
  isPhone: boolean;
  isPassword: boolean;
  hasFocused: boolean;
  hasUnfocused: boolean;
  keyboardType: TextInputProps["keyboardType"];
  autoCapitalize: TextInputProps["autoCapitalize"];
}

class CommonInput extends React.Component<
  ICommonInputProps,
  ICommonInputState
> {
  _input: null | TextInput = null;

  public static defaultProps: Partial<ICommonInputProps> = {
    stateKey: "",
    value: "",
    placeholder: "",
    selectionColor: "blueGray50",
    inputStyle: {},
    containerStyle: {
      flex: 2,
      borderWidth: 1,
      borderColor: Colors.gray204s,
      borderRadius: 4
    },
    commonTextPlaceholderProps: {
      size: 3,
      color: "steel"
    },
    accentColor: "gray204s",
    errorAccentColor: "red",
    textColor: "gray204s",
    placeholderTextColor: "gray204s"
  };

  constructor(props: ICommonInputProps) {
    super(props);

    const { stateKey, placeholder } = props;

    this.state = {
      hasFocused: false,
      hasUnfocused: false,
      labelStyle: {},
      isFocused: false,
      isRequired: placeholder ? placeholder.includes("*") : false,
      isName: stateKey.toLowerCase().includes("name"),
      isEmail: stateKey.toLowerCase().includes("email"),
      isAddress: stateKey.toLowerCase().includes("address"),
      isCity:
        stateKey.toLowerCase().includes("city") ||
        stateKey.toLowerCase().includes("province"),
      isZip:
        stateKey.toLowerCase().includes("zip") ||
        stateKey.toLowerCase().includes("postal"),
      isState:
        stateKey.toLowerCase().includes("state") ||
        stateKey.toLowerCase().includes("region"),
      isRegion: stateKey.toLowerCase().includes("region"),
      isPhone: stateKey.toLowerCase().includes("phone"),
      isPassword: stateKey.toLowerCase().includes("password"),
      keyboardType: "default",
      autoCapitalize: "sentences"
    };
  }

  componentDidMount() {
    const { keyboardType, autoCapitalize } = this.getInputProps();

    this.setState({ keyboardType, autoCapitalize });
  }

  private getInputProps = (): {
    keyboardType?: TextInputProps["keyboardType"];
    autoCapitalize?: TextInputProps["autoCapitalize"];
    secureTextEntry?: TextInputProps["secureTextEntry"];
  } => {
    const { isPhone, isZip, isEmail, isName, isPassword } = this.state;

    if (isZip) {
      return {
        keyboardType: "numeric",
        autoCapitalize: "none"
      };
    }

    if (isPhone) {
      return {
        keyboardType: "phone-pad",
        autoCapitalize: "none"
      };
    }

    if (isEmail) {
      return {
        keyboardType: "email-address",
        autoCapitalize: "none"
      };
    }

    if (isName) {
      return {
        keyboardType: "default",
        autoCapitalize: "words"
      };
    }

    if (isPassword) {
      return {
        secureTextEntry: true,
        autoCapitalize: "none"
      };
    }

    return {
      keyboardType: "default",
      autoCapitalize: "sentences"
    };
  };

  private onChangeText = (text: string): void => {
    const { onChangeText, stateKey, assignValidity } = this.props;

    onChangeText(text, stateKey);
    setImmediate(() => {
      assignValidity({ stateKey, isValid: this.isValid() });
    });
  };

  private getRef = (r: TextInput): void => {
    const { stateKey, getRef } = this.props;

    if (!this._input) {
      this._input = r;

      if (getRef) {
        getRef(r, stateKey);
      }
    }
  };

  private onFocus = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ): void => {
    const { onFocus } = this.props;
    const { hasFocused } = this.state;

    if (!hasFocused) {
      this.setState({ isFocused: true, hasFocused: true });
    } else {
      this.setState({ isFocused: true });
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  private onBlur = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ): void => {
    const { onBlur, assignValidity, stateKey } = this.props;
    const { hasUnfocused } = this.state;

    if (!hasUnfocused) {
      this.setState({ isFocused: false, hasUnfocused: true });
    } else {
      this.setState({ isFocused: false });
    }

    assignValidity({ stateKey, isValid: this.isValid() });

    if (onBlur) {
      onBlur(event);
    }
  };

  private isValid = (): boolean => {
    const {
      isRequired,
      hasFocused,
      isEmail,
      isName,
      isAddress,
      isCity,
      isZip,
      isState,
      isPhone,
      isRegion,
      isPassword
    } = this.state;
    const { value } = this.props;

    let isValid: boolean = true;

    if (!hasFocused) {
      return true;
    }

    if (!isRequired || !hasFocused) {
      return true;
    }

    if (isPassword) {
      isValid = value.length >= 6 && validator.isAlphanumeric(value, "en-US");
    }

    if (isName) {
      const allValues = value.trim().split(" ");

      isValid =
        !!value &&
        allValues.filter(val => !validator.isAlpha(val, "en-US")).length === 0;
    }

    if (isZip) {
      isValid = value.length >= 5 && validator.isNumeric(value);
    }

    if (isPhone) {
      isValid = validator.isMobilePhone(value, [
        "en-US",
        "zh-CN",
        "zh-HK",
        "zh-TW"
      ]);
    }

    if (isEmail) {
      isValid = validator.isEmail(value);
    }

    if (isAddress || isCity || isState || isRegion) {
      isValid = !!value;
    }

    return isValid;
  };

  private focusInput = (): void => {
    if (this._input) {
      this._input.focus();
    }
  };

  render(): React.ReactNode {
    const {
      accentColor,
      errorAccentColor,
      errorText,
      placeholder,
      containerStyle,
      inputStyle,
      ...otherProps
    } = this.props;
    const { keyboardType, autoCapitalize, isPassword } = this.state;

    return (
      <Touchable
        activeOpacity={1}
        onPress={this.focusInput}
        style={localStyles.container}
      >
        <PText
          color="black"
          text={placeholder}
          size={2}
          lineHeight={42}
          style={localStyles.label}
        />
        <Input
          {...otherProps}
          inputStyle={[localStyles.input, inputStyle]}
          containerStyle={containerStyle}
          accentColor={this.isValid() ? accentColor : errorAccentColor}
          placeholder={""} // to override defaultProp and show no placeholder
          secureTextEntry={isPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          getRef={this.getRef}
          onChangeText={this.onChangeText}
          borderWidth={0}
          borderBottomWidth={0}
          inputContainerStyle={[localStyles.input, localStyles.inputContainer]}
        />
      </Touchable>
    );
  }
}

export { CommonInput };
