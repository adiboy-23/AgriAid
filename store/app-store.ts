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
  incrementMealsSaved: () => void;
  incrementJobsCreated: () => void;
  incrementCropsAnalyzed: () => void;
  incrementIncomeGenerated: (amount: number) => void;
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
    }));
    get().saveMetrics();
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
      const stored = await AsyncStorage.getItem("app-metrics");
      if (stored) {
        const metrics = JSON.parse(stored);
        set({ metrics });
      }
    } catch (error) {
      console.log("Error loading metrics:", error);
    }
  },

  saveMetrics: async () => {
    try {
      const { metrics } = get();
      await AsyncStorage.setItem("app-metrics", JSON.stringify(metrics));
    } catch (error) {
      console.log("Error saving metrics:", error);
    }
  },
}));