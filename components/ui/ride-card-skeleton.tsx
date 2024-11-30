import { useWindowDimensions, View } from "react-native";

export default function RideCardSkeleton() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.9; // 90% of the screen width
  return (
    <View
      className={`w-${cardWidth} border border-general-100 flex h-[300px] flex-row items-center justify-center bg-[#f1f1f1] rounded-lg shadow-lg shadow-neutral-300 mb-3 animate-pulse`}>
      <View className="flex flex-col items-center justify-center p-3">
        {/* Image Placeholder */}
        <View className="flex flex-row items-center justify-between">
          <View className="w-20 h-20 bg-gray-300 rounded-lg" />

          {/* Ride Details Placeholder */}
          <View className="flex flex-col gap-y-5 mx- flex-1">
            <View className="flex flex-row gap-x-2">
              <View className="w-5 h-5 bg-gray-300 rounded-full" />
              <View className="h-4 bg-gray-300 rounded-md w-3/4" />
            </View>
            <View className="flex flex-row gap-x-2">
              <View className="w-5 h-5 bg-gray-300 rounded-full" />
              <View className="h-4 bg-gray-300 rounded-md w-3/4" />
            </View>
          </View>
        </View>

        {/* Details Placeholder */}
        <View className="mt-5 rounded-lg flex flex-col w-full bg-general-500 p-3 items-start justify-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} className="flex flex-row items-center justify-between w-full mb-5">
              <View className="h-4 bg-gray-300 rounded-md w-1/4" />
              <View className="h-4 bg-gray-300 rounded-md w-1/3" />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
