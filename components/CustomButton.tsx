import React from "react";
import { ButtonProps } from "@/types/type";
import { Text, TouchableOpacity } from "react-native";

export default function CustomButton({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) {
  const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
    switch (variant) {
      case "secondary":
        return "bg-gray-500";
      case "success":
        return "bg-green-500";
      case "danger":
        return "bg-red-500";
      case "outline":
        return "bg-transparent border-[0.5px] border-neutral-300";
      default:
        return "bg-[#0286FF]";
    }
  };

  const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
    switch (variant) {
      case "primary":
        return "text-neutral-900";
      case "secondary":
        return "text-gray-100";
      case "danger":
        return "text-red-100";
      case "success":
        return "text-green-100";
      default:
        return "text-neutral-50";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full p-5 rounded-full flex flex-row justify-center items-center shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
      {...props}>
      {IconLeft && <IconLeft />}
      <Text className={`capitalize text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
        {title}
      </Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
}
