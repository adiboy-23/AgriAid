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
  Award,
  Coins,
  TrendingUp,
  Gift,
  Shield,
  ExternalLink,
  Copy,
  CheckCircle,
  Heart,
  Users,
  Leaf,
} from "lucide-react-native";
import { useAppStore } from "@/store/app-store";

const { width } = Dimensions.get("window");

interface Transaction {
  id: string;
  type: "donation" | "reward" | "redemption";
  amount: number;
  description: string;
  timestamp: string;
  blockchainHash: string;
  status: "confirmed" | "pending";
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: "recognition" | "perks" | "charity";
  available: boolean;
}

export default function ImpactScreen() {
  const [activeTab, setActiveTab] = useState<"tokens" | "blockchain" | "rewards">("tokens");
  const { metrics, userTokens, redeemReward, isRewardRedeemed } = useAppStore();

  const userLevel = "Impact Champion";
  const nextLevelTokens = 1500;

  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "reward",
      amount: 50,
      description: "Crop scan completed - AI analysis",
      timestamp: "2 hours ago",
      blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
      status: "confirmed",
    },
    {
      id: "2",
      type: "reward",
      amount: 100,
      description: "Food donation facilitated - 20 meals",
      timestamp: "1 day ago",
      blockchainHash: "0x9876543210fedcba0987654321abcdef",
      status: "confirmed",
    },
    {
      id: "3",
      type: "donation",
      amount: 200,
      description: "Donated to Hope Food Bank",
      timestamp: "3 days ago",
      blockchainHash: "0xabcdef1234567890fedcba0987654321",
      status: "confirmed",
    },
    {
      id: "4",
      type: "redemption",
      amount: -75,
      description: "Redeemed: Coffee shop discount",
      timestamp: "1 week ago",
      blockchainHash: "0x567890abcdef1234567890abcdef1234",
      status: "confirmed",
    },
  ];

  const mockRewards: Reward[] = [
    {
      id: "1",
      title: "Coffee Shop Discount",
      description: "20% off at participating local coffee shops",
      cost: 75,
      category: "perks",
      available: true,
    },
    {
      id: "2",
      title: "Impact Certificate",
      description: "Digital certificate recognizing your contribution",
      cost: 100,
      category: "recognition",
      available: true,
    },
    {
      id: "3",
      title: "Plant a Tree",
      description: "Fund tree planting in your local community",
      cost: 150,
      category: "charity",
      available: true,
    },
    {
      id: "4",
      title: "Premium Features",
      description: "Unlock advanced AI crop analysis features",
      cost: 200,
      category: "perks",
      available: true,
    },
    {
      id: "5",
      title: "Community Hero Badge",
      description: "Special recognition badge for your profile",
      cost: 300,
      category: "recognition",
      available: userTokens >= 300,
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "donation":
        return Heart;
      case "reward":
        return Award;
      case "redemption":
        return Gift;
      default:
        return Coins;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "donation":
        return "#EF4444";
      case "reward":
        return "#22C55E";
      case "redemption":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "recognition":
        return "#8B5CF6";
      case "perks":
        return "#3B82F6";
      case "charity":
        return "#22C55E";
      default:
        return "#6B7280";
    }
  };

  const copyToClipboard = (text: string) => {
    Alert.alert("Copied!", "Blockchain hash copied to clipboard");
  };

  const handleRedeemReward = (reward: Reward) => {
    if (isRewardRedeemed(reward.id)) {
      Alert.alert("Already Redeemed", "You have already redeemed this reward.");
      return;
    }

    if (userTokens < reward.cost) {
      Alert.alert("Insufficient Tokens", "You don't have enough tokens for this reward.");
      return;
    }

    Alert.alert(
      "Redeem Reward",
      `Redeem "${reward.title}" for ${reward.cost} tokens?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: () => {
            const success = redeemReward(reward.id, reward.cost);
            if (success) {
              Alert.alert("Success!", "Reward redeemed successfully! Check your email for details.");
            } else {
              Alert.alert("Error", "Failed to redeem reward. Please try again.");
            }
          },
        },
      ]
    );
  };

  const TokensTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Token Balance */}
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tokenCard}
      >
        <View style={styles.tokenHeader}>
          <Coins color="#FFFFFF" size={32} />
          <Text style={styles.tokenBalance}>{userTokens.toLocaleString()}</Text>
          <Text style={styles.tokenLabel}>Impact Tokens</Text>
        </View>
        
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>{userLevel}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(userTokens / nextLevelTokens) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {nextLevelTokens - userTokens} tokens to next level
          </Text>
        </View>
      </LinearGradient>

      {/* Impact Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.impactGrid}>
          <View style={styles.impactItem}>
            <Heart color="#EF4444" size={24} />
            <Text style={styles.impactValue}>{metrics.mealsSaved}</Text>
            <Text style={styles.impactLabel}>Meals Saved</Text>
          </View>
          <View style={styles.impactItem}>
            <Users color="#3B82F6" size={24} />
            <Text style={styles.impactValue}>{metrics.jobsCreated}</Text>
            <Text style={styles.impactLabel}>Jobs Created</Text>
          </View>
          <View style={styles.impactItem}>
            <Leaf color="#22C55E" size={24} />
            <Text style={styles.impactValue}>{metrics.cropsAnalyzed}</Text>
            <Text style={styles.impactLabel}>Crops Analyzed</Text>
          </View>
        </View>
      </View>

      {/* How to Earn */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Earn Tokens</Text>
        <View style={styles.earnCard}>
          <View style={styles.earnItem}>
            <View style={styles.earnIcon}>
              <Leaf color="#22C55E" size={20} />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Scan Crops</Text>
              <Text style={styles.earnDescription}>50 tokens per scan</Text>
            </View>
          </View>
          
          <View style={styles.earnItem}>
            <View style={styles.earnIcon}>
              <Heart color="#EF4444" size={20} />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Share Food</Text>
              <Text style={styles.earnDescription}>100 tokens per donation</Text>
            </View>
          </View>
          
          <View style={styles.earnItem}>
            <View style={styles.earnIcon}>
              <Users color="#3B82F6" size={20} />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Complete Jobs</Text>
              <Text style={styles.earnDescription}>25-200 tokens per job</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const BlockchainTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blockchain Transparency</Text>
        <Text style={styles.sectionDescription}>
          All transactions are recorded on the blockchain for complete transparency and accountability.
        </Text>
      </View>

      {mockTransactions.map((transaction) => {
        const Icon = getTransactionIcon(transaction.type);
        const color = getTransactionColor(transaction.type);
        
        return (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <View style={styles.transactionInfo}>
                <View style={[styles.transactionIcon, { backgroundColor: color + "20" }]}>
                  <Icon color={color} size={20} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionTime}>{transaction.timestamp}</Text>
                </View>
              </View>
              
              <View style={styles.transactionAmount}>
                <Text style={[styles.amountText, { color }]}>
                  {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                </Text>
                <View style={styles.statusContainer}>
                  <CheckCircle color="#22C55E" size={12} />
                  <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.blockchainInfo}>
              <View style={styles.hashContainer}>
                <Shield color="#6B7280" size={16} />
                <Text style={styles.hashText}>
                  {transaction.blockchainHash.substring(0, 20)}...
                </Text>
                <TouchableOpacity onPress={() => copyToClipboard(transaction.blockchainHash)}>
                  <Copy color="#6B7280" size={16} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View on Explorer</Text>
                <ExternalLink color="#3B82F6" size={14} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  const RewardsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        <Text style={styles.sectionDescription}>
          Use your impact tokens to unlock rewards and recognition.
        </Text>
      </View>

      {mockRewards.map((reward) => {
        const isRedeemed = isRewardRedeemed(reward.id);
        const canAfford = userTokens >= reward.cost;
        const isAvailable = reward.available && canAfford && !isRedeemed;
        
        return (
          <View key={reward.id} style={[styles.rewardCard, !isAvailable && styles.rewardCardDisabled]}>
            <View style={styles.rewardHeader}>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
                {isRedeemed && (
                  <View style={styles.redeemedBadge}>
                    <CheckCircle color="#22C55E" size={16} />
                    <Text style={styles.redeemedText}>Redeemed</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.rewardCost}>
                <Coins color="#F59E0B" size={20} />
                <Text style={styles.costText}>{reward.cost}</Text>
              </View>
            </View>
            
            <View style={styles.rewardFooter}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(reward.category) }]}>
                <Text style={styles.categoryText}>
                  {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.redeemButton,
                  !isAvailable && styles.redeemButtonDisabled,
                ]}
                onPress={() => handleRedeemReward(reward)}
                disabled={!isAvailable}
              >
                <Text style={[
                  styles.redeemButtonText,
                  !isAvailable && styles.redeemButtonTextDisabled,
                ]}>
                  {isRedeemed ? "Redeemed" : !reward.available ? "Locked" : !canAfford ? "Need More" : "Redeem"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Impact & Rewards</Text>
        <Text style={styles.headerSubtitle}>
          Track your contributions and earn rewards
        </Text>
      </LinearGradient>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tokens" && styles.activeTab]}
          onPress={() => setActiveTab("tokens")}
        >
          <Coins color={activeTab === "tokens" ? "#FFFFFF" : "#6B7280"} size={20} />
          <Text style={[styles.tabText, activeTab === "tokens" && styles.activeTabText]}>
            Tokens
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "blockchain" && styles.activeTab]}
          onPress={() => setActiveTab("blockchain")}
        >
          <Shield color={activeTab === "blockchain" ? "#FFFFFF" : "#6B7280"} size={20} />
          <Text style={[styles.tabText, activeTab === "blockchain" && styles.activeTabText]}>
            Blockchain
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "rewards" && styles.activeTab]}
          onPress={() => setActiveTab("rewards")}
        >
          <Gift color={activeTab === "rewards" ? "#FFFFFF" : "#6B7280"} size={20} />
          <Text style={[styles.tabText, activeTab === "rewards" && styles.activeTabText]}>
            Rewards
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === "tokens" && <TokensTab />}
        {activeTab === "blockchain" && <BlockchainTab />}
        {activeTab === "rewards" && <RewardsTab />}
      </View>
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
    backgroundColor: "#8B5CF6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tokenCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  tokenHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  tokenBalance: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
  },
  tokenLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  levelContainer: {
    width: "100%",
    alignItems: "center",
  },
  levelText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  impactGrid: {
    flexDirection: "row",
    gap: 12,
  },
  impactItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  impactValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  impactLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  earnCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  earnItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  earnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  earnContent: {
    flex: 1,
  },
  earnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  earnDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  transactionInfo: {
    flexDirection: "row",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "500",
  },
  blockchainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  hashContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  hashText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "monospace",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  rewardCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardCardDisabled: {
    opacity: 0.6,
  },
  rewardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  rewardInfo: {
    flex: 1,
    marginRight: 16,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  rewardCost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  costText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F59E0B",
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  redeemButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  redeemButtonTextDisabled: {
    color: "#9CA3AF",
  },
  redeemedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  redeemedText: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "600",
  },
});