import { InputFieldProps } from "@/types/type";
import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function InputField({
  label,
  labelStyle,
  placeholder,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`${containerStyle}`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`capitalize text-lg font-JakartaBoldn mb-3${labelStyle}`}>{label}</Text>

          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 border border-neutral-100 rounded-full focus:border-primary-500`}>
            {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}

            <TextInput
              className={`p-4 rounded-full font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} ${className} text-left`}
              secureTextEntry={secureTextEntry}
              placeholder={placeholder}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
