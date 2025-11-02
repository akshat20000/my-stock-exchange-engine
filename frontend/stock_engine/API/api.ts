import axios from "axios";

const API_URL = "http://localhost:8080";


interface OrderPayload {
  user_id: string;
  symbol: string;
  type: "BUY" | "SELL";
  price: number;
  quantity: number;
}

/**
 * Sends a new order to the C++ backend.
 * Axios automatically sets 'Content-Type: application/json'
 */
export const placeOrder = async (order: OrderPayload) => {
  try {
    const response = await axios.post(`${API_URL}/order`, order);
    console.log("Order placed:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

/**
 * Fetches the list of recent trades from the C++ backend.
 */
export const getTrades = async () => {
  try {
    const response = await axios.get(`${API_URL}/trades`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }
};


