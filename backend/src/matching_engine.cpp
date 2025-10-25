#include "matching_engine.hpp"
#include <iostream>

void MatchingEngine::processOrder(const Order& order) {
    orderBook.addOrder(order);
    auto [buy, sell] = orderBook.matchOrders();

    if (buy.id != 0 && sell.id != 0) {
        Trade t;
        t.trade_id = trades.size() + 1;
        t.buy_order_id = buy.id;
        t.sell_order_id = sell.id;
        t.price = sell.price;
        t.quantity = std::min(buy.quantity, sell.quantity);
        t.timestamp = std::chrono::system_clock::now();

        trades.push_back(t);
        std::cout << "Trade Executed: " << t.trade_id << " @ " << t.price << std::endl;
    }
}

const std::vector<Trade>& MatchingEngine::getTrades() const {
    return trades;
}
