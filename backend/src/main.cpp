#include "matching_engine.hpp"
#include <iostream>

int main() {
    MatchingEngine engine;
    Order o1(1, "user1", "AAPL", OrderType::BUY, 150, 10);
    Order o2(2, "user2", "AAPL", OrderType::SELL, 149, 10);

    engine.processOrder(o1);
    engine.processOrder(o2);

    return 0;
}
