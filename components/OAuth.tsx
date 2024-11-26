import React from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";

export default function OAuth() {
  const handleGoogleSignIn = async () => {};
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-1 bg-general-100" />
        <Text className="text-lg">OR</Text>
        <View className="flex-1 h-1 bg-general-100" />
      </View>
      <CustomButton
        title="Login with Google"
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
        className="mt-6 w-full shadow-none"
        IconLeft={() => (
          <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2" />
        )}
      />
    </View>
  );
}
