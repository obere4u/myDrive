import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";
import React from "react";
import { Image, Text, View } from "react-native";

const GEOAPIFY_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;

export default function RideCard({
  ride: {
    destination_address,
    destination_latitude,
    destination_longitude,
    origin_address,
    origin_latitude,
    origin_longitude,
    ride_time,
    created_at,
    payment_status,
    driver,
  },
}: {
  ride: Ride;
}) {
  return (
    <View className="flex flex-row items-center justify-center bg-[#f1f1f1] rounded-lg shadow-lg shadow-neutral-300 mb-3">
      <View className="flex flex-col items-center justify-center p-3">
        <View className="flex flex-row items-center justify-between">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${GEOAPIFY_KEY}`,
            }}
            resizeMode="contain"
            className="w-20 h-20 rounded-lg"
          />
          {/* ride details */}
          <View className="flex flex-col gap-y-5 mx-5 flex-1">
            {/* from */}
            <View className="flex flex-row gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="">{origin_address}</Text>
            </View>
            {/* to*/}
            <View className="flex flex-row gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {destination_address}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-5 rounded-lg flex flex-col w-full bg-general-500 p-3 items-start justify-center">
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="capitalize text-md font-JakartaMedium text-gray-500">Date & time</Text>
            <Text className="capitalize text-md font-JakartaMedium text-gray-500">
              {formatDate(created_at)}, {formatTime(ride_time)}
            </Text>
          </View>
          {/* driver details */}
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="capitalize text-md font-JakartaMedium text-gray-500">Driver</Text>
            <Text className="capitalize text-md font-JakartaMedium text-gray-500">
              {driver.first_name}, {driver.last_name}
            </Text>
          </View>
          {/* car details */}
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="capitalize text-md font-JakartaMedium text-gray-500">Car Seats</Text>
            <Text className="capitalize text-md font-JakartaMedium text-gray-500">
              {driver.car_seats}
            </Text>
          </View>
          {/* payment details */}
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="capitalize text-md font-JakartaMedium text-gray-500">payment</Text>
            <Text
              className={`capitalize text-md font-JakartaMedium ${payment_status === "paid" ? "text-green-500" : "text-red-500"}`}>
              {payment_status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
