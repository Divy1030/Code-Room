import axios from 'axios';

const token = localStorage.getItem("token");
console.log("Token:", token); // Log the token to verify

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  }
});

export default axiosInstance;