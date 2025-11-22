import axios from "axios";

const API_URL = "http://localhost:8080";
const AUTH_URL = "http://localhost:3001/api/auth";

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============ AUTH FUNCTIONS ============

interface RegisterPayload {
  username: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    username: string;
    balance: number;
  };
  message?: string;
}

export const register = async (payload: RegisterPayload) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Registration failed";
  }
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, payload);
    const data = response.data;
    
    // Store token and user info
    if (data.success && data.token) {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    
    return data;
  } catch (error: any) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await axios.post(
        `${AUTH_URL}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get(`${AUTH_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("auth_token");
};

// ============ TRADING FUNCTIONS ============

interface OrderPayload {
  user_id: string;
  symbol: string;
  type: "BUY" | "SELL";
  price: number;
  quantity: number;
}

export const placeOrder = async (order: OrderPayload) => {
  try {
    const response = await api.post("/order", order);
    console.log("Order placed:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const getTrades = async () => {
  try {
    const response = await api.get("/trades");
    return response.data;
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }
};