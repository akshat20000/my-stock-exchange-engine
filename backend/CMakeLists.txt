cmake_minimum_required(VERSION 3.10)
project(Stock-Exchange-Engine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_BUILD_TYPE Debug)

# Include directories
include_directories(include)

# Find libraries
find_package(Threads REQUIRED)
find_package(PostgreSQL REQUIRED)

# Source files
file(GLOB SOURCES "src/*.cpp")

add_executable(stock_engine ${SOURCES})
target_link_libraries(stock_engine PRIVATE PostgreSQL::PostgreSQL Threads::Threads)
