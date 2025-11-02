#include "server.hpp"
#include <iostream>

// Initialize the global order ID
std::atomic<int> g_order_id(1);

Server::Server(MatchingEngine& engine, Database& db)
    : engine_(engine), db_(db) {
    std::cout << "✅ Server initialized..." << std::endl;
    setup_routes(); // Set up all API routes
}

void Server::setup_routes() {
    // ✅ POST /order — Place a new buy/sell order
    CROW_ROUTE(app_, "/order").methods("POST"_method)
    ([this](const crow::request& req) {
        return this->handle_post_order(req);
    });

    // ✅ GET /trades — Fetch recent trades
    CROW_ROUTE(app_, "/trades").methods("GET"_method)
    ([this]() {
        return this->handle_get_trades();
    });

    // ✅ GET /orderbook/<symbol>
    CROW_ROUTE(app_, "/orderbook/<string>").methods("GET"_method)
    ([this](const std::string& symbol) {
        return this->handle_get_orderbook(symbol);
    });
}

// Handler for POST /order
crow::response Server::handle_post_order(const crow::request& req) {
    auto body = crow::json::load(req.body);
    if (!body) return crow::response(400, "Invalid JSON");

    try {
        std::string user_id = body["user_id"].s();
        std::string symbol = body["symbol"].s();
        std::string type = body["type"].s();
        double price = body["price"].d();
        int quantity = body["quantity"].i();

        // Use the thread-safe atomic counter
        int order_id = g_order_id++; 
        
        OrderType orderType = (type == "BUY") ? OrderType::BUY : OrderType::SELL;
        Order order(order_id, user_id, symbol, orderType, price, quantity);

        // Server's ONLY job: tell the engine to process.
        engine_.processOrder(order);

        crow::json::wvalue res;
        res["status"] = "Order placed successfully";
        res["order_id"] = order.id;
        return crow::response(200, res);

    } catch (const std::exception& e) {
        crow::json::wvalue err;
        err["status"] = "error";
        err["message"] = "Invalid or missing fields";
        return crow::response(400, err);
    }
}

// Handler for GET /trades
crow::response Server::handle_get_trades() {
    // Ask the DATABASE, not the engine, for trades.
    // NOTE: You must implement `getRecentTrades()` in your Database class!
    // It should return a std::vector<Trade> or similar.
    
    // auto trades = db_.getRecentTrades(); 
    
    crow::json::wvalue res;
    res["status"] = "GET /trades placeholder";
    // TODO: Loop through 'trades' and build the JSON array
    return crow::response(200, res);
}

// Handler for GET /orderbook/<symbol>
crow::response Server::handle_get_orderbook(const std::string& symbol) {
    // NOTE: You must implement `getOrderBook()` in your MatchingEngine
    // or OrderBook class!

    crow::json::wvalue res;
    res["symbol"] = symbol;
    res["status"] = "Order book placeholder";
    return crow::response(200, res);
}

void Server::run() {
    std::cout << "🚀 Server running on http://localhost:8080" << std::endl;
    app_.port(8080).multithreaded().run();
}