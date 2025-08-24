import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppMetrics {
  mealsSaved: number;
  jobsCreated: number;
  cropsAnalyzed: number;
  incomeGenerated: number;
}

interface AppStore {
  metrics: AppMetrics;
  userTokens: number;
  redeemedRewards: string[];
  incrementMealsSaved: () => void;
  incrementJobsCreated: () => void;
  incrementCropsAnalyzed: () => void;
  incrementIncomeGenerated: (amount: number) => void;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  redeemReward: (rewardId: string, cost: number) => boolean;
  isRewardRedeemed: (rewardId: string) => boolean;
  loadMetrics: () => Promise<void>;
  saveMetrics: () => Promise<void>;
}

const initialMetrics: AppMetrics = {
  mealsSaved: 1247,
  jobsCreated: 89,
  cropsAnalyzed: 156,
  incomeGenerated: 2340,
};

export const useAppStore = create<AppStore>((set, get) => ({
  metrics: initialMetrics,
  userTokens: 1250,
  redeemedRewards: [],

  incrementMealsSaved: () => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        mealsSaved: state.metrics.mealsSaved + Math.floor(Math.random() * 10) + 5,
      },
    }));
    get().saveMetrics();
  },

  incrementJobsCreated: () => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        jobsCreated: state.metrics.jobsCreated + 1,
      },
    }));
    get().saveMetrics();
  },

  incrementCropsAnalyzed: () => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        cropsAnalyzed: state.metrics.cropsAnalyzed + 1,
      },
      userTokens: state.userTokens + 50,
    }));
    get().saveMetrics();
  },

  addTokens: (amount: number) => {
    set((state) => ({
      userTokens: state.userTokens + amount,
    }));
    get().saveMetrics();
  },

  spendTokens: (amount: number) => {
    const { userTokens } = get();
    if (userTokens >= amount) {
      set((state) => ({
        userTokens: state.userTokens - amount,
      }));
      get().saveMetrics();
      return true;
    }
    return false;
  },

  redeemReward: (rewardId: string, cost: number) => {
    const { userTokens, redeemedRewards } = get();
    if (userTokens >= cost && !redeemedRewards.includes(rewardId)) {
      set((state) => ({
        userTokens: state.userTokens - cost,
        redeemedRewards: [...state.redeemedRewards, rewardId],
      }));
      get().saveMetrics();
      return true;
    }
    return false;
  },

  isRewardRedeemed: (rewardId: string) => {
    return get().redeemedRewards.includes(rewardId);
  },

  incrementIncomeGenerated: (amount: number) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        incomeGenerated: state.metrics.incomeGenerated + amount,
      },
    }));
    get().saveMetrics();
  },

  loadMetrics: async () => {
    try {
      const stored = await AsyncStorage.getItem("app-store");
      if (stored) {
        const data = JSON.parse(stored);
        set({ 
          metrics: data.metrics || initialMetrics,
          userTokens: data.userTokens || 1250,
          redeemedRewards: data.redeemedRewards || [],
        });
      }
    } catch (error) {
      console.log("Error loading store:", error);
    }
  },

  saveMetrics: async () => {
    try {
      const { metrics, userTokens, redeemedRewards } = get();
      await AsyncStorage.setItem("app-store", JSON.stringify({
        metrics,
        userTokens,
        redeemedRewards,
      }));
    } catch (error) {
      console.log("Error saving store:", error);
    }
  },
}));