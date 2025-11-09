CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    balance DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY,
    user_id VARCHAR(50),
    symbol VARCHAR(10),
    type VARCHAR(10),
    price DOUBLE PRECISION,
    qty INT
);

CREATE TABLE IF NOT EXISTS trades (
    trade_id INT PRIMARY KEY,
    buy_id INT,
    sell_id INT,
    price DOUBLE PRECISION,
    qty INT
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS balance DOUBLE PRECISION DEFAULT 100000;

CREATE TABLE IF NOT EXISTS portfolio (
    user_id VARCHAR(50),
    symbol VARCHAR(10),
    quantity INT DEFAULT 0,
    avg_price DOUBLE PRECISION DEFAULT 0
);
