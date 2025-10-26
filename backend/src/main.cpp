#include "matching_engine.hpp"
#include <iostream>
#include "database.hpp"
int main() {
    Database db("stock_exchange", "postgres", "Akshat@2004", "localhost", 5432);
    MatchingEngine engine;
    Order o1(1, "user1", "AAPL", OrderType::BUY, 150, 10);
    Order o2(2, "user2", "AAPL", OrderType::SELL, 149, 10);

    engine.processOrder(o1);
    engine.processOrder(o2);

    db.insertOrder(o1.id, o1.user_id, o1.symbol, "BUY", o1.price, o1.quantity);
    db.insertOrder(o2.id, o2.user_id, o2.symbol, "SELL", o2.price, o2.quantity);

    return 0;
}
