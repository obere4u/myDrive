import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";
import React from "react";
import { Text, View } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";

export default function DriverCard({ item, selected, setSelected }: DriverCardProps) {
  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${
        selected === item.id ? "bg-general-600" : "bg-white"
      } flex flex-row items-center justify-between py-5 px-3 rounded-xl`}>
      <View className="">
        <Image
          source={{ uri: item.profile_image_url }}
          resizeMode="cover"
          className="w-20 h-20 rounded-full"
        />
      </View>

      <View className="flex flex-col items-start justify-center mx-3">
        <View className="flex flex-row items-center justify-start mb-1">
          <Text className="text-lg font-JakartaRegular">{item.title}</Text>

          <View className="flex flex-row items-center space-x-1 ml-2">
            <Image source={icons.star} className="w-3.5 h-3.5" />
            <Text className="text-sm font-JakartaRegular">4</Text>
          </View>
        </View>

        <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row items-center">
            <Image source={icons.dollar} className="w-4 h-4" />
            <Text className="text-sm font-JakartaRegular ml-1">${item.price}</Text>
          </View>

          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">|</Text>

          <Text className="text-sm font-JakartaRegular text-general-800">
            {formatTime(parseInt(`${item.time!}`))}
          </Text>

          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">|</Text>

          <Text className="text-sm font-JakartaRegular text-general-800">
            {item.car_seats} seats
          </Text>
        </View>
      </View>

      <Image source={{ uri: item.car_image_url }} className="h-20 w-20" resizeMode="contain" />
    </TouchableOpacity>
  );
}
