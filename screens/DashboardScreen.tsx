import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, collection, getDocs } from "../utils/firebase";

const DashboardScreen: React.FC = () => {
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "scanHistory"));
        const history = querySnapshot.docs.map((doc) => doc.data());
          // Sort history by scannedAt (latest at top)
          const sortedHistory = history.sort((a, b) => {
            const dateA = new Date(a.scannedAt); // Ensure scannedAt is parsed into a Date object
            const dateB = new Date(b.scannedAt);
            return dateB.getTime() - dateA.getTime(); // Sort in descending order (latest first)
          });
  
        setScanHistory(sortedHistory);
      } catch (error) {
        console.error("Error fetching scan history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      <FlatList
        data={scanHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Product Name: {item.productName}</Text>
            <Text>Scanned At: {item.scannedAt}</Text>
            <Text>Status: {item.isGenuine ? "✅ Genuine" : "❌ Fake"}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: { padding: 10, marginBottom: 10, backgroundColor: "#f5f5f5", borderRadius: 5 },
});

export default DashboardScreen;
