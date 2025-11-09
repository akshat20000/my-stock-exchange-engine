#include "Logger.hpp"
#include <spdlog/sinks/stdout_color_sinks.h>

// Define the static member variable
std::shared_ptr<spdlog::logger> Logger::s_Logger;

void Logger::Init() {
    // Set the pattern for log messages:
    // %^ starts color range, [%T] is timestamp, %n is logger name, %v is message, %$ ends color range
    spdlog::set_pattern("%^[%T] %n: %v%$");

    // Create a colorized standard output sink
    s_Logger = spdlog::stdout_color_mt("ENGINE");
    s_Logger->set_level(spdlog::level::trace);

    LOG_INFO("Logger initialized successfully!");
}