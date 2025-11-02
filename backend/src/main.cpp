#include "server.hpp"
#include "matching_engine.hpp"
#include "database.hpp"
#include "redis_client.hpp"
#include <iostream>

int main() {
    try {
        // 1. Create all core components
        Database db("stock_exchange", "postgres", "Akshat@2004", "localhost", 5432);
        RedisClient redis("127.0.0.1", 6379);
        MatchingEngine engine(db, redis);

        // 2. Create the server and inject the components
        Server server(engine, db);
        
        // 3. Run the server (this will block)
        server.run();

    } catch (const std::exception& e) {
        std::cerr << "❌ CRITICAL ERROR: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}