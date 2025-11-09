import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "stock_exchange_db",
  password: "Akshat@2004",
  port:  5432,
});

// register user
export async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password_hash, balance) VALUES ($1, $2, $3)", [
      username,
      hashed,
      10000.0, // default starting balance
    ]);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
}

// login user
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (result.rowCount === 0) return res.status(401).json({ message: "Invalid username" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
}
