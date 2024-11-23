import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  return (
    <SafeAreaView className="h-full bg-neutral-100 flex items-center justify-between">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }} className="w-full justify-end items-end p-5 ">
        <Text className="text-neutral-950 text-xl capitalize font-JakartaBold pr-5">skip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
