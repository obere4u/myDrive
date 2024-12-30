import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const locationHqApiKey = process.env.EXPO_PUBLIC_GEOLOCATION_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

// delay to avoid rate limiting and retry after rate limit
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithValidation = async (url: string, retries = 3): Promise<any> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      // Check if response contains a valid route
      if (!data.routes || data.routes.length === 0) {
        throw new Error(`No valid routes found: ${JSON.stringify(data)}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === retries) {
          throw new Error(`Failed after ${retries} retries: ${error.message}`);
        }
      } else {
        console.warn(`Attempt ${attempt} failed with an unexpected error: ${error}`);
      }
      await delay(attempt * 1000); // Exponential backoff
    }
  }
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) {
    console.error("Invalid user or destination coordinates");
    return;
  }

  const origin = `${userLongitude},${userLatitude}`;
  const destination = `${destinationLongitude},${destinationLatitude}`;

  try {
    const timesPromises = markers.map(async (marker) => {
      const markerOrigin = `${marker.longitude},${marker.latitude}`;

      // Fetch time to user
      const userUrl = `https://us1.locationiq.com/v1/directions/driving/${markerOrigin};${origin}?key=${locationHqApiKey}&overview=false`;
      const dataToUser = await fetchWithValidation(userUrl);
      const timeToUser = dataToUser.routes[0]?.legs[0]?.duration || 0;

      console.log(`Time to user for marker ${marker.id}: ${timeToUser} seconds`);

      // Fetch time to destination
      const destinationUrl = `https://us1.locationiq.com/v1/directions/driving/${origin};${destination}?key=${locationHqApiKey}&overview=false`;
      const dataToDestination = await fetchWithValidation(destinationUrl);
      const timeToDestination = dataToDestination.routes[0]?.legs[0]?.duration || 0;

      console.log(`Time to destination for marker ${marker.id}: ${timeToDestination} seconds`);

      // Calculate total time and price
      const totalTime = (timeToUser + timeToDestination) / 60; // Convert to minutes
      const price = (totalTime * 0.5).toFixed(2); // Calculate price

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
  }
};
