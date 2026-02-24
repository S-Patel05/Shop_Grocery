import { View, Text, TouchableOpacity } from "react-native";
import Animated, { 
  FadeInDown, 
  ZoomIn, 
  // FadeOutUp if you want exiting later
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  title: string;
  description?: string;
  header?: string;
  ctaLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "cart-outline",
  iconSize = 100,
  title,
  description,
  header,
  ctaLabel = "Start Shopping",
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      {header && (
        <Text className="text-3xl font-bold mb-10">{header}</Text>
      )}

      <Animated.View 
        entering={ZoomIn.duration(600).springify()} // or ZoomInEasyDown, etc.
      >
        <Ionicons name={icon} size={iconSize} color="#4CAF50" />
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.duration(600).delay(200)}
        className="text-text-secondary font-bold text-2xl mt-8 text-center"
      >
        {title}
      </Animated.Text>

      {description && (
        <Animated.Text
          entering={FadeInDown.duration(600).delay(400)}
          className="text-text-secondary text-center mt-3 leading-6 text-base"
        >
          {description}
        </Animated.Text>
      )}

      {onAction && (
        <Animated.View entering={FadeInDown.duration(600).delay(600)}>
          <TouchableOpacity
            onPress={onAction}
            className="mt-8 bg-green-600 px-10 py-4 rounded-full shadow-md active:opacity-90"
          >
            <Text className="text-text-secondary font-semibold text-lg">{ctaLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}