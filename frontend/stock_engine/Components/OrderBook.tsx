"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function OrderBook() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on("orderBookUpdate", (data) => setOrders(data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Live Order Book</h2>
      <ul>
        {orders.map((o, i) => (
          <li key={i}>{o.symbol} - {o.price}</li>
        ))}
      </ul>
    </div>
  );
}
