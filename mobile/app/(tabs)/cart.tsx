import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddresses";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import OrderSummary from "@/components/OrderSummary";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import { useRouter } from "expo-router";
import LoadingState from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { LinearGradient } from 'expo-linear-gradient';

//Gradient palette (cycling through items)
const gradients = [
  ['#ff9a9e', '#fad0c4'],     // soft pink-peach
  ['#a1c4fd', '#c2e9fb'],     // light blue-sky
  ['#84fab0', '#8fd3f4'],     // mint-cyan
  ['#f6d365', '#fda085'],     // warm orange-peach
  ['#d4fc79', '#96e6a1'],     // lime-green
];

const getGradientColors = (index: number) => {
  return gradients[index % gradients.length];
};

const CartScreen = () => {
  const api = useApi();
  const {
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { addresses } = useAddresses();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0; // ₹10 shipping fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Remove Item", `Remove ${productName} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(productId),
      },
    ]);
  };

  const router = useRouter();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No Address",
        "Please add a shipping address in your profile before checking out.",
        [
          {
            text: "Go to Address",
            onPress: () => router.push("/(profile)/addresses"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    setAddressModalVisible(true);
  };

  const handleProceedWithOrder = async (selectedAddress: Address) => {
    try {
      setPaymentLoading(true);
      setAddressModalVisible(false);

      await api.post("/orders", {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phoneNumber: selectedAddress.phoneNumber,
        },
        totalPrice: total,
        paymentResult: null, // COD
      });

      Alert.alert(
        "Order Placed 🎉",
        "Your order has been placed successfully. You will pay on delivery.",
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading Cart..." />;
  if (isError) return <ErrorState />;
  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty 🛒"
        description="Add some fresh groceries, snacks or daily essentials — we'll pack it with love!"
        icon="cart-outline"
        iconSize={100}
        ctaLabel="Start Shopping"
        onAction={() => router.push("/(tabs)")} // adjust route as needed
      />
    );
  }


  return (
    <SafeScreen >
      {/* Header */}
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        className="px-6 pt-3 pb-3"
      >
        <Text className="text-white text-4xl font-extrabold tracking-tight">
          Your Cart
        </Text>
        
      </LinearGradient>

      <ScrollView
        className="flex-1 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 280 }}
      >
        {cartItems.map((item, index) => (
          
          <LinearGradient
            key={item._id}
            colors={getGradientColors(index) as [string, string, ...string[]]}
            className="rounded-3xl mb-5 overflow-hidden shadow-2xl"
            style={{
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
            }}
          >
            <View key={item._id} className="flex-row">
              {/* Image + Quantity Badge */}
              <View className="relative">
                <Image
                  source={{ uri: item.product.images[0] }}
                  contentFit="cover"
                  style={{ width: 130, height: 130, borderRadius: 20 }}
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                />
                <View className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-md">
                  <Text className="text-black font-bold text-sm">×{item.quantity}</Text>
                </View>
              </View>

              {/* Details */}
              <View className="flex-1 ml-5 mt-2 justify-between">
                <View>
                  <Text
                    className="text-text-primary font-bold text-xl leading-6"
                    numberOfLines={2}
                  >
                    {item.product.name}
                  </Text>

                  <View className="flex-row items-baseline mt-2">
                    <Text className="text-text-primary font-extrabold text-2xl">
                      ₹{(item.product.price * item.quantity).toFixed(0)}
                    </Text>
                    <Text className="text-white/80 text-base ml-2">
                      ₹{item.product.price.toFixed(0)} each
                    </Text>
                  </View>
                </View>

                {/* Controls */}
                 <View className="flex-row items-center mt-3">
                    <TouchableOpacity
                      className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>

                    <View className="mx-4 min-w-[32px] items-center">
                      <Text className="text-text-primary font-bold text-lg">{item.quantity}</Text>
                    </View>

                    <TouchableOpacity
                      className="bg-primary rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Ionicons name="add" size={18} color="#121212" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="ml-auto bg-white rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.9}
                      onPress={() => handleRemoveItem(item.product._id, item.product.name)}
                      disabled={isRemoving}
                    >
                      <Ionicons name="trash-outline" size={18}  />
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
          </LinearGradient>
        ))}

        <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <LinearGradient
        colors={['#7499d6', '#1e293b']}
        className="absolute bottom-0 left-0 right-0 pt-5 pb-28 px-6 border-t border-gray-800"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={26} color="#4ade80" />
            <Text className="text-white ml-3 font-medium text-lg">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <Text className="text-white font-bold text-2xl">
            ₹{total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <LinearGradient
            colors={['#7c3aed', '#c026d3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-3xl py-5 shadow-2xl"
          >
            <View className="flex-row items-center justify-center">
              {paymentLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <>
                  <Text className="text-white font-bold text-xl mr-3">Checkout</Text>
                  <Ionicons name="arrow-forward" size={26} color="white" />
                </>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithOrder}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  );
};

export default CartScreen;