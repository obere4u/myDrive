import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import { Image, ScrollView, Text, View} from "react-native";

export default function SignIn() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear any previous errors when user starts typing
      if (error) setError(null);
    },
    [error],
  );

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      // Sign in successful
      if (completeSignIn.status === "complete") {
        router.replace("/home");
      }
    } catch (err: any) {
      // Handle sign-in errors
      const errorMessage = err.errors?.[0]?.longMessage || "Sign in failed";
      setError(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  }, [form.email, form.password, isLoaded, signIn, router]);

  return (
    <ScrollView className="flex-1 bg-[#f1f1f1]">
      <View className="flex-1 bg-[#f1f1f1]">
        <View className="w-full h-[250px] relative">
          <Image source={images.signUpCar} resizeMode="contain" className="h-[250px] w-full z-0" />
          <Text className="absolute bottom-0 left-5 text-2xl font-JakartaSemiBold">
            Welcome back 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="email"
            keyboardType="email-address"
            icon={icons.email}
            placeholder="example@gmail.com"
            value={form.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />

          <InputField
            label="password"
            icon={icons.lock}
            placeholder="123asd##"
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />

          {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}

          <CustomButton title="Sign In" className="mt-6" onPress={onSignInPress} />
        </View>

        <OAuth />

        <Link href="/sign-up" className="w-full text-center text-general-200 text-lg mt-6">
          <Text>Don't have account?</Text>
          <Text className="text-primary-500"> Sign Up</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
