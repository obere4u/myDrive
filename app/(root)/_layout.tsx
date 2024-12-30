import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="find-ride" options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="confirm-ride" options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="book-ride" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
  );
}
