import { ErrorState } from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const gradients = [
  ['#ff9a9e', '#fad0c4'],     // soft pink-peach
  ['#a1c4fd', '#c2e9fb'],     // light blue-sky
  ['#84fab0', '#8fd3f4'],     // mint-cyan
  ['#f6d365', '#fda085'],     // warm orange-peach
  ['#d4fc79', '#96e6a1'],     // lime-green
] as const;

const getGradient = (index: number) => {
  return gradients[index % gradients.length];
};
function WishlistScreen() {
  const { wishlist, isLoading, isError, removeFromWishlist, isRemovingFromWishlist } =
    useWishlist();

  const { addToCart, isAddingToCart } = useCart();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert("Remove from wishlist", `Remove ${productName} from wishlist`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",

        onPress: () => removeFromWishlist(productId),
      },
    ]);
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => Alert.alert("Success", `${productName} added to cart!`),
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
        },
      }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </TouchableOpacity>
        <Text className="text-text-secondary text-2xl font-bold">Wishlist</Text>
        <Text className="text-text-secondary text-sm ml-auto">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={80} color="#4CAF50" />
          <Text className="text-text-secoundry font-semibold text-xl mt-4">
            Your wishlist is empty
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Start adding products you love!
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-text-secondary font-bold text-base">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {wishlist.map((item, index) => {
              const gradientColors = getGradient(index); // or fixed: ['#f0f7ff', '#e0eaff']

              return (
                <LinearGradient
                  key={item._id}
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}           // diagonal – change to { x: 0, y: 0 } → { x: 0, y: 1 } for vertical
                  style={{
                    borderRadius: 24,            // rounded-3xl ≈ 24px (adjust to match your design)
                    marginBottom: 12,            // mb-3 ≈ 12
                    overflow: 'hidden',          // clips children to rounded corners
                  }}
                >
                  {/* Inner wrapper – padding + content */}
                  <View className="p-4">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => router.push(`/product/${item._id}`)}
                    >
                      <View className="flex-row">
                        <Image
                          source={item.images[0]}
                          className="rounded-2xl bg-background-lighter"
                          style={{ width: 96, height: 96 }}
                        />

                        <View className="flex-1 ml-4">
                          <Text className="text-text-primary font-bold text-base mb-2" numberOfLines={2}>
                            {item.name}
                          </Text>
                          <Text className="text-primary font-bold text-xl mb-2">
                            ₹{item.price.toFixed(2)}
                          </Text>

                          {item.stock > 0 ? (
                            <View className="flex-row items-center">
                              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                              <Text className="text-green-500 text-sm font-semibold">
                                {item.stock} in stock
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row items-center">
                              <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                              <Text className="text-red-500 text-sm font-semibold">Out of Stock</Text>
                            </View>
                          )}
                        </View>

                        <TouchableOpacity
                          className="self-start bg-red-500/20 p-2 rounded-full"
                          activeOpacity={0.7}
                          onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                          disabled={isRemovingFromWishlist}
                        >
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>

                    {item.stock > 0 && (
                      <View className="mt-4">
                        <TouchableOpacity
                          className="bg-primary/90 rounded-xl py-3 items-center"  // slightly transparent so gradient peeks through
                          activeOpacity={0.8}
                          onPress={() => handleAddToCart(item._id, item.name)}
                          disabled={isAddingToCart}
                        >
                          {isAddingToCart ? (
                            <ActivityIndicator size="small" color="#121212" />
                          ) : (
                            <Text className="text-background font-bold">Add to Cart</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}
export default WishlistScreen;
