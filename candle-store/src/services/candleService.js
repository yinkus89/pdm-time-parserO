// src/services/candleService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/candles';

// Fetch all candles
export const getCandles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Fetch a single candle
export const getCandleById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a new candle
export const createCandle = async (candleData) => {
  const response = await axios.post(API_URL, candleData);
  return response.data;
};

// Update an existing candle
export const updateCandle = async (id, candleData) => {
  const response = await axios.put(`${API_URL}/${id}`, candleData);
  return response.data;
};

// Delete a candle
export const deleteCandle = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
