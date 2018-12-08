/*
    Reference: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-navigation/index.d.ts
*/

import { connect } from "react-redux";
import {
  createStackNavigator,
  StackNavigatorConfig,
  NavigationRouteConfigMap,
  NavigationState,
  NavigationContainer,
  NavigationComponent
} from "react-navigation";
import { reduxifyNavigator } from "react-navigation-redux-helpers";
import { FIRST_SCREEN } from "@config";
import {
  DEFAULT_HEADER_SIZES,
  DEFAULT_FONT_FAMILY,
  DEFAULT_P_FONT_WEIGHT
} from "@styles/TextStyles";

import { RegistrationScreen, LoginScreen, AudioScreen } from "@components";

interface INavState {
  nav: NavigationState;
}

const routeConfig: NavigationRouteConfigMap = {
  RegistrationScreen: {
    screen: RegistrationScreen
  },
  LoginScreen: {
    screen: LoginScreen
  },
  AudioScreen: {
    screen: AudioScreen
  }
};

const navConfig: StackNavigatorConfig = {
  initialRouteName: FIRST_SCREEN,
  navigationOptions: {
    headerTitleStyle: {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontWeight: DEFAULT_P_FONT_WEIGHT,
      fontSize: DEFAULT_HEADER_SIZES.h6
    }
  }
};

// exported to create reducer @ src/redux/reducers/navReducers/navReducer.ts
export const RootNavigator: NavigationContainer = createStackNavigator(
  routeConfig,
  navConfig
);

const App: NavigationComponent = reduxifyNavigator(RootNavigator, "root");

const mapStateToProps = ({ nav }: INavState) => ({
  state: nav
});

export const AppWithNavigationState: NavigationComponent = connect(
  mapStateToProps
)(App);
