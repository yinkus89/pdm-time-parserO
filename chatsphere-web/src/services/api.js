import axios from 'axios';

const API_URL = 'https://virtserver.swaggerhub.com/YINKAWLB/chatterbox1/1.0.0';

// Helper to get the token from local storage
const getToken = () => localStorage.getItem('token');

// Login User
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

// Register User
export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

// Get Profile
export const getProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Send Message
export const sendMessage = async (to, message) => {
  const response = await axios.post(`${API_URL}/chat/send`, { to, message }, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Upload Status Image
export const uploadStatus = async (formData) => {
  const response = await axios.post(`${API_URL}/status/upload`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
