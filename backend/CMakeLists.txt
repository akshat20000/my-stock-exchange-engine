cmake_minimum_required(VERSION 3.10)
project(Stock-Exchange-Engine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_BUILD_TYPE Debug)

# --- Find Libraries ---
find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)

# Use pkg-config to find both libraries
pkg_search_module(HIREDIS REQUIRED hiredis)
pkg_search_module(LIBPQXX REQUIRED libpqxx)

# --- Include Directories ---
# Add our 'include' folder AND the library include folders
include_directories(
    include
    ${LIBPQXX_INCLUDE_DIRS}
    ${HIREDIS_INCLUDE_DIRS}
)

# --- Source Files ---
file(GLOB SOURCES "src/*.cpp")

# --- Build Target ---
add_executable(stock_engine ${SOURCES})

# --- Link Libraries ---
target_link_libraries(stock_engine PRIVATE 
    Threads::Threads      # The modern target for Threads
    ${LIBPQXX_LIBRARIES}    # The libraries from pkg-config
    ${HIREDIS_LIBRARIES}   # The libraries from pkg-config
)