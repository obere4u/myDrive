import { GoogleInputProps } from "@/types/type";
import React from "react";
import { Text, View } from "react-native";

export default function GoogleTextInput({
  icon,
  containerStyle,
  handlePress,
  initialLocation,
}: GoogleInputProps) {
  return (
    <View
      className={`${containerStyle} flex flex-row items-center justify-center relative z-50 rounded-xl mb-5`}>
      <Text>Search</Text>
    </View>
  );
}
