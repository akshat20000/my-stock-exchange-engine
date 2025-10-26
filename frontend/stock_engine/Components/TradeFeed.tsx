"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function TradeFeed() {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    socket.on("newTrade", (data) => {
      setTrades((prev) => [data, ...prev]);
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Recent Trades</h2>
      <ul>
        {trades.map((t, i) => (
          <li key={i}>
            Trade #{t.trade_id}: {t.qty} @ ₹{t.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
