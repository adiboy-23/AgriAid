import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import {
  MapPin,
  Plus,
  Clock,
  Users,
  Package,
  Heart,
  Search,
  Filter,
} from "lucide-react-native";
import { useAppStore } from "@/store/app-store";

const { width } = Dimensions.get("window");

interface FoodListing {
  id: string;
  title: string;
  description: string;
  quantity: string;
  location: string;
  distance: number;
  timePosted: string;
  type: "surplus" | "need";
  urgency: "low" | "medium" | "high";
  contact: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function FoodHubScreen() {
  const [activeTab, setActiveTab] = useState<"surplus" | "need">("surplus");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { incrementMealsSaved } = useAppStore();

  const mockListings: FoodListing[] = [
    {
      id: "1",
      title: "Fresh Vegetables - Restaurant Surplus",
      description: "Mixed vegetables, salads, and fruits from daily prep. All fresh and safe to consume.",
      quantity: "50 meals worth",
      location: "Downtown Restaurant District",
      distance: 0.8,
      timePosted: "15 minutes ago",
      type: "surplus",
      urgency: "high",
      contact: "Green Bistro",
    },
    {
      id: "2",
      title: "Bread and Pastries",
      description: "End-of-day bakery items. Perfect for soup kitchens or food banks.",
      quantity: "30 loaves, 20 pastries",
      location: "Artisan Bakery",
      distance: 1.2,
      timePosted: "1 hour ago",
      type: "surplus",
      urgency: "medium",
      contact: "Daily Bread Bakery",
    },
    {
      id: "3",
      title: "Urgent: Meals for Homeless Shelter",
      description: "Need prepared meals for 40 people tonight. Can pick up or arrange delivery.",
      quantity: "40 meals needed",
      location: "Hope Shelter",
      distance: 2.1,
      timePosted: "30 minutes ago",
      type: "need",
      urgency: "high",
      contact: "Hope Shelter",
    },
    {
      id: "4",
      title: "Grocery Store Surplus",
      description: "Canned goods, dry goods, and packaged items approaching sell-by date.",
      quantity: "100+ items",
      location: "SuperMart",
      distance: 1.5,
      timePosted: "2 hours ago",
      type: "surplus",
      urgency: "low",
      contact: "SuperMart Manager",
    },
  ];

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is needed to show nearby food opportunities.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const filteredListings = mockListings.filter(
    (listing) =>
      listing.type === activeTab &&
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      default:
        return "#22C55E";
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "Urgent";
      case "medium":
        return "Soon";
      default:
        return "Flexible";
    }
  };

  const handleConnect = (listing: FoodListing) => {
    Alert.alert(
      "Connect with " + listing.contact,
      "This will share your contact information and location with the other party.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Connect",
          onPress: () => {
            incrementMealsSaved();
            Alert.alert(
              "Connected!",
              "Your contact information has been shared. They will reach out to coordinate the food transfer."
            );
          },
        },
      ]
    );
  };

  const AddListingForm = () => (
    <View style={styles.addForm}>
      <Text style={styles.addFormTitle}>
        {activeTab === "surplus" ? "Share Food Surplus" : "Request Food Help"}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Title (e.g., Fresh vegetables from restaurant)"
        placeholderTextColor="#9CA3AF"
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Quantity (e.g., 20 meals, 10 loaves)"
        placeholderTextColor="#9CA3AF"
      />
      
      <View style={styles.formButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setShowAddForm(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            setShowAddForm(false);
            Alert.alert("Success!", "Your listing has been posted and nearby users will be notified.");
          }}
        >
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#3B82F6", "#1D4ED8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Food Hub</Text>
        <Text style={styles.headerSubtitle}>
          Connect surplus food with those in need
        </Text>
      </LinearGradient>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "surplus" && styles.activeTab]}
          onPress={() => setActiveTab("surplus")}
        >
          <Package color={activeTab === "surplus" ? "#FFFFFF" : "#6B7280"} size={20} />
          <Text style={[styles.tabText, activeTab === "surplus" && styles.activeTabText]}>
            Food Surplus
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "need" && styles.activeTab]}
          onPress={() => setActiveTab("need")}
        >
          <Heart color={activeTab === "need" ? "#FFFFFF" : "#6B7280"} size={20} />
          <Text style={[styles.tabText, activeTab === "need" && styles.activeTabText]}>
            Food Needed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Add */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search food listings..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Plus color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <ScrollView style={styles.content}>
          <AddListingForm />
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredListings.map((listing) => (
            <View key={listing.id} style={styles.listingCard}>
              <View style={styles.listingHeader}>
                <View style={styles.listingTitleContainer}>
                  <Text style={styles.listingTitle}>{listing.title}</Text>
                  <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(listing.urgency) }]}>
                    <Text style={styles.urgencyText}>{getUrgencyText(listing.urgency)}</Text>
                  </View>
                </View>
                
                <View style={styles.locationContainer}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.locationText}>
                    {listing.location} • {listing.distance}km away
                  </Text>
                </View>
              </View>

              <Text style={styles.listingDescription}>{listing.description}</Text>

              <View style={styles.listingDetails}>
                <View style={styles.detailItem}>
                  <Users color="#3B82F6" size={16} />
                  <Text style={styles.detailText}>{listing.quantity}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Clock color="#6B7280" size={16} />
                  <Text style={styles.detailText}>{listing.timePosted}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnect(listing)}
              >
                <Text style={styles.connectButtonText}>
                  {activeTab === "surplus" ? "Get Food" : "Offer Help"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {filteredListings.length === 0 && (
            <View style={styles.emptyState}>
              <Package color="#9CA3AF" size={48} />
              <Text style={styles.emptyTitle}>No listings found</Text>
              <Text style={styles.emptyText}>
                Be the first to {activeTab === "surplus" ? "share surplus food" : "offer help"} in your area!
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#22C55E",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listingHeader: {
    marginBottom: 12,
  },
  listingTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  listingTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
  },
  listingDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 16,
  },
  listingDetails: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
  },
  connectButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  connectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  addForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addFormTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});