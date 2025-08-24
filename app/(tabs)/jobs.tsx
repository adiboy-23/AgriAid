import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Truck,
  Package,
  Users,
  CheckCircle,
} from "lucide-react-native";
import { useAppStore } from "@/store/app-store";

const { width } = Dimensions.get("window");

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  distance: number;
  duration: string;
  pay: number;
  rating: number;
  category: "delivery" | "farm" | "sorting" | "other";
  urgency: "low" | "medium" | "high";
  employer: string;
  requirements: string[];
}

export default function JobsScreen() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { incrementJobsCreated, incrementIncomeGenerated } = useAppStore();

  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Food Delivery Driver",
      description: "Deliver surplus food from restaurants to local food banks. Vehicle provided.",
      location: "Downtown Area",
      distance: 1.2,
      duration: "2-3 hours",
      pay: 25,
      rating: 4.8,
      category: "delivery",
      urgency: "high",
      employer: "FoodShare Network",
      requirements: ["Valid driver's license", "Smartphone"],
    },
    {
      id: "2",
      title: "Farm Helper - Harvest Assistant",
      description: "Help with tomato harvest. No experience needed, training provided.",
      location: "Green Valley Farm",
      distance: 8.5,
      duration: "4-6 hours",
      pay: 60,
      rating: 4.9,
      category: "farm",
      urgency: "medium",
      employer: "Green Valley Organics",
      requirements: ["Physical fitness", "Outdoor work comfort"],
    },
    {
      id: "3",
      title: "Food Sorting Volunteer",
      description: "Sort and package donated food items at distribution center.",
      location: "Community Center",
      distance: 2.1,
      duration: "3 hours",
      pay: 18,
      rating: 4.7,
      category: "sorting",
      urgency: "low",
      employer: "Hope Food Bank",
      requirements: ["Attention to detail", "Team player"],
    },
    {
      id: "4",
      title: "Market Setup Assistant",
      description: "Help set up farmer's market stalls and assist vendors with displays.",
      location: "Central Market Square",
      distance: 0.8,
      duration: "2 hours",
      pay: 20,
      rating: 4.6,
      category: "other",
      urgency: "medium",
      employer: "Weekend Farmers Market",
      requirements: ["Early morning availability", "Physical work"],
    },
  ];

  const categories = [
    { id: "all", name: "All Jobs", icon: Briefcase },
    { id: "delivery", name: "Delivery", icon: Truck },
    { id: "farm", name: "Farm Work", icon: Package },
    { id: "sorting", name: "Sorting", icon: Users },
    { id: "other", name: "Other", icon: Star },
  ];

  const filteredJobs = activeCategory === "all" 
    ? mockJobs 
    : mockJobs.filter(job => job.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "delivery":
        return "#3B82F6";
      case "farm":
        return "#22C55E";
      case "sorting":
        return "#F59E0B";
      default:
        return "#8B5CF6";
    }
  };

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

  const handleApplyJob = (job: Job) => {
    Alert.alert(
      "Apply for Job",
      `Apply for "${job.title}" with ${job.employer}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Apply",
          onPress: () => {
            incrementJobsCreated();
            incrementIncomeGenerated(job.pay);
            Alert.alert(
              "Application Sent!",
              `Your application for "${job.title}" has been sent to ${job.employer}. They will contact you within 24 hours.`
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#F59E0B", "#D97706"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Micro Jobs</Text>
        <Text style={styles.headerSubtitle}>
          Earn income while helping your community
        </Text>
      </LinearGradient>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <category.icon
              color={activeCategory === category.id ? "#FFFFFF" : "#6B7280"}
              size={20}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Jobs List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredJobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleContainer}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.jobMeta}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(job.category) }]}>
                    <Text style={styles.categoryBadgeText}>
                      {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
                    </Text>
                  </View>
                  <View style={[styles.urgencyDot, { backgroundColor: getUrgencyColor(job.urgency) }]} />
                </View>
              </View>
              
              <View style={styles.employerContainer}>
                <Text style={styles.employerText}>{job.employer}</Text>
                <View style={styles.ratingContainer}>
                  <Star color="#F59E0B" size={14} fill="#F59E0B" />
                  <Text style={styles.ratingText}>{job.rating}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.jobDescription}>{job.description}</Text>

            <View style={styles.jobDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.detailText}>
                    {job.location} • {job.distance}km
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Clock color="#6B7280" size={16} />
                  <Text style={styles.detailText}>{job.duration}</Text>
                </View>
              </View>
              
              <View style={styles.payContainer}>
                <DollarSign color="#22C55E" size={20} />
                <Text style={styles.payText}>${job.pay}</Text>
                <Text style={styles.payLabel}>total</Text>
              </View>
            </View>

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              {job.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <CheckCircle color="#22C55E" size={14} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleApplyJob(job)}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredJobs.length === 0 && (
          <View style={styles.emptyState}>
            <Briefcase color="#9CA3AF" size={48} />
            <Text style={styles.emptyTitle}>No jobs available</Text>
            <Text style={styles.emptyText}>
              Check back later for new opportunities in this category.
            </Text>
          </View>
        )}
      </ScrollView>
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
  categoriesContainer: {
    marginVertical: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  activeCategoryButton: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobCard: {
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
  jobHeader: {
    marginBottom: 12,
  },
  jobTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  jobTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  jobMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  employerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  employerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  jobDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 16,
  },
  jobDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
  payContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  payText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22C55E",
  },
  payLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  requirementsContainer: {
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: "#374151",
  },
  applyButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
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
});