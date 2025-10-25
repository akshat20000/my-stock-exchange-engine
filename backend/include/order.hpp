#pragma once
#include <string>
#include <chrono>

enum class OrderType { BUY, SELL };

struct Order {
    int id;
    std::string user_id;
    std::string symbol;
    OrderType type;
    double price;
    int quantity;
    std::chrono::system_clock::time_point timestamp;

    Order(int id_, std::string user, std::string sym, OrderType t, double p, int q)
        : id(id_), user_id(user), symbol(sym), type(t), price(p), quantity(q),
          timestamp(std::chrono::system_clock::now()) {}
};
