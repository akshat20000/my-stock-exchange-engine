#pragma once
#include <pqxx/pqxx>
#include <string>
#include <crow.h>

class Database {
private:
    pqxx::connection* conn;

public:
    Database(const std::string& dbname, const std::string& user,
             const std::string& password, const std::string& host, int port);
    ~Database();

    void insertOrder(int id, const std::string& user_id, const std::string& symbol,
                     const std::string& type, double price, int qty);
    void insertTrade(int trade_id, int buy_id, int sell_id, double price, int qty);

    crow::json::wvalue getRecentTrades();
};
