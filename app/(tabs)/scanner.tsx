import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Camera, 
  FlipHorizontal, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Droplets,
  Sun,
  ImageIcon,
  X
} from "lucide-react-native";
import { useAppStore } from "@/store/app-store";

const { width, height } = Dimensions.get("window");

interface CropAnalysis {
  cropType: string;
  healthScore: number;
  yieldPrediction: string;
  issues: string[];
  recommendations: string[];
  confidence: number;
}

export default function ScannerScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CropAnalysis | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const { incrementCropsAnalyzed } = useAppStore();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#6B7280" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to analyze your crops and provide AI-powered insights.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setShowImageOptions(false);
        analyzeCropFromImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery.");
    }
  };

  const takePicture = async () => {
    if (Platform.OS === 'web') {
      simulateAnalysis();
      return;
    }

    try {
      setIsAnalyzing(true);
      setShowImageOptions(false);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      simulateAnalysis();
    } catch (error) {
      Alert.alert("Error", "Failed to take picture. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCropFromImage = async (imageUri: string) => {
    try {
      setIsAnalyzing(true);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      simulateAnalysis();
    } catch (error) {
      Alert.alert("Error", "Failed to analyze crop. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateAnalysis = () => {
    const mockAnalyses: CropAnalysis[] = [
      {
        cropType: "Tomato",
        healthScore: 85,
        yieldPrediction: "12-15 kg per plant",
        issues: ["Slight nutrient deficiency", "Early blight risk"],
        recommendations: [
          "Apply balanced NPK fertilizer",
          "Increase watering frequency",
          "Consider organic fungicide spray"
        ],
        confidence: 92
      },
      {
        cropType: "Wheat",
        healthScore: 78,
        yieldPrediction: "4.2 tons per hectare",
        issues: ["Rust disease detected", "Uneven growth"],
        recommendations: [
          "Apply rust-resistant fungicide",
          "Improve soil drainage",
          "Consider supplemental irrigation"
        ],
        confidence: 88
      },
      {
        cropType: "Corn",
        healthScore: 92,
        yieldPrediction: "8.5 tons per hectare",
        issues: ["Minor pest activity"],
        recommendations: [
          "Monitor for corn borer",
          "Maintain current care routine",
          "Harvest in 3-4 weeks"
        ],
        confidence: 95
      }
    ];

    const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
    setAnalysis(randomAnalysis);
    incrementCropsAnalyzed();
    setIsAnalyzing(false);
  };

  const resetScanner = () => {
    setAnalysis(null);
    setSelectedImage(null);
    setShowImageOptions(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "#22C55E";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Attention";
  };

  if (analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.resultsContainer}>
          <LinearGradient
            colors={["#22C55E", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.resultsHeader}
          >
            <Text style={styles.resultsTitle}>Crop Analysis Complete</Text>
            <Text style={styles.cropType}>{analysis.cropType}</Text>
            <Text style={styles.confidence}>
              {analysis.confidence}% Confidence
            </Text>
          </LinearGradient>

          <View style={styles.resultsContent}>
            {/* Health Score */}
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <CheckCircle color={getHealthColor(analysis.healthScore)} size={24} />
                <Text style={styles.healthTitle}>Plant Health</Text>
              </View>
              <Text style={[styles.healthScore, { color: getHealthColor(analysis.healthScore) }]}>
                {analysis.healthScore}%
              </Text>
              <Text style={styles.healthStatus}>
                {getHealthStatus(analysis.healthScore)}
              </Text>
            </View>

            {/* Yield Prediction */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <TrendingUp color="#3B82F6" size={20} />
                <Text style={styles.cardTitle}>Yield Prediction</Text>
              </View>
              <Text style={styles.yieldText}>{analysis.yieldPrediction}</Text>
            </View>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <AlertTriangle color="#F59E0B" size={20} />
                  <Text style={styles.cardTitle}>Issues Detected</Text>
                </View>
                {analysis.issues.map((issue, index) => (
                  <Text key={index} style={styles.issueText}>
                    • {issue}
                  </Text>
                ))}
              </View>
            )}

            {/* Recommendations */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Zap color="#22C55E" size={20} />
                <Text style={styles.cardTitle}>Recommendations</Text>
              </View>
              {analysis.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {rec}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={resetScanner}
            >
              <Text style={styles.scanAgainText}>Scan Another Crop</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (selectedImage && !analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.imagePreviewContainer}>
          <View style={styles.imageHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            >
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.imageHeaderText}>Selected Image</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <Text style={styles.analyzingText}>Analyzing crop...</Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.overlay}>
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
                <FlipHorizontal color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.scanFrame} />

            <View style={styles.bottomControls}>
              <Text style={styles.instructionText}>
                Position crop within the frame or select from gallery
              </Text>
              
              <View style={styles.captureContainer}>
                <TouchableOpacity
                  style={styles.galleryButton}
                  onPress={pickImageFromGallery}
                >
                  <ImageIcon color="#FFFFFF" size={24} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
                  onPress={takePicture}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <View style={styles.analyzingContainer}>
                      <Text style={styles.analyzingText}>Analyzing...</Text>
                    </View>
                  ) : (
                    <Camera color="#FFFFFF" size={32} />
                  )}
                </TouchableOpacity>
                
                <View style={styles.galleryButtonPlaceholder} />
              </View>

              <View style={styles.featuresContainer}>
                <View style={styles.feature}>
                  <Droplets color="#FFFFFF" size={16} />
                  <Text style={styles.featureText}>Disease Detection</Text>
                </View>
                <View style={styles.feature}>
                  <Sun color="#FFFFFF" size={16} />
                  <Text style={styles.featureText}>Yield Prediction</Text>
                </View>
                <View style={styles.feature}>
                  <Zap color="#FFFFFF" size={16} />
                  <Text style={styles.featureText}>Care Tips</Text>
                </View>
              </View>
            </View>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 60,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 24,
  },
  scanFrame: {
    flex: 1,
    margin: 40,
    borderWidth: 2,
    borderColor: "#22C55E",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  bottomControls: {
    alignItems: "center",
    paddingBottom: 40,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  captureButton: {
    backgroundColor: "#22C55E",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  captureButtonDisabled: {
    backgroundColor: "#6B7280",
  },
  analyzingContainer: {
    alignItems: "center",
  },
  analyzingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  featuresContainer: {
    flexDirection: "row",
    gap: 24,
  },
  feature: {
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  resultsHeader: {
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  cropType: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  confidence: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  resultsContent: {
    padding: 20,
    gap: 16,
  },
  healthCard: {
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
  healthHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  healthScore: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 4,
  },
  healthStatus: {
    fontSize: 16,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  yieldText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3B82F6",
  },
  issueText: {
    fontSize: 14,
    color: "#F59E0B",
    marginBottom: 4,
    lineHeight: 20,
  },
  recommendationText: {
    fontSize: 14,
    color: "#22C55E",
    marginBottom: 4,
    lineHeight: 20,
  },
  scanAgainButton: {
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  scanAgainText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  imageHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
    marginRight: 16,
  },
  imageHeaderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  imageContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  analyzingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 40,
  },
  galleryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  galleryButtonPlaceholder: {
    width: 60,
    height: 60,
  },
});