cmake_minimum_required(VERSION 3.10)
project(Stock-Exchange-Engine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_BUILD_TYPE Debug)

# --- Find System Libraries ---
find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)
find_package(Boost REQUIRED COMPONENTS system thread)
pkg_search_module(HIREDIS REQUIRED hiredis)
pkg_search_module(LIBPQXX REQUIRED libpqxx)
find_path(ASIO_INCLUDE_DIR NAMES asio.hpp PATHS /usr/include /usr/local/include REQUIRED)

# --- Build Cloned Crow Library ---
# Build the library found in the lib/crow directory
add_subdirectory(lib/crow)

# --- Include Directories ---
include_directories(
    include                   # Project headers
    lib/crow/include          # Cloned Crow headers
    ${Boost_INCLUDE_DIRS}
    ${LIBPQXX_INCLUDE_DIRS}
    ${HIREDIS_INCLUDE_DIRS}
    ${ASIO_INCLUDE_DIR}
)

# --- Source Files ---
file(GLOB SOURCES "src/*.cpp")

# --- Build Target ---
add_executable(stock_engine ${SOURCES})

# --- Link Libraries ---
# Link against system libs and the 'crow' target built by add_subdirectory
target_link_libraries(stock_engine PRIVATE
    Threads::Threads
    Boost::system
    Boost::thread
    ${LIBPQXX_LIBRARIES}
    ${HIREDIS_LIBRARIES}
    Crow 
)