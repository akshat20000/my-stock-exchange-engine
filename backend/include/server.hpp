#pragma once
#include "matching_engine.hpp"
#include "database.hpp"
#include <crow/middlewares/cors.h>
#include <crow.h>
#include <atomic> // For our order ID

// A thread-safe order ID generator
extern std::atomic<int> g_order_id;

class Server {
private:
    MatchingEngine& engine_;
    Database& db_;
    crow::App<crow::CORSHandler> app_;

    // Private helper methods for routes
    void setup_routes();
    crow::response handle_post_order(const crow::request& req);
    crow::response handle_get_trades();
    crow::response handle_get_orderbook(const std::string& symbol);

public:
    Server(MatchingEngine& engine, Database& db);
    void run();
};