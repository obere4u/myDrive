import { DriverStore, LocationStore, MarkerData } from "@/types/type";
import { create } from "zustand";

interface SetUserLocationPropsType {
  latitude: number;
  longitude: number;
  address: string;
}

interface SetDestinationLocationPropsType extends SetUserLocationPropsType {}

export const useLocationStore = create<LocationStore>((set) => ({
  userAddress: null,
  userLongitude: null,
  userLatitude: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,

  setUserLocation: ({ latitude, longitude, address }: SetUserLocationPropsType) => {
    set({
      userLongitude: longitude,
      userLatitude: latitude,
      userAddress: address,
    });
  },

  setDestinationLocation: ({ latitude, longitude, address }: SetDestinationLocationPropsType) => {
    set({
      destinationLongitude: longitude,
      destinationLatitude: latitude,
      destinationAddress: address,
    });
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,
  setSelectedDriver: (driverId: number) => set(() => ({ selectedDriver: driverId })),
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers: drivers })),
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));
