import CustomButton from "@/components/CustomButton";
import RideLayout from "@/components/RideLayout";
import SearchLocationInput from "@/components/SearchLocationInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function FindRide() {
  const { userAddress, destinationAddress, setDestinationLocation, setUserLocation } =
    useLocationStore();

  return (
    <RideLayout title="find ride" snapPoints={["50%,85%"]}>
      <View className="my-3">
        <Text className="mb-3 text-xl font-JakartaSemiBold">From</Text>
        <SearchLocationInput
          icon={icons.target}
          handlePress={(location) => setUserLocation(location)}
          initialLocation={userAddress || ""}
          containerStyle="bg-netural-100"
          textInputBackgroundColor="#f5f2f2"
        />
      </View>
      <View className="my-3">
        <Text className="mb-3 text-xl font-JakartaSemiBold">To</Text>
        <SearchLocationInput
          icon={icons.map}
          handlePress={(location) => setDestinationLocation(location)}
          initialLocation={destinationAddress || ""}
          containerStyle="bg-netural-100"
          textInputBackgroundColor="transparent"
          zIndex={40}
        />
      </View>
      <CustomButton
        title="find ride"
        onPress={() => router.push("/(root)/confirm-ride")}
        className="mt-5"
      />
    </RideLayout>
  );
}
