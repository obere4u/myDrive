import React from "react";
import { Image, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import CustomButton from "./CustomButton";
import { images } from "@/constants";
import { ModalProps } from "@/types/type";

export default function Modal({
  isVisible,
  onBackdropPress,
  icon,
  btnTitle = "Confirm",
  onPress,
  title,
  description
}: ModalProps) {
  return (
    <ReactNativeModal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View className="bg-[#f1f1f1] rounded-2xl px-7 py-9 min-h-[300px]">
        {icon && <Image source={icon} className="w-[110px] h-[110px] mx-auto my-6" />}
        <Text className="text-center font-JakartaSemiBold text-3xl capitalize">{title}</Text>
        <Text className="text-base text-gray-400 font-Jakarta text-center mt-2 first-letter:capitalize">
          {description}
        </Text>
        <CustomButton title={btnTitle} onPress={onPress} className="mt-6" />
      </View>
    </ReactNativeModal>
  );
}
