#pragma once
#include "orderbook.hpp"
#include "database.hpp"
#include "redis_client.hpp"
#include <sstream>

class MatchingEngine {
public:
MatchingEngine(Database& db, RedisClient& redis);
void processOrder(Order order);
private:
OrderBook orderBook;
Database& db_;
RedisClient& redis_;
void executeTrade(Order buyOrder, Order sellOrder, double price, int qty);
};