#include "orderbook.hpp"

OrderBook::OrderBook() :
    buyOrders([](Order a, Order b){ return a.price < b.price; }),
    sellOrders([](Order a, Order b){ return a.price > b.price; }) {}

void OrderBook::addOrder(const Order& order) {
    if (order.type == OrderType::BUY) buyOrders.push(order);
    else sellOrders.push(order);
}

std::pair<Order, Order> OrderBook::matchOrders() {
    if (buyOrders.empty() || sellOrders.empty()) return {Order(0,"","",OrderType::BUY,0,0), Order(0,"","",OrderType::SELL,0,0)};

    Order buy = buyOrders.top();
    Order sell = sellOrders.top();

    if (buy.price >= sell.price) {
        buyOrders.pop();
        sellOrders.pop();
        return {buy, sell};
    }
    return {Order(0,"","",OrderType::BUY,0,0), Order(0,"","",OrderType::SELL,0,0)};
}
