import React from 'react';
import SafeScreen from '@/components/SafeScreen';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

// Gradient helpers
const gradients = [
  ['#ff9a9e', '#fad0c4'],
  ['#a1c4fd', '#c2e9fb'],
  ['#84fab0', '#8fd3f4'],
  ['#f6d365', '#fda085'],
  ['#d4fc79', '#96e6a1'],
] as const;

const getGradientColors = (index: number): readonly [string, string] => {
  return gradients[index % gradients.length];
};

const MENU_ITEMS = [
  { id: 1, icon: "person-outline", title: "Edit Profile", color: "#0361fc", action: "/profile" },
  { id: 2, icon: "list-outline", title: "Orders", color: "#00b87b", action: "/orders" },
  { id: 3, icon: "location-outline", title: "Addresses", color: "#de8d02", action: "/addresses" },
  { id: 4, icon: "heart-outline", title: "Wishlist", color: "#EF4444", action: "/wishlist" },
] as const;

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if (action === "/profile") return;
    router.push(action);
  };

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER - with gradient background */}
        <View className="px-6 pb-8">
          <LinearGradient
            colors={getGradientColors(0)} // first gradient for header
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 shadow-lg"
          >
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200}
                />
                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border-2 border-surface">
                  <Ionicons name="checkmark" size={16} color="#121212" />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-text-primary text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-text-primary text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* MENU ITEMS - each with its own gradient */}
        <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-md"
              style={{ width: "48%" }}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.action)}
            >
              <LinearGradient
                colors={getGradientColors(index + 1)} // start from second gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6 items-center justify-center"
              >
                <View
                  className="rounded-full w-16 h-16 items-center justify-center mb-4"
                  style={{ backgroundColor: `${item.color}30` }} // keep your accent with opacity
                >
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <Text className="text-text-primary font-bold text-base">{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* PRIVACY AND SECURITY - gradient bg */}
        <View className="mb-3 mx-6 overflow-hidden rounded-2xl shadow-md">
          <LinearGradient
            colors={getGradientColors(2)} // third gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4"
          >
            <TouchableOpacity
              className="flex-row items-center justify-between py-2"
              activeOpacity={0.7}
              onPress={() => router.push("/privacy-security")}
            >
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark-outline" size={22} />
                <Text className="font-semibold ml-3">Privacy & Security</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* SIGN OUT BUTTON - gradient bg with red accent */}
        <TouchableOpacity
          className="mx-6 mb-3 overflow-hidden rounded-2xl shadow-md"
          activeOpacity={0.8}
          onPress={() => signOut()}
        >
          <LinearGradient
            colors={getGradientColors(3)} // fourth gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-5 flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={22} color="#ffffff" />
            <Text className="text-white font-bold text-base ml-2">Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">Version 1.0.0</Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;