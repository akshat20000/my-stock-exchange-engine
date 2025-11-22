import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
});

/**
 * Register a new user
 */
export async function register(req, res) {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Username and password are required" 
    });
  }

  if (username.length < 3) {
    return res.status(400).json({ 
      success: false,
      message: "Username must be at least 3 characters" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: "Password must be at least 6 characters" 
    });
  }

  try {
    // Check if username already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({ 
        success: false,
        message: "Username already exists" 
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert new user with default balance
    const result = await pool.query(
      "INSERT INTO users (username, password_hash, balance, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, username, balance",
      [username, hashed, 10000.0]
    );

    const newUser = result.rows[0];

    console.log(`✅ New user registered: ${username} (ID: ${newUser.id})`);

    res.status(201).json({ 
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        balance: newUser.balance
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error registering user" 
    });
  }
}

/**
 * Login user and generate JWT token
 */
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Username and password are required" 
    });
  }

  try {
    // Get user from database
    const result = await pool.query(
      "SELECT id, username, password_hash, balance, is_active FROM users WHERE username = $1",
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid username or password" 
      });
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ 
        success: false,
        message: "Account is deactivated" 
      });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid username or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "2h" }
    );

    // Update last login
    await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1",
      [user.id]
    );

    // Store session in database
    const tokenHash = await bcrypt.hash(token, 5); // Light hashing for lookup
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

    await pool.query(
      "INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
      [user.id, tokenHash, expiresAt]
    );

    console.log(`✅ User logged in: ${username} (ID: ${user.id})`);

    res.json({ 
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error logging in" 
    });
  }
}

/**
 * Verify JWT token (middleware)
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }
    return res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
}

/**
 * Logout (revoke token)
 */
export async function logout(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenHash = await bcrypt.hash(token, 5);

    // Mark session as revoked
    await pool.query(
      "UPDATE user_sessions SET is_revoked = TRUE WHERE user_id = $1 AND token_hash = $2",
      [decoded.userId, tokenHash]
    );

    console.log(`✅ User logged out: ${decoded.username}`);

    res.json({ 
      success: true,
      message: "Logged out successfully" 
    });

  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error logging out" 
    });
  }
}

/**
 * Get current user info
 */
export async function getMe(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, username, balance, created_at, last_login FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({ 
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching user" 
    });
  }
}