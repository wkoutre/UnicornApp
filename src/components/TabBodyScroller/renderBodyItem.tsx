import React from "react";
import { View, Text, StyleSheet } from "react-native";

const localStyles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const renderBodyItem = (item: string, index: number) => (
  <View style={localStyles.container}>
    <Text>{item}</Text>
  </View>
);
