#pragma once
#include <string>
#include <chrono>

struct Trade{
    int trade_id;
    int buy_order_id;
    int sell_order_id;
    double price;
    int quantity;
    std::chrono::system_clock::time_point timestamp;
};