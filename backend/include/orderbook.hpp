#pragma once
#include <queue>
#include "order.hpp"
#include <functional>

class OrderBook {
private:
    std::priority_queue<Order, std::vector<Order>, std::function<bool(Order, Order)>> buyOrders;
    std::priority_queue<Order, std::vector<Order>, std::function<bool(Order, Order)>> sellOrders;

public:
    OrderBook();
    void addOrder(const Order& order);
    std::pair<Order, Order> matchOrders();
};
