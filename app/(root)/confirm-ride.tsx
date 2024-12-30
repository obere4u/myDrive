import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriverStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function ConfirmRide() {
  const { selectedDriver, setSelectedDriver, drivers } = useDriverStore();
  const [snapPoints, setSnapPoints] = useState<string[]>(["20%", "25%"]);

  // Update snapPoints based on drivers when they are available
  useEffect(() => {
    if (drivers) {
      setSnapPoints(["80%", "85%"]);
    }
  }, [drivers]);

  return (
    <RideLayout title="Confirm Ride" snapPoints={snapPoints}>
      <FlatList
        data={drivers}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => {
          if (!item) {
            return (
              <View className="flex justify-center items-center w-full">
                <ActivityIndicator />;
              </View>
            );
          }
          return (
            <DriverCard
              item={item}
              selected={selectedDriver!}
              setSelected={() => {
                setSelectedDriver(item.id);
              }}
            />
          );
        }}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton title="Book ride" onPress={() => router.push("/(root)/book-ride")} />
          </View>
        )}
      />
    </RideLayout>
  );
}
