#pragma once
#include <hiredis/hiredis.h>
#include <string>

class RedisClient {
private:
    redisContext* context;

public:
    RedisClient(const std::string& host, int port);
    ~RedisClient();

    void publish(const std::string& channel, const std::string& message);
};
