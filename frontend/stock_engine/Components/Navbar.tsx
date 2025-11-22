"use client";

import { useState, useEffect } from "react";
import { logout, getCurrentUser } from "@/API/api";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            📈 Stock Exchange
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome,</p>
              <p className="font-semibold text-gray-800 dark:text-white">{user.username}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
              <p className="font-bold text-green-600 dark:text-green-400">
                ${user.balance?.toFixed(2) || "0.00"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}