"use client"; // This is a client component

import { useState } from "react";
import { placeOrder } from "@/API/api"; 

export default function OrderForm() {
  const [symbol, setSymbol] = useState("AAPL");
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading

    try {
      // Call your API function with the form data
      await placeOrder({
        user_id: "u1", // You can update this later
        symbol: symbol,
        type: type,
        price: parseFloat(price),
        quantity: parseInt(quantity)
      });
      
      alert("Order placed successfully!");
      // Clear the form
      setPrice("");
      setQuantity("");

    } catch (error) {
      alert("Failed to place order. Check console for details.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border dark:border-zinc-700">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Place an Order</h2>
      
      {/* Symbol */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Symbol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="mt-1 p-2 w-full rounded-md border-zinc-300 dark:bg-zinc-700 dark:text-white"
          required
        />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "BUY" | "SELL")}
          className="mt-1 p-2 w-full rounded-md border-zinc-300 dark:bg-zinc-700 dark:text-white"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 p-2 w-full rounded-md border-zinc-300 dark:bg-zinc-700 dark:text-white"
          required
        />
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Quantity</label>
        <input
          type="number"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="mt-1 p-2 w-full rounded-md border-zinc-300 dark:bg-zinc-700 dark:text-white"
          required
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Place Order
      </button>
    </form>
  );
}