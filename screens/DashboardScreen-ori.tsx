import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Animated } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import moment from 'moment';

const DashboardScreen: React.FC = () => {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const scanHistoryRef = collection(db, 'scanHistory');
        const snapshot = await getDocs(scanHistoryRef);
        const scansList = snapshot.docs.map((doc) => doc.data());
        setScans(scansList);
      } catch (error) {
        console.error('Error fetching scan history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan History</Text>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : scans.length === 0 ? (
        <Text style={styles.emptyMessage}>No scan history available.</Text>
      ) : (
        <Animated.FlatList
          data={scans}
          keyExtractor={(item, index) => index.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item, index }) => {
            const scanId = item?.id || 'Unknown ID';
            const scannedAt = moment(item?.scannedAt).format('YYYY-MM-DD HH:mm');

            return (
              <Card mode="outlined" style={styles.card}>
                <Card.Content>
                  <Text style={styles.title}>Product ID: {scanId}</Text>
                  <Text style={styles.subtitle}>Scanned At: {scannedAt}</Text>
                </Card.Content>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
});

export default DashboardScreen;
