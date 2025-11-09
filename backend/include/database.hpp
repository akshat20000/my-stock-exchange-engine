#pragma once
#include <pqxx/pqxx>
#include <string>
#include <crow.h>

class Database {
private:
    pqxx::connection* conn;

public:

    template<typename... Args>
    bool execute(const std::string& query, Args... args) {
        try {
            pqxx::work txn(*conn);
            txn.exec_params(query, args...);
            txn.commit();
            return true;
        } catch (const std::exception& e) {
            std::cerr << "DB Query failed: " << e.what() << std::endl;
            return false;
        }
    }

    Database(const std::string& dbname, const std::string& user,
             const std::string& password, const std::string& host, int port);
    ~Database();

    void insertOrder(int id, const std::string& user_id, const std::string& symbol,
                     const std::string& type, double price, int qty);
    void insertTrade(int trade_id, int buy_id, int sell_id, double price, int qty);

    crow::json::wvalue getRecentTrades();
};
