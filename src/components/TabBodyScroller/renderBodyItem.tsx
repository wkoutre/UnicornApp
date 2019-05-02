import React from "react";
import { View, Text, StyleSheet } from "react-native";

const localStyles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const renderBodyItem = (item: string, _index: number) => (
  <View style={localStyles.container}>
    <Text>{item}</Text>
  </View>
);
