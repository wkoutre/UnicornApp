import { AppRegistry, UIManager, Platform } from "react-native";
import App from "./App.tsx";
import { name as appName } from "./app.json";

if (Platform.OS !== "ios" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

AppRegistry.registerComponent(appName, () => App);
