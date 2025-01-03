import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import RideCardSkeleton from "@/components/ui/ride-card-skeleton";
import { icons, images } from "@/constants";
import { Ride } from "@/types/type";
import { useUser } from "@clerk/clerk-expo";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import SearchLocationInput from "@/components/SearchLocationInput";
import RideCard from "@/components/RideCard";

const recentRide: Ride[] = [
  {
    origin_address: "Kathmandu, Nepal",
    destination_address: "Pokhara, Nepal",
    origin_latitude: 27.717245,
    origin_longitude: 85.323961,
    destination_latitude: 28.209583,
    destination_longitude: 83.985567,
    ride_time: 391,
    fare_price: 19500.0,
    payment_status: "paid",
    driver_id: 2,
    user_email: "user1@example.com",
    created_at: "2024-08-12 05:19:20.620007",
    driver: {
      first_name: "David",
      last_name: "Brown",
      car_seats: 5,
    },
  },
  {
    origin_address: "Jalkot, MH",
    destination_address: "Pune, Maharashtra, India",
    origin_latitude: 18.609116,
    origin_longitude: 77.165873,
    destination_latitude: 18.52043,
    destination_longitude: 73.856744,
    ride_time: 491,
    fare_price: 24500.0,
    payment_status: "paid",
    driver_id: 1,
    user_email: "user1@example.com",
    created_at: "2024-08-12 06:12:17.683046",
    driver: {
      first_name: "James",
      last_name: "Wilson",
      car_seats: 4,
    },
  },
  {
    origin_address: "Zagreb, Croatia",
    destination_address: "Rijeka, Croatia",
    origin_latitude: 45.815011,
    origin_longitude: 15.981919,
    destination_latitude: 45.327063,
    destination_longitude: 14.442176,
    ride_time: 124,
    fare_price: 6200.0,
    payment_status: "paid",
    driver_id: 1,
    user_email: "user1@example.com",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      first_name: "James",
      last_name: "Wilson",
      car_seats: 4,
    },
  },
  {
    origin_address: "Okayama, Japan",
    destination_address: "Osaka, Japan",
    origin_latitude: 34.655531,
    origin_longitude: 133.919795,
    destination_latitude: 34.693725,
    destination_longitude: 135.502254,
    ride_time: 159,
    fare_price: 7900.0,
    payment_status: "paid",
    driver_id: 3,
    user_email: "user1@example.com",
    created_at: "2024-08-12 18:43:54.297838",
    driver: {
      first_name: "Michael",
      last_name: "Johnson",
      car_seats: 4,
    },
  },
];

interface LocationTypes {
  latitude: number;
  longitude: number;
  address: string;
}

export default function Page() {
  const { user } = useUser();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const handleSignOut = () => {};
  const destinationPress = (location: LocationTypes) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    setIsLoading(true);
  }, [loading]);

  useEffect(() => {
    try {
      const requestLocation = async () => {
        const isLocationServiceEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationServiceEnabled) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services in your device settings to use this feature.",
            [{ text: "OK" }],
          );

          return;
        }
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setHasPermission(false);
          Alert.alert(
            "Location Permission Denied",
            "This feature requires location access. Please grant permission in your device settings.",
            [{ text: "OK" }],
          );
          return;
        }

        let location = await Location.getCurrentPositionAsync();
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords?.latitude!,
          longitude: location.coords?.longitude!,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address[0].streetNumber} ${address[0].street}, ${address[0].subregion}`,
        });
      };
      requestLocation();
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Location Error", "Unable to retrieve your current location. Please try again.", [
        { text: "OK" },
      ]);
    }
  }, []);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row py-5 justify-between items-center">
              <View className="flex flex-col gap-y-2 ">
                <Text className="first-letter:capitalize font-JakartaSemiBold">Welcome, 👋</Text>
                <Text className={`${user?.firstName ? "capitalize" : ""}`}>
                  {user?.firstName || user?.emailAddresses[0].emailAddress}{" "}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleSignOut}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f1f1f1]">
                <Image source={icons.out} className="w-5 h-5" />
              </TouchableOpacity>
            </View>
            {/* Search text input */}
            <SearchLocationInput
              icon={icons.search}
              containerStyle={"bg-white shadow-md shadow-neutral-300"}
              handlePress={destinationPress}
            />
            {/* current location */}
            <View>
              <Text className="capitalize text-lg font-JakartaMedium mt-5 mb-3">
                your current location:
              </Text>
              <View className="h-[300px] bg-transparent flex flex-row items-center">
                <Map />
              </View>
              <Text className="capitalize text-lg font-JakartaMedium mt-5 mb-3">recent rides</Text>
            </View>
          </>
        )}
        data={recentRide?.slice(0, 5)}
        keyExtractor={(item, index) => `${item.ride_time}-${item.driver_id}`}
        // data={[]}
        renderItem={({ item, index }) => <RideCard ride={item} />}
        className="px-3"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col h-screen items-center justify-center capitalize">
            {!loading ? (
              <View>
                <Image source={images.noResult} resizeMode="contain" className="w-40 h-40" />
                <Text className="first-letter:capitalize text-general-200">
                  No recent ride found
                </Text>
              </View>
            ) : (
              <RideCardSkeleton />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
