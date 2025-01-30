import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Button, Text } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import jsQR from 'jsqr';
import ImageResizer from 'react-native-image-resizer';
import { BrowserQRCodeReader } from '@zxing/browser';

import { Image } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Function to handle selecting an image
  
  const selectImageFromGallery = async () => {
    console.log("tekan!")
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      console.log("response:", response)
      if (response.assets && response.assets[0] && response.assets[0].uri) {
        const imageUri = response.assets[0].uri;
        setImageUri(imageUri);
  
        try {
          // Resize image for better QR detection
          const resizedImage = await ImageResizer.createResizedImage(
            imageUri,
            500, // Width
            500, // Height
            'JPEG',
            100
          );
  
          // Use BrowserQRCodeReader to scan the QR code
          const qrCodeReader = new BrowserQRCodeReader();
          const result = await qrCodeReader.decodeFromImageUrl(resizedImage.uri);
  
          if (result) {
            setQrCodeData(result.getText());
            Alert.alert('QR Code Scanned', `Data: ${result.getText()}`);
          } else {
            Alert.alert('No QR Code', 'No valid QR code found in the image.');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to process image for QR scanning.');
          console.error(error);
        }
      }
    });
  };
  

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to Product Authentication App!
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Scan products to verify authenticity.
      </Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Scanner')} // Move camera scanner to another screen
      >
        Start Scanning
      </Button>

      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate('Dashboard')}
      >
        View Dashboard
      </Button>

      <Button
        mode="contained"
        style={styles.button}
        onPress={selectImageFromGallery}
      >
        Scan QR Code from Gallery
      </Button>

      {imageUri && (
        <Text variant="bodyMedium" style={styles.qrText}>
          Image selected: {imageUri}
        </Text>
      )}

      {qrCodeData && (
        <Text variant="bodyMedium" style={styles.qrText}>
          QR Code Data: {qrCodeData}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
  qrText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#6c757d',
  },
});

export default HomeScreen;
