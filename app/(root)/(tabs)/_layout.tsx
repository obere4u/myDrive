import { icons } from "@/constants";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

interface TabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

export default function Layout() {
  const TabIcon = ({ focused, source }: TabIconProps) => (
    <View className={`flex flex-row justify-center items-center rounded-full `}>
      <View
        className={`rounded-full w-12 h-12 flex flex-row justify-center items-center ${
          focused ? "bg-general-400" : ""
        }`}>
        <Image source={source} tintColor={"#f1f1f1"} resizeMode="contain" className="w-7 h-7" />
      </View>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f1f1f1",
        tabBarInactiveTintColor: "#f1f1f1",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          overflow: "hidden",
          height: 78,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 20,
          marginBottom: 20,
          paddingTop: 20,
          paddingBottom: 0,
          position: "absolute",
        },
      }}>
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />,
        }}
      />
      {/* Chat Tab */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.chat} />,
        }}
      />
      {/* Rides Tab */}
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.list} />,
        }}
      />
      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.profile} />,
        }}
      />
    </Tabs>
  );
}
