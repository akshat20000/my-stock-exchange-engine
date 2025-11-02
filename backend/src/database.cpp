#include "database.hpp"
#include <iostream>

Database::Database(const std::string& dbname, const std::string& user,
                   const std::string& password, const std::string& host, int port) {
    std::string conn_str = 
        "dbname=" + dbname + " user=" + user + " password=" + password +
        " host=" + host + " port=" + std::to_string(port);
    conn = new pqxx::connection(conn_str);
    if (conn->is_open())
        std::cout << "✅ Connected to database successfully\n";
    else
        std::cout << "❌ Database connection failed\n";
}

Database::~Database() {
   // conn->disconnect();
    delete conn;
}

void Database::insertOrder(int id, const std::string& user_id, const std::string& symbol,
                           const std::string& type, double price, int qty) {
    pqxx::work txn(*conn);
    txn.exec_params("INSERT INTO orders (id, user_id, symbol, type, price, qty) VALUES ($1,$2,$3,$4,$5,$6);",
                    id, user_id, symbol, type, price, qty);
    txn.commit();
}

void Database::insertTrade(int trade_id, int buy_id, int sell_id, double price, int qty) {
    pqxx::work txn(*conn);
    txn.exec_params("INSERT INTO trades (trade_id, buy_id, sell_id, price, qty) VALUES ($1,$2,$3,$4,$5);",
                    trade_id, buy_id, sell_id, price, qty);
    txn.commit();
}

crow::json::wvalue Database::getRecentTrades() {
    try {
        // Use a non-transactional read for speed
        pqxx::read_transaction txn(*conn);
        pqxx::result r = txn.exec(
            "SELECT trade_id, price, qty FROM trades ORDER BY trade_id DESC LIMIT 20"
        );

        std::vector<crow::json::wvalue> trades;
        for (const auto& row : r) {
            crow::json::wvalue trade;
            trade["trade_id"] = row["trade_id"].as<int>();
            trade["price"] = row["price"].as<double>();
            trade["qty"] = row["qty"].as<int>();
            trades.push_back(std::move(trade));
        }
        
        
        return trades; 

    } catch (const std::exception& e) {
        std::cerr << "DB getRecentTrades error: " << e.what() << std::endl;
        // Return an empty list on error
        return crow::json::wvalue(crow::json::type::List); 
    }
}