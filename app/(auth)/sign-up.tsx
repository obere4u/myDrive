import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import Modal from "@/components/Modal";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useState, useCallback } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState({
    state: "default" as "default" | "pending" | "failed" | "success",
    error: "",
    code: "",
  });

  const handleInputChange = useCallback((field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const onSignUpPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // Proceed with verification or other actions
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification((prev) => ({ ...prev, state: "pending" }));
    } catch (err: any) {
      if (err.errors && err.errors[0]?.longMessage) {
        Alert.alert("Error", err.errors[0].longMessage); // Clerk's validation message
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  }, [form.email, form.password, isLoaded, signUp]);

  const onPressVerify = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        //TODO: create a new user in our database
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification((prev) => ({ ...prev, state: "success" }));
      } else {
        // Alert.alert("Error", err.erros?.[0]?.longMessage);
        setVerification((prev) => ({
          ...prev,
          error: "Verification failed",
          state: "failed",
        }));
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      setVerification((prev) => ({
        ...prev,
        error: err.errors?.[0]?.longMessage || "Verification failed",
        state: "failed",
      }));
      Alert.alert("Error", err.erros[0]?.longMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signUp, verification.code, setActive]);

  const handleVerificationCodeChange = useCallback((code: string) => {
    setVerification((prev) => ({ ...prev, code }));
  }, []);

  // if (loading) {
  //   return <Text>loading...</Text>
  // }
  return (
    <ScrollView className="flex-1 bg-[#f1f1f1]">
      <View className="flex-1 bg-[#f1f1f1]">
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
            onChangeText={(value) => handleInputChange("name", value)}
          />

          <InputField
            label={"email"}
            keyboardType="email-address"
            placeholder={"example@gmail.com"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />

          <InputField
            label={"password"}
            placeholder={"1234assda"}
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => handleInputChange("password", value)}
          />
        </View>

        <CustomButton title="sign up" onPress={onSignUpPress} className="mt-6" />

        {/* OAuth */}
        <View>
          <OAuth />
        </View>

        <Link href={"/sign-in"} className="w-full text-lg text-general-200 text-center mt-5">
          <Text className="first-letter:capitalize mr-2">Already have an account? </Text>
          <Text className="capitalize text-primary-500">log in</Text>
        </Link>
        {/* captcha */}
        {/* verification modal */}
        {/* verification pending */}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => setVerification({ ...verification, state: "success" })}>
          <View className="bg-[#f1f1f1] rounded-2xl px-7 py-9 min-h-[300px]">
            <Text className="font-JakartaSemiBold text-3xl capital">Verification</Text>
            <Text className="text-base text-gray-400 font-Jakarta mt-2 mb-5 first-letter:capitalize">
              we sent a verification code to {form.email}
            </Text>
            <InputField
              label="code"
              icon={icons.lock}
              placeholder="1234"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={handleVerificationCodeChange}
              className="mt-5"
            />
            {verification.error && (
              <Text className="text-red-500 mt-1 text-sm">{verification.error}</Text>
            )}
            <CustomButton title="verify" onPress={onPressVerify} className="mt-6 bg-success-500" />
          </View>
        </ReactNativeModal>
        {/* verification success */}
        
        <Modal
          isVisible={verification.state === "success"}
          onBackdropPress={() => setVerification((prev) => ({ ...prev, state: "default" }))}
          title="Verified"
          description="You have successfully verified your account"
          icon={images.check}
          btnTitle="Go to home"
          onPress={() => router.replace("/(root)/(tabs)/home")}
        />
      </View>
    </ScrollView>
  );
}
