#include "matching_engine.hpp"
#include <iostream>
#include <sstream>
#include <atomic> // For thread-safe counters

// Thread-safe counter for unique trade IDs
static std::atomic<int> g_trade_id(1);

// Constructor to initialize dependencies
MatchingEngine::MatchingEngine(Database& db, RedisClient& redis)
    : db_(db), redis_(redis) {
    // Member variables are initialized via the list
}

void MatchingEngine::processOrder(Order order) {
    // 1. Persist the incoming order to the database
    db_.insertOrder(order.id, order.user_id, order.symbol, 
                   (order.type == OrderType::BUY ? "BUY" : "SELL"), 
                   order.price, order.quantity);

    // 2. Add to order book & try to match
    orderBook.addOrder(order);
    auto [buy, sell] = orderBook.matchOrders(); // Assuming this returns matched orders

    // 3. If a match, execute the trade
    if (buy.id != 0 && sell.id != 0) {
        // Simple price logic: use the price of the resting order (sell)
        double tradePrice = sell.price; 
        int tradeQty = std::min(buy.quantity, sell.quantity);
        
        // Call the helper function to execute
        executeTrade(buy, sell, tradePrice, tradeQty);
    }
}

void MatchingEngine::executeTrade(Order buyOrder, Order sellOrder, double price, int qty) {
    int trade_id = g_trade_id++; // Get a new unique ID

    // 1. Persist the trade to the database
    db_.insertTrade(trade_id, buyOrder.id, sellOrder.id, price, qty);

    // 2. Publish the trade to Redis (using the member 'redis_')
    std::stringstream msg;
    msg << R"({"trade_id":")" << trade_id << R"(","price":")" << price
        << R"(","qty":")" << qty << R"("})";
    redis_.publish("trade_channel", msg.str());

    std::cout << "Trade Executed: " << trade_id << " @ " << price << std::endl;
}

// NOTE: The getTrades() function has been removed from this class.
// The Database class (db_) is now responsible for fetching trades.