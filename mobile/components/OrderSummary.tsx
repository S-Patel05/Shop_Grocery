import { View, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <View className="px-5 mt-6">
      <View >
        <LinearGradient 
        colors={['#ff9a9e', '#c2e9fb']}
        className="rounded-3xl p-6"
        >
          <Text className="text-text-primary text-xl font-bold mb-4">Summary</Text>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-text-secondary text-base">Subtotal</Text>
                <Text className="text-text-primary font-semibold text-base">
                  ₹{subtotal.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-text-secondary text-base">Shipping</Text>
                <Text className="text-text-primary font-semibold text-base">
                  ₹{shipping.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-text-secondary text-base">Tax</Text>
                <Text className="text-text-primary font-semibold text-base">₹{tax.toFixed(2)}</Text>
              </View>

              {/* Divider */}
              <View className="border-t border-background-lighter pt-3 mt-1" />

              {/* Total */}
              <View className="flex-row justify-between items-center">
                <Text className="text-text-primary font-bold text-lg">Total</Text>
                  <Text className=" font-bold text-2xl">₹{total.toFixed(2)}</Text>
              </View>
            </View>
        </LinearGradient>
      </View>
    </View>
  );
}