#include "redis_client.hpp"
#include <iostream>

RedisClient::RedisClient(const std::string& host, int port) {
    context = redisConnect(host.c_str(), port);
    if (context == NULL || context->err) {
        if(context){
        std::cerr << "❌ Redis connection error: " << context->errstr << std::endl;
        redisFree(context);
        }else{
            std::cerr << "❌ Redis: Can't allocate redis context" << std::endl;
        }
        context = NULL;
    } else {
        std::cout << "✅ Connected to Redis\n";
    }
}

RedisClient::~RedisClient() {
    redisFree(context);
}

void RedisClient::publish(const std::string& channel, const std::string& message) {
    if (context == NULL) {
        std::cerr << "❌ Redis: Not connected. Cannot publish." << std::endl;
        return;
    }

    // redisCommand returns a reply, even for PUBLISH
    redisReply *reply = (redisReply*) redisCommand(context, "PUBLISH %s %s", channel.c_str(), message.c_str());

    if (reply == NULL) {
        std::cerr << "❌ Redis publish error: " << context->errstr << std::endl;
    } else {
        // It's good practice to always free the reply
        freeReplyObject(reply);
    }
}
