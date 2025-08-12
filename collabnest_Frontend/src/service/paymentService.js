// paymentService.js
// Handles API calls to backend PaymentController

import axios from 'axios';
import { getToken } from './tokenService';

// Use full backend URL for local dev
const API_BASE = 'http://localhost:8080/api/payments';

/**
 * Create a Razorpay order
 * @param {Object} orderData - { amount, eventId, userId }
 * @returns {Promise<Object>} - { orderId, amount, currency, key }
 */
function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token.token}` } : {};
}

export async function createOrder(orderData) {
  const response = await axios.post(`${API_BASE}/create-order`, orderData, {
    headers: getAuthHeader(),
  });
  return response.data;
}

/**
 * Verify a payment
 * @param {Object} verifyData - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Promise<Object>} - { status: 'success' | 'failure' }
 */
export async function verifyPayment(verifyData) {
  const response = await axios.post(`${API_BASE}/verify`, verifyData, {
    headers: getAuthHeader(),
  });
  return response.data;
}
