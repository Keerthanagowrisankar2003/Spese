import axios from 'axios';

const BASE_URL = 'https://652e40d3f9afa8ef4b284572.mockapi.io/sample';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

export default axiosInstance;
