import { icons } from "@/constants";
import { router } from "expo-router";
import React, { ReactNode, useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./Map";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

// GestureHandlerRootView lets us drag a view untop a screen
// bottom sheet helps us to have the scrollable component at the bottom of main component
export default function RideLayout({
  children,
  title,
  snapPoints,
}: {
  children: ReactNode;
  title: string;
  snapPoints: string[];
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-[#f1f1f1]">
        <View className="bg-general-100 relative p t-5 flex flex-col h-[70vh]">
          <View className="flex flex-row bg-general-100/80 py-3 rounded-br-lg items-center justify-start px-5 absolute z-10">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="w-10 h-10 bg-[#f1f1f1] items-center justify-center rounded-full">
                <Image source={icons.backArrow} resizeMode="contain" className="w-6 h-6" />
              </View>
            </TouchableOpacity>
            <Text className="capitalize ml-5 font-JakartaSemiBold text-xl">
              {title || "go back"}
            </Text>
          </View>
          {/* map */}
          <Map />
        </View>
      </View>
      {/* 40% is the lowest point and 85% is highest point it can go  */}
      <BottomSheet
        keyboardBehavior="interactive"
        ref={bottomSheetRef}
        snapPoints={snapPoints || ["40%", "85%"]}
        index={0}>
        <BottomSheetView style={{ flex: 1, padding: 20 }}>{children}</BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
