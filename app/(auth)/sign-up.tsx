import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSignUpPress = () => {};

  return (
    <ScrollView className="felx-1 bg-#f1f1f1">
      <View className="flex-1 bg-#f1f1f1">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="absolute bottom-5 left-5 capitalize text-neutral-950 font-JakartaBold text-2xl">
            create your account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label={"name"}
            placeholder={"Tochi"}
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <InputField
            label={"email"}
            keyboardType="email-address"
            placeholder={"example@gmail.com"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label={"password"}
            placeholder={"1234assda"}
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
        </View>
        <CustomButton title="sign up" onPress={onSignUpPress} className="mt-6" />
        {/* OAuth */}
        <View>
          <OAuth />
        </View>

        <Link href={"/sign-in"} className="w-full text-lg text-general-200 text-center mt-5">
          <Text className="first-letter:capitalize mr-2">Already have an account?</Text>
          <Text className="capitalize text-primary-500">log in</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
