import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { Camera, CameraView } from "expo-camera";
import axios from "axios";
import { collection, addDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import moment from "moment";
import { db } from "../utils/firebase";

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

const ScannerScreen: React.FC<Props> = ({ navigation }) => { 
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return; // Prevent multiple scans while processing

    setScanned(true);
    setLoading(true);
    setResult(null);

    try {
      console.log("🔍 Scanning QR Code:", data);

      const response = await axios.get(`https://us-central1-feikenscan.cloudfunctions.net/api/products/${data}`);

      // Ensure response contains the expected data
      if (!response.data || !response.data.success) {
        throw new Error("Invalid API response");
      }

      const now = moment();
      const formattedDate = now.format("YYYY-MM-DD HH:mm:ss");
      const fiveMinutesAgo = now.subtract(5, "minutes").toISOString();

      // Check if the product has been scanned within the last 5 minutes
      const q = query(
        collection(db, "scanHistory"),
        where("productId", "==", data),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastScan = querySnapshot.docs[0].data().scannedAt;
        if (moment(lastScan).isAfter(fiveMinutesAgo)) {
          setResult("⏳ Recently scanned! Check your scan history or try again later.");
          return;
        }
      }

      // Save the scan record
      await addDoc(collection(db, "scanHistory"), {
        productId: data,
        scannedAt: formattedDate,
        productName: response.data.name || "Unknown Product",
        isGenuine: response.data.success,
      });

      setResult(response.data.success ? `✅ Verified: ${response.data.name}` : "❌ Fake Product Detected");
    } catch (error: any) {
      console.error("🚨 API Request Failed:", error);
      
      // Log API response error if available
      if (error.response) {
        console.error("❗ API Error Response:", error.response.data);
      }

      setResult("⚠️ Network error or invalid response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {scanned && (
        <View style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.resultText}>{result}</Text>
              <Button title="Scan Again" onPress={() => setScanned(false)} />
              <Button title="View Scan History" onPress={() => navigation.navigate("Dashboard")} />
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  resultContainer: { justifyContent: "center", alignItems: "center", padding: 20 },
  resultText: { fontSize: 18, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
});

export default ScannerScreen;
