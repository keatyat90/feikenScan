import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';

admin.initializeApp(); // Initialize Firebase Admin SDK
const db = admin.firestore(); // Get Firestore instance

const app = express();
app.use(cors()); // Allow CORS

// Define the GET endpoint for /api/products
app.get('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id; // Get document ID from URL
      const productRef = db.collection('products').doc(productId);
      const productDoc = await productRef.get();
  
      if (!productDoc.exists) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      res.status(200).json({ success: true, ...productDoc.data() });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ success: false, message: 'Error fetching product' });
    }finally {
        return; // Add this line
      }
  });
  

// Export as a cloud function
export const api = functions.https.onRequest(app);
