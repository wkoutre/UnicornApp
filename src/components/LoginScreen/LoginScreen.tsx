import * as React from "react";
import { View } from "react-native";
import { HText } from "react-native-common-lib";

interface ILoginScreenProps {}

interface ILoginScreenState {}

class LoginScreen extends React.PureComponent<
  ILoginScreenProps,
  ILoginScreenState
> {
  constructor(props: ILoginScreenProps) {
    super(props);

    this.state = {};
  }

  render(): React.ReactNode {
    return (
      <View>
        <HText text={"login"} />
      </View>
    );
  }
}

export { LoginScreen };
