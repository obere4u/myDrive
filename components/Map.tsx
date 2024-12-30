import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useDriverStore, useLocationStore } from "@/store";
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from "@/lib/map";
import { Driver, MarkerData } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";

export default function Map() {
  const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
  const { data: drivers, loading, error } = useFetch<Driver[]>(baseURL + "/(api)/driver/");

  const { userLongitude, userLatitude, destinationLatitude, destinationLongitude } =
    useLocationStore();
  const { selectedDriver, setSelectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // region, the area that is closets to the user within which a driver can be found
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude || !Array.isArray(drivers)) {
        return;
      }
      const newMarkers = generateMarkersFromData({ data: drivers, userLatitude, userLongitude });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  // set drivers
  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => setDrivers(drivers as MarkerData[]));
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="w-full flex items-center justify-center h-full">
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    console.error("Error fetching drivers:", error);
    return (
      <View className="w-full flex items-center justify-between">
        <Text>Error loading drivers: {error || "Unknown error"}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 rounded-2xl h-[300px]">
      <MapView
        provider={PROVIDER_DEFAULT}
        userInterfaceStyle="dark"
        style={styles.map}
        tintColor="#212121"
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}>
        {markers.map((marker, index) => (
          <Marker
            key={marker.id + index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
          />
        ))}
        {destinationLatitude && destinationLongitude && (
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.checkmark}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loaderContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
