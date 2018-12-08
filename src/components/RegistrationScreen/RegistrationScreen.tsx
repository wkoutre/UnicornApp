import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import {
  LayoutAnimation,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Button, PText } from "react-native-common-lib";
import { Container, CommonInput } from "@common";
import { ButtonStyles, ButtonTextStyles } from "@styles";
import { storeAccount, loginUser } from "@actions";
import { IUserAccountPayload, IUserReducer, IRootState } from "@interfaces";
import { defaultRefs, HEIGHT } from "@config";
import { Colors } from "@assets";

const localStyles = StyleSheet.create({
  container: {
    paddingTop: "5%"
  },
  tipsContainer: {
    width: "100%",
    marginVertical: 25
  },
  spinner: {
    marginTop: HEIGHT * 0.35
  }
});

interface IRegistrationScreenProps extends NavigationScreenProps {
  storeAccount: (userAccount: IUserAccountPayload) => void;
  loginUser: (user: IUserReducer) => void;
  accountMap: IRootState["accountMap"];
  user: IRootState["user"];
}

interface IRegistrationScreenState {
  mounted: boolean;
  name: string;
  email: string;
  password: string;
  errorText: string;
  isLogin: boolean;
  validity: {
    [key: string]: boolean;
  };
}

const INPUT_KEYS = ["name", "email", "password"];
const PLACEHOLDERS = ["Enter name*", "Enter email*", "Enter password*"];
const RETURN_KEY_TYPES = ["next", "next", "go"];
const TIP_TEXT = [
  {
    key: "name",
    text: "Name must only contain letters"
  },
  {
    key: "email",
    text: "Email must be valid"
  },
  {
    key: "password",
    text: "Password must be 6+ characters"
  }
];

const NAV_DELAY = 1000;

class XRegistrationScreen extends React.PureComponent<
  IRegistrationScreenProps,
  IRegistrationScreenState
