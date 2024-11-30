import React, { useEffect, useState, useRef } from "react";
import {
  PermissionsAndroid,
  Platform,
  Text,
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";

// Define the type for the current position
type Coordinates = {
  latitude: number;
  longitude: number;
};

const apiKey = process.env.EXPO_PUBLIC_GEOLOCATION_API_KEY;

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Coordinates | null>(null);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Map reference
  const mapRef = useRef<MapView | null>(null);

  // Fetch location details from Positionstack API
  const fetchLocationInfo = async ({ latitude, longitude }: Coordinates) => {
    try {
      const url = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Geocoding API Response:", data);

      setLocationInfo(data.display_name || "Location found");
    } catch (error) {
      console.error("Error fetching location info:", error);
      setLocationInfo("Unable to fetch location details");
    }
  };

  // Get current position and fetch location info
  useEffect(() => {
    async function getCurrentLocation() {
      setIsLoading(true);

      try {
        // Check if location services are enabled
        const isLocationServiceEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationServiceEnabled) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services in your device settings to use this feature.",
            [{ text: "OK" }],
          );
          setErrorMsg("Location services are disabled");
          setIsLoading(false);
          return;
        }

        // Request permissions
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Location Permission Denied",
            "This feature requires location access. Please grant permission in your device settings.",
            [{ text: "OK" }],
          );
          setErrorMsg("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        // Get current location
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const { latitude, longitude } = location.coords;

        setCurrentPosition({ latitude, longitude });

        // Fetch location details
        await fetchLocationInfo({ latitude, longitude });
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Location Error",
          "Unable to retrieve your current location. Please try again.",
          [{ text: "OK" }],
        );
      } finally {
        setIsLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  // Render loading or error state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  // Render when no location is available
  if (!currentPosition) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Location services are required to use this feature.</Text>
        <Text style={styles.instructionText}>
          Please ensure: • Location services are enabled • App has location permissions • You are in
          an area with GPS signal
        </Text>
      </View>
    );
  }

  // Function to animate map to current location
  const handleReturnToLocationClick = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.animateToRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef} // Attach mapRef here
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker coordinate={currentPosition} title="You are here" pinColor="#3B82F6" />
      </MapView>

      {locationInfo && (
        <TouchableOpacity onPress={handleReturnToLocationClick} style={styles.locationInfoWrapper}>
          <Text style={styles.locationInfo}>{locationInfo}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  locationInfoWrapper: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  locationInfo: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: 8,
    borderRadius: 5,
    fontSize: 14,
  },
});
