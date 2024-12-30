import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { View } from "react-native";

type PulsingMarkerProps = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

export default function PulsingMarker({ coordinate }: PulsingMarkerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create the pulsing animation using native driver
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 3, // Circle grows to 3x size
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, // Circle shrinks back to normal size
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim]);

  return (
    <Marker coordinate={coordinate}>
      <View style={styles.markerContainer}>
        {/* Animated pulsing circle */}
        <Animated.View
          style={[
            styles.pulsingCircle,
            {
              transform: [{ scale: pulseAnim }], // Use scale for pulsing effect
              opacity: pulseAnim.interpolate({
                inputRange: [1, 3],
                outputRange: [0.5, 0], // Fade out as it grows
              }),
            },
          ]}
        />

        {/* Pointer connecting marker to circle */}
        <View style={styles.pointer} />

        {/* Static center marker */}
        <View style={styles.markerInner} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100, // Increased to accommodate pointer
  },
  pulsingCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(59, 130, 246, 0.5)", // Translucent blue
    top: 30, // Position below the pointer
  },
  pointer: {
    width: 2,
    height: 30,
    backgroundColor: "#3B82F6", // Match the marker color
    position: "absolute",
    bottom: 0,
  },
  markerInner: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#3B82F6", // Solid blue
    borderWidth: 2,
    borderColor: "#FFFFFF", // White border
    position: "absolute",
    bottom: 15, // Position above the pointer
  },
});
