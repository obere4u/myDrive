import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = async () =>{}
  return (
    <ScrollView className="flex-1 bg-[#f1f1f1]">
      <View className="flex-1 bg-[#f1f1f1]">
        <View className="w-full h-[250px] relative">
          <Image source={images.signUpCar} resizeMode="contain" className="h-[250px] w-full z-0" />
          <Text className="absolute bottom-0 left-5 text-2xl font-JakartaSemiBold ">
            Welcome back 👋
          </Text>
          <View className="p-5">
            <InputField
              label="email"
              keyboardType="email-address"
              icon={icons.person}
              placeholder="example@gmail.com"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <InputField
              label="password"
              icon={icons.lock}
              placeholder="123asd##"
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
            <CustomButton title="Sign In" className="mt-6" onPress={onSignInPress}/>
          </View>

          <OAuth />

          <Link href="/sign-up" className="w-full text-center text-general-200 text-lg mt-6">
            <Text>Don't have account?</Text>
            <Text className="text-primary-500"> Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
