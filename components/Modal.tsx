import React from "react";
import { Image, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import CustomButton from "./CustomButton";
import { ModalProps } from "@/types/type";
import InputField from "./InputField";

export default function Modal({
  isVisible,
  onBackdropPress,
  onPress,
  onChangeText,
  onModalHide,
  value,
  placeholder,
  label,
  keyboardType = "default",
  icon,
  image,
  btnTitle,
  title,
  description,
  error,
}: ModalProps) {
  return (
    <ReactNativeModal
      onModalHide={onModalHide}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <View className="bg-[#f1f1f1] rounded-2xl px-7 py-9 min-h-[300px]">
        {image && <Image source={image} className="w-[110px] h-[110px] mx-auto my-6" />}
        <Text className="text-center font-JakartaSemiBold text-3xl capitalize">{title}</Text>
        <Text className="text-base text-gray-400 font-Jakarta text-center mt-2 first-letter:capitalize">
          {description}
        </Text>

        {onChangeText && (
          <InputField
            label={label || ""}
            icon={icon}
            placeholder={placeholder}
            value={value}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
          />
        )}

        {error && <Text className="text-red-500 mt-1 text-sm">{error}</Text>}
        <CustomButton title={btnTitle || ""} onPress={onPress} className="mt-6" />
      </View>
    </ReactNativeModal>
  );
}
