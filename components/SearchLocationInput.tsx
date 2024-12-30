import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { debounce } from "@/lib/utils";
import { GoogleInputProps } from "@/types/type";

const LOCATIONIQ_API_KEY = process.env.EXPO_PUBLIC_GEOLOCATION_API_KEY;

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export default function SearchLocationInput({
  icon,
  containerStyle,
  handlePress,
  initialLocation,
  textInputBackgroundColor,
  zIndex = 50, // Allow custom z-index to be passed
}: GoogleInputProps & { zIndex?: number }) {
  const [query, setQuery] = useState<string | null>(initialLocation || null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

  const fetchSuggestions = useCallback(
    debounce(async (text: string) => {
      if (!text) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
            text,
          )}&limit=5`,
        );
        const data: LocationSuggestion[] = (await response.json()) || [];
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 500),
    [],
  );

  const handleInputChange = (text: string) => {
    setQuery(text);
    fetchSuggestions(text);
  };

  const handleLocationSelect = (item: LocationSuggestion) => {
    setQuery(item.display_name);
    setSuggestions([]);
    handlePress({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    });
  };

  const handleOutsideClick = () => {
    setSuggestions([]);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View className={`relative flex flex-col items-center ${containerStyle}`} style={{ zIndex }}>
        <View
          style={{
            backgroundColor: textInputBackgroundColor || "#f5f5f5",
            height: 60,
          }}
          className="relative w-full flex flex-row items-center border border-gray-200 rounded-2xl px-3 py-2">
          {icon && (
            <View className="items-center justify-center w-6 h-6">
              <Image source={icon} resizeMode="contain" className="w-6 h-6" alt="icon" />
            </View>
          )}
          <TextInput
            className={`${textInputBackgroundColor} pl-4 pr-2 py-1 flex-1 text-sm text-gray-800`}
            placeholder="Where do you want to go?"
            value={query || ""}
            onChangeText={handleInputChange}
            accessibilityLabel="Search for a location"
          />
        </View>
        {suggestions.length > 0 && (
          <ScrollView
            className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-lg border border-gray-100 mt-2"
            style={{
              maxHeight: 250, // Limit height of suggestions
              zIndex: zIndex + 1,
            }}
            keyboardShouldPersistTaps="handled" // Allow tapping suggestions while keyboard is up
          >
            {suggestions.map((item) => (
              <TouchableOpacity
                key={`${item.place_id}-${item.lat}-${item.lon}`}
                className="px-3 py-2 border-b border-gray-100"
                onPress={() => handleLocationSelect(item)}
                accessibilityLabel={`Select location ${item.display_name}`}>
                <Text className="text-gray-700">{item.display_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
