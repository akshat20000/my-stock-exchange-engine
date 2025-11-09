#pragma once

#include <spdlog/spdlog.h>
#include <memory>

class Logger {
public:
    // Initializes the logging system. Must be called once at startup.
    static void Init();

    // Returns the main logger instance.
    inline static std::shared_ptr<spdlog::logger>& GetLogger() { return s_Logger; }

private:
    static std::shared_ptr<spdlog::logger> s_Logger;
};

// These are "macros" - shortcuts that make typing log messages much easier.
// Instead of Logger::GetLogger()->info("..."), you just type LOG_INFO("...")
#define LOG_TRACE(...) ::Logger::GetLogger()->trace(__VA_ARGS__)
#define LOG_INFO(...)  ::Logger::GetLogger()->info(__VA_ARGS__)
#define LOG_WARN(...)  ::Logger::GetLogger()->warn(__VA_ARGS__)
#define LOG_ERROR(...) ::Logger::GetLogger()->error(__VA_ARGS__)
#define LOG_CRITICAL(...) ::Logger::GetLogger()->critical(__VA_ARGS__)