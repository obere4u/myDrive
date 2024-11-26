import CustomButton from "@/components/CustomButton";
import { onboardingItems } from "@/constants";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function Onboarding() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboardingItems.length - 1;

  return (
    <SafeAreaView className="h-full bg-neutral-100 flex items-center justify-between">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="w-full justify-end items-end p-5 ">
        <Text className="text-neutral-950 text-xl capitalize font-JakartaBold pr-5">skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-8 h-1 mx-1 rounded-full bg-neutral-50" />}
        activeDot={<View className="w-8 h-1 mx-1 bg-[#0286FF] rounded-full" />}
        onIndexChanged={(index) => {
          setActiveIndex(index);
        }}>
        {onboardingItems.map((onboardingItem, index) => (
          <View key={onboardingItem.title + index} className="flex items-center justify-center p-5">
            <Image
              source={onboardingItem.image}
              className="h-[300px] w-full "
              resizeMode="contain"
            />
            <View className="w-full flex flex-col items-center justify-center m-10">
              <Text className="text-neutral-900 text-3xl font-bold">{onboardingItem.title}</Text>
              <Text className="text-sm font-JakartaBold text-center text-neutral-600 mt-3">
                {onboardingItem.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "get started" : "next"}
        onPress={() => {
          if (isLastSlide) {
            router.push("/(auth)/sign-up");
          } else {
            swiperRef.current?.scrollBy(1);
          }
        }}
        className="mt-10 w-11/12"
      />
    </SafeAreaView>
  );
}
