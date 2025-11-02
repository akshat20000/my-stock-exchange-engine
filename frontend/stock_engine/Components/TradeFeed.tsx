"use client"; 

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { getTrades } from "@/API/api"; 

interface Trade {
  trade_id: string; 
  price: string;    
  qty: string;      
}

interface DbTrade {
  trade_id: number; // From DB (number)
  price: number;    // From DB (number)
  qty: number;      // From DB (number)
}

export default function TradeFeed() {
  const [trades, setTrades] = useState<DbTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- 2. FETCH HISTORICAL DATA ON LOAD ---
    const fetchInitialTrades = async () => {
      try {
        setLoading(true);
        const historicalTrades = await getTrades();
        if (Array.isArray(historicalTrades)) {
          setTrades(historicalTrades); // Set the initial list of trades
        }
      } catch (error) {
        console.error("Failed to fetch initial trades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialTrades();

    // --- 3. SET UP SOCKET.IO FOR REAL-TIME UPDATES ---
    // Connect to your Node.js relay server
    const socket = io("http://localhost:4000");

    // Listen for the "NewTrade" event
    socket.on("NewTrade", (newTradeMsg: Trade) => {
      console.log("New trade received via socket:", newTradeMsg);
      
      // Convert the string-based socket message to our DbTrade format
      const newTrade: DbTrade = {
        trade_id: parseInt(newTradeMsg.trade_id),
        price: parseFloat(newTradeMsg.price),
        qty: parseInt(newTradeMsg.qty)
      };

      // Add the new trade to the *top* of the list
      setTrades((prevTrades) => [newTrade, ...prevTrades]);
    });

    // Cleanup function to disconnect when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []); // The empty array [] means this effect runs only once

  // 5. Render the list of trades
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Recent Trades</h2>
      <div className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
        {/* Header Row */}
        <div className="flex justify-between border-b pb-2 mb-2 font-bold dark:text-zinc-300">
          <span>Trade ID</span>
          <span>Price</span>
          <span>Quantity</span>
        </div>
        
        {/* Trades List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <p>Loading trades...</p>
          ) : trades.length === 0 ? (
            <p>Waiting for new trades...</p>
          ) : (
            trades.map((trade) => (
              <div key={trade.trade_id} className="flex justify-between p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <span>{trade.trade_id}</span>
                <span>${trade.price.toFixed(2)}</span>
                <span>{trade.qty}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}