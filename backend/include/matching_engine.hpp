#pragma once
#include "orderbook.hpp"
#include "trade.hpp"
#include <vector>

class MatchingEngine {
private:
    OrderBook orderBook;
    std::vector<Trade> trades;

public:
    void processOrder(const Order& order);
    const std::vector<Trade>& getTrades() const;
};