> {
  _email: TextInput | null = null;
  _password: TextInput | null = null;

  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<any, any>) => {
    const headerTitle = navigation.getParam("headerTitle");

    return {
      gesturesEnabled: true,
      headerTitle: headerTitle || "Loading"
    };
  };

  constructor(props: IRegistrationScreenProps) {
    super(props);

    this.state = {
      mounted: !props.user.email,
      name: "",
      email: "",
      password: "",
      errorText: "",
      isLogin: false,
      validity: INPUT_KEYS.reduce((prev, curr) => {
        prev[curr] = false;

        return prev;
      }, {})
    };

    if (!props.user.email) {
      props.navigation.setParams({ headerTitle: "Sign Up!" });
    }
  }

  componentDidMount() {
    const { user, navigation } = this.props;

    console.log(`user:`, user);

    if (user.email) {
      setTimeout(() => {
        navigation.navigate("AudioScreen");
        this.mountScreen();
      }, NAV_DELAY);
    }
  }

  private mountScreen = (): void => {
    this.setState({ mounted: true });
  };

  private onChangeText = (text: string, stateKey: string) => {
    this.setState({ [stateKey]: text });
  };

  private getRef = (r: TextInput, stateKey: string): void => {
    this[`_${stateKey}`] = r;
  };

  private assignValidity = ({
    stateKey,
    isValid
  }: {
    stateKey: string;
    isValid: boolean;
  }): void => {
    const { validity, errorText } = this.state;

    if (errorText) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    this.setState({
      validity: {
        ...validity,
        [stateKey]: isValid
      },
      errorText: ""
    });
  };

  private isDisabled = (): boolean => {
    const { isLogin, validity } = this.state;

    const emailAndPassValid = validity.email && validity.password;

    if (isLogin) {
      return !emailAndPassValid;
    }

    return !(emailAndPassValid && validity.name);
  };

  private renderError = (): React.ReactNode => {
    const { errorText } = this.state;

    if (errorText) {
      return (
        <PText
          text={errorText}
          color={"red"}
          mTpx={10}
          mBpx={10}
          alignSelf={"center"}
          textAlign={"center"}
        />
      );
    }

    return null;
  };

  private focusEmail = (): void => {
    if (this._email) {
      this._email.focus();
    }
  };

  private focusPassword = (): void => {
    if (this._password) {
      this._password.focus();
    }
  };

  private onSubmitEditing = (stateKey: string): (() => void) => {
    switch (stateKey) {
      case "name":
        return this.focusEmail;

      case "email":
        return this.focusPassword;

      default:
        return this.isDisabled()
          ? defaultRefs.nullFunc
          : this.handleButton1Press;
    }
  };

  private renderinputs = (): React.ReactNode => {
    const { isLogin } = this.state;

    const inputKeys = isLogin ? INPUT_KEYS.slice(1) : INPUT_KEYS;
    const placeholders = isLogin ? PLACEHOLDERS.slice(1) : PLACEHOLDERS;
    const returnKeyTypes = isLogin
      ? RETURN_KEY_TYPES.slice(1)
      : RETURN_KEY_TYPES;

    return inputKeys.map((stateKey, i) => {
      const value = this.state[stateKey];

      return (
        <CommonInput
          returnKeyType={returnKeyTypes[i]}
          getRef={this.getRef}
          onSubmitEditing={this.onSubmitEditing(stateKey)}
          assignValidity={this.assignValidity}
          key={stateKey}
          onChangeText={this.onChangeText}
          placeholder={placeholders[i]}
          stateKey={stateKey}
          value={value}
        />
      );
    });
  };

  private renderTips = (): React.ReactNode => {
    const { isLogin } = this.state;

    const keysToUse = isLogin ? TIP_TEXT.slice(1) : TIP_TEXT;

    const tips = keysToUse.map(({ key, text }) => {
      const isValid = this.state.validity[key];

      return <PText key={text} text={text} color={isValid ? "green" : "red"} />;
    });

    return <View style={localStyles.tipsContainer}>{tips}</View>;
  };

  private validateAccount = (): string => {
    const { email, password, isLogin } = this.state;
    const { accountMap } = this.props;
    const existingAccount = accountMap[email];

    if (isLogin) {
      if (!existingAccount) {
        return "No account exists for this email";
      }

      if (existingAccount.password !== password) {
        return "Incorrect password for this email";
      }

      return "";
    }

    // Signing up
    return existingAccount ? "Account already exists for this email" : "";
  };

  private handleButton1Press = (): void => {
    const { name, email, password, isLogin } = this.state;

    const errorText = this.validateAccount();

    if (errorText) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ errorText });

      return;
    }

    if (isLogin) {
      this.props.loginUser({
        name,
        email
      });
      return;
    }

    this.props.storeAccount({
      name,
      email,
      password
    });

    this.props.loginUser({
      name,
      email
    });
  };

  private toggleLoginState = (): void => {
    const { isLogin } = this.state;

    this.props.navigation.setParams({
      headerTitle: isLogin ? "Sign Up" : "Sign In"
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ isLogin: !isLogin, errorText: "" });
  };

  render(): React.ReactNode {
    const { isLogin, mounted } = this.state;

    if (!mounted) {
      return (
        <Container>
          <ActivityIndicator
            size={"large"}
            color={Colors.black}
            style={localStyles.spinner}
          />
        </Container>
      );
    }

    return (
      <Container fade={true} style={localStyles.container}>
        {this.renderError()}
        {this.renderinputs()}
        {this.renderTips()}
        <Button
          onPress={this.handleButton1Press}
          title={isLogin ? "Sign In" : "Sign Up!"}
          backgroundColor={"black"}
          buttonStyle={ButtonStyles.full}
          commonTextProps={ButtonTextStyles.whiteText}
          disabled={this.isDisabled()}
        />
        <Button
          mTpx={10}
          onPress={this.toggleLoginState}
          title={isLogin ? "Back to Sign Up" : "Already have an account?"}
          backgroundColor={"blueGray50"}
          buttonStyle={ButtonStyles.full}
          commonTextProps={ButtonTextStyles.blackText}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ accountMap, user }: IRootState) => ({
  accountMap,
  user
});

export const RegistrationScreen = connect(
  mapStateToProps,
  { loginUser, storeAccount }
)(XRegistrationScreen);
