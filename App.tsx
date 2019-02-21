import React from "react";
import { View, NativeModules, YellowBox, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@store";
import { AppWithNavigationState } from "@navigation";
import { TabBodyScroller } from "@components";
// import { AppLoader } from "@components";

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "beige",
  },
});

YellowBox.ignoreWarnings([
  "Require cycle:",
  "Require cycle",
  "Require",
  "Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.",
]);

// for using LayoutAnimation on Android
if (NativeModules.UIManager.setLayoutAnimationEnabledExperimental) {
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class App extends React.PureComponent {
  render() {
    return (
      <View style={localStyles.container}>
        <TabBodyScroller />
      </View>
    );

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          {/* <AppLoader /> */}
          <AppWithNavigationState />
        </PersistGate>
      </Provider>
    );
  }
}
