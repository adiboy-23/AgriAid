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
  Modal,
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
  Coins,
  Wallet,
  Gift,
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

interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  currency: "ETH" | "BTC" | "USDC" | "MATIC";
  urgency: "low" | "medium" | "high";
  beneficiaries: number;
  timePosted: string;
  walletAddress: string;
  category: "food" | "shelter" | "medical" | "education";
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function FoodHubScreen() {
  const [activeTab, setActiveTab] = useState<"surplus" | "need" | "donations">("surplus");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const { incrementMealsSaved, addTokens } = useAppStore();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    location: "",
    contact: "",
    urgency: "medium" as "low" | "medium" | "high"
  });

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

  const donationCampaigns: DonationCampaign[] = [
    {
      id: "d1",
      title: "Emergency Food Relief Fund",
      description: "Help provide immediate food assistance to families affected by recent natural disasters. Your crypto donation will be used to purchase and distribute food supplies.",
      targetAmount: 5000,
      currentAmount: 3200,
      currency: "ETH",
      urgency: "high",
      beneficiaries: 150,
      timePosted: "2 hours ago",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      category: "food"
    },
    {
      id: "d2",
      title: "Community Kitchen Renovation",
      description: "Support the renovation of our community kitchen to serve more families in need. The facility will provide hot meals and cooking classes.",
      targetAmount: 8000,
      currentAmount: 2100,
      currency: "USDC",
      urgency: "medium",
      beneficiaries: 300,
      timePosted: "1 day ago",
      walletAddress: "0x8ba1f109551bA432bdf5c3c92d8a5004c056f075",
      category: "food"
    },
    {
      id: "d3",
      title: "Mobile Food Truck Initiative",
      description: "Help us launch a mobile food truck to reach underserved areas and provide fresh, nutritious meals to those who can't access our main facility.",
      targetAmount: 12000,
      currentAmount: 4500,
      currency: "MATIC",
      urgency: "medium",
      beneficiaries: 500,
      timePosted: "3 days ago",
      walletAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      category: "food"
    }
  ];

  useEffect(() => {
    getLocation();
    setListings(mockListings);
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

  const filteredListings = listings.filter(
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

  const handleDonate = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const processDonation = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid donation amount.");
      return;
    }

    const amount = parseFloat(donationAmount);
    
    // Simulate blockchain transaction
    Alert.alert(
      "Processing Donation...",
      `Processing ${amount} ${selectedCampaign?.currency} donation...`,
      [],
      { cancelable: false }
    );

    // Simulate transaction delay
    setTimeout(() => {
      // Add tokens to user (reward for donating)
      const tokenReward = Math.floor(amount * 10); // 10 tokens per currency unit
      addTokens(tokenReward);

      // Show success message
      Alert.alert(
        "Donation Successful! 🎉",
        `Thank you for your ${amount} ${selectedCampaign?.currency} donation!\n\nTransaction Hash: 0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}\n\nYou earned ${tokenReward} tokens for your generosity!`,
        [
          {
            text: "View on Blockchain",
            onPress: () => {
              // Here you would typically open a blockchain explorer
              Alert.alert("Blockchain Explorer", "This would open the transaction on a blockchain explorer like Etherscan.");
            }
          },
          { text: "Done", style: "default" }
        ]
      );

      // Reset form
      setDonationAmount("");
      setShowDonationModal(false);
      setSelectedCampaign(null);
    }, 2000);
  };

  const handleSubmitListing = () => {
    // Validate form data
    if (!formData.title || !formData.description || !formData.quantity || !formData.location || !formData.contact) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    // Create new listing
    const newListing: FoodListing = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      quantity: formData.quantity,
      location: formData.location,
      distance: Math.random() * 5,
      timePosted: "Just now",
      type: activeTab as "surplus" | "need",
      urgency: formData.urgency,
      contact: formData.contact,
    };

    // Add to listings
    setListings(prevListings => [newListing, ...prevListings]);
    
    // Reset form and close
    setFormData({
      title: "",
      description: "",
      quantity: "",
      location: "",
      contact: "",
      urgency: "medium"
    });
    setShowAddForm(false);
    
    Alert.alert("Success!", "Your listing has been posted and nearby users will be notified.");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      quantity: "",
      location: "",
      contact: "",
      urgency: "medium"
    });
    setShowAddForm(false);
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
        value={formData.title}
        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
        value={formData.description}
        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Quantity (e.g., 20 meals, 10 loaves)"
        placeholderTextColor="#9CA3AF"
        value={formData.quantity}
        onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Location (e.g., Downtown, 123 Main St)"
        placeholderTextColor="#9CA3AF"
        value={formData.location}
        onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact (e.g., Your name or organization)"
        placeholderTextColor="#9CA3AF"
        value={formData.contact}
        onChangeText={(text) => setFormData(prev => ({ ...prev, contact: text }))}
      />

      <View style={styles.urgencyContainer}>
        <Text style={styles.urgencyLabel}>Urgency Level:</Text>
        <View style={styles.urgencyButtons}>
          {(["low", "medium", "high"] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.urgencyButton,
                formData.urgency === level && styles.urgencyButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, urgency: level }))}
            >
              <Text style={[
                styles.urgencyButtonText,
                formData.urgency === level && styles.urgencyButtonTextActive
              ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.formButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={resetForm}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitListing}
        >
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const DonationModal = () => (
    <Modal
      visible={showDonationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDonationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Make a Crypto Donation</Text>
            <TouchableOpacity
              onPress={() => setShowDonationModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {selectedCampaign && (
            <>
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignTitle}>{selectedCampaign.title}</Text>
                <Text style={styles.campaignDescription}>{selectedCampaign.description}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(selectedCampaign.currentAmount / selectedCampaign.targetAmount) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {selectedCampaign.currentAmount} / {selectedCampaign.targetAmount} {selectedCampaign.currency}
                  </Text>
                </View>
              </View>

              <View style={styles.donationInput}>
                <Text style={styles.inputLabel}>Donation Amount ({selectedCampaign.currency})</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.0"
                  placeholderTextColor="#9CA3AF"
                  value={donationAmount}
                  onChangeText={setDonationAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.walletInfo}>
                <Wallet color="#6B7280" size={20} />
                <Text style={styles.walletText}>
                  Wallet: {selectedCampaign.walletAddress.slice(0, 6)}...{selectedCampaign.walletAddress.slice(-4)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.campaignDonateButton}
                onPress={processDonation}
              >
                <Coins color="#FFFFFF" size={20} />
                <Text style={styles.campaignDonateButtonText}>Donate {donationAmount || "0"} {selectedCampaign.currency}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
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

        <TouchableOpacity
          style={[styles.tab, activeTab === "donations" && styles.activeTab]}
          onPress={() => setActiveTab("donations")}
        >
          <Gift color={activeTab === "donations" ? "#FFFFFF" : "#6B7280"} size={20} />
          <Text style={[styles.tabText, activeTab === "donations" && styles.activeTabText]}>
            Donations
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Add */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder={activeTab === "donations" ? "Search donation campaigns..." : "Search food listings..."}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {activeTab !== "donations" && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {showAddForm ? (
        <ScrollView style={styles.content}>
          <AddListingForm />
        </ScrollView>
      ) : activeTab === "donations" ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {donationCampaigns.map((campaign) => (
            <View key={campaign.id} style={styles.donationCard}>
              <View style={styles.donationHeader}>
                <View style={styles.donationTitleContainer}>
                  <Text style={styles.donationTitle}>{campaign.title}</Text>
                  <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(campaign.urgency) }]}>
                    <Text style={styles.urgencyText}>{getUrgencyText(campaign.urgency)}</Text>
                  </View>
                </View>
                
                <View style={styles.currencyBadge}>
                  <Coins color="#FFFFFF" size={16} />
                  <Text style={styles.currencyText}>{campaign.currency}</Text>
                </View>
              </View>

              <Text style={styles.donationDescription}>{campaign.description}</Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(campaign.currentAmount / campaign.targetAmount) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {campaign.currentAmount} / {campaign.targetAmount} {campaign.currency}
                </Text>
              </View>

              <View style={styles.donationDetails}>
                <View style={styles.detailItem}>
                  <Users color="#3B82F6" size={16} />
                  <Text style={styles.detailText}>{campaign.beneficiaries} people helped</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Clock color="#6B7280" size={16} />
                  <Text style={styles.detailText}>{campaign.timePosted}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.campaignDonateButton}
                onPress={() => handleDonate(campaign)}
              >
                <Gift color="#FFFFFF" size={20} />
                <Text style={styles.campaignDonateButtonText}>Donate Now</Text>
              </TouchableOpacity>
            </View>
          ))}
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
                    {listing.location} • {listing.distance.toFixed(1)}km away
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

      <DonationModal />
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
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 10,
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
    gap: 16,
    marginBottom: 24,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 4,
  },
  addButton: {
    backgroundColor: "#22C55E",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  listingHeader: {
    marginBottom: 16,
  },
  listingTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  listingTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  listingDescription: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 20,
  },
  listingDetails: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  connectButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  connectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  addForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  addFormTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111827",
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  formButtons: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  urgencyContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  urgencyButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 6,
    gap: 4,
  },
  urgencyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  urgencyButtonActive: {
    backgroundColor: "#3B82F6",
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  urgencyButtonTextActive: {
    color: "#FFFFFF",
  },
  donationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  donationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  donationTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
    flex: 1,
  },
  currencyBadge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 70,
    justifyContent: "center",
  },
  currencyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  donationDescription: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "right",
    fontWeight: "500",
  },
  donationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 16,
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  walletText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  campaignDonateButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  campaignDonateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  closeButtonText: {
    fontSize: 28,
    color: "#6B7280",
    fontWeight: "300",
  },
  campaignInfo: {
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 26,
  },
  campaignDescription: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  donationInput: {
    width: "100%",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  amountInput: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    backgroundColor: "#F9FAFB",
  },
});