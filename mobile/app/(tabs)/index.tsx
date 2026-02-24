import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";

import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];

// Gradient palette – use 'as const' to help TypeScript understand fixed-length tuples
const gradients = [
  ['#ff9a9e', '#fad0c4'],     // soft pink-peach
  ['#a1c4fd', '#c2e9fb'],     // light blue-sky
  ['#84fab0', '#8fd3f4'],     // mint-cyan
  ['#f6d365', '#fda085'],     // warm orange-peach
  ['#d4fc79', '#96e6a1'],     // lime-green
] as const;

const getGradientColors = (index: number) => {
  return gradients[index % gradients.length];
};

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: products, isLoading, isError } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-secondry text-3xl font-bold tracking-tight">Shop</Text>
              <Text className="text-text-secondary text-sm mt-1">Browse all products</Text>
            </View>

            <TouchableOpacity className="bg-surface/50 p-3 rounded-full" activeOpacity={0.7}>
              <Ionicons name="options-outline" size={22} color={"#fff"} />
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="bg-surface flex-row items-center px-5 py-2 rounded-2xl">
            <Ionicons color={"#666"} size={22} name="search" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={"#666"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORY FILTER – with gradients */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category, index) => {
              const isSelected = selectedCategory === category.name;
              const gradientColors = getGradientColors(index);

              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  activeOpacity={0.85}
                  className="mr-3 size-20 rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={gradientColors}
                    className="flex-1 items-center justify-center"
                    // Optional: make selected ones pop more (stronger opacity or different direction)
                    {...(isSelected ? { start: { x: 8, y: 8 }, end: { x: 8 , y: 8 } } : {})}
                  >
                    {/* Slight dark overlay when not selected for better readability */}
                    {!isSelected && (
                      <View className="absolute inset-0" />
                    )}

                    {category.icon ? (
                      <Ionicons
                        name={category.icon}
                        size={isSelected ? 36 : 24}
                        color={isSelected ? "#00000" : "#ffffff"}
                      />
                    ) : (
                      <Image
                        source={category.image}
                        className={isSelected? "size-16": "size-9"}
                        resizeMode="contain"
                      />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold">Products</Text>
            <Text className="text-sm">{filteredProducts.length} items</Text>
          </View>

          {/* PRODUCTS GRID */}
          <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;