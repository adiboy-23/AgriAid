import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { 
  TrendingUp, 
  Users, 
  Leaf, 
  Heart,
  Camera,
  MapPin,
  Briefcase,
  Award
} from "lucide-react-native";
import { useAppStore } from "@/store/app-store";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { metrics } = useAppStore();

  const quickActions = [
    {
      title: "Scan Crop",
      subtitle: "AI Health Check",
      icon: Camera,
      color: "#22C55E",
      route: "/scanner",
    },
    {
      title: "Food Hub",
      subtitle: "Share Surplus",
      icon: MapPin,
      color: "#3B82F6",
      route: "/food-hub",
    },
    {
      title: "Find Jobs",
      subtitle: "Earn Income",
      icon: Briefcase,
      color: "#F59E0B",
      route: "/jobs",
    },
    {
      title: "My Impact",
      subtitle: "Track Tokens",
      icon: Award,
      color: "#8B5CF6",
      route: "/impact",
    },
  ];

  const impactCards = [
    {
      title: "Meals Saved",
      value: metrics.mealsSaved.toLocaleString(),
      icon: Heart,
      color: "#EF4444",
      bgColor: "#FEF2F2",
    },
    {
      title: "Jobs Created",
      value: metrics.jobsCreated.toLocaleString(),
      icon: Users,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
    },
    {
      title: "Crops Analyzed",
      value: metrics.cropsAnalyzed.toLocaleString(),
      icon: Leaf,
      color: "#22C55E",
      bgColor: "#F0FDF4",
    },
    {
      title: "Income Generated",
      value: `$${metrics.incomeGenerated.toLocaleString()}`,
      icon: TrendingUp,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#22C55E", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>AgriAid AI</Text>
          <Text style={styles.headerSubtitle}>
            Ending hunger, creating opportunities
          </Text>
        </LinearGradient>

        {/* Impact Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Global Impact</Text>
          <View style={styles.metricsGrid}>
            {impactCards.map((card, index) => (
              <View key={index} style={[styles.metricCard, { backgroundColor: card.bgColor }]}>
                <card.icon color={card.color} size={24} />
                <Text style={styles.metricValue}>{card.value}</Text>
                <Text style={styles.metricTitle}>{card.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <action.icon color="#FFFFFF" size={24} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: "#22C55E" }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Crop scan completed</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: "#3B82F6" }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Food donation matched</Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: "#F59E0B" }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Job completed - $12 earned</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </View>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  activityTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});