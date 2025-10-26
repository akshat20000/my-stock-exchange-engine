#include "redis_client.hpp"
#include <iostream>

RedisClient::RedisClient(const std::string& host, int port) {
    context = redisConnect(host.c_str(), port);
    if (context == NULL || context->err) {
        std::cout << "❌ Redis connection failed\n";
        exit(1);
    } else {
        std::cout << "✅ Connected to Redis\n";
    }
}

RedisClient::~RedisClient() {
    redisFree(context);
}

void RedisClient::publish(const std::string& channel, const std::string& message) {
    redisCommand(context, "PUBLISH %s %s", channel.c_str(), message.c_str());
}
