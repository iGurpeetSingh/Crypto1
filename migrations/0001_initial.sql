CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 email TEXT NOT NULL UNIQUE,
 full_name TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 email_verified_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS email_otps (
 email TEXT NOT NULL,
 purpose TEXT NOT NULL CHECK(purpose IN ('login','register')),
 code_hash TEXT NOT NULL,
 salt TEXT NOT NULL,
 full_name TEXT NOT NULL DEFAULT '',
 expires_at INTEGER NOT NULL,
 created_at INTEGER NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(email,purpose)
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS demo_wallets (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 usd_balance REAL NOT NULL DEFAULT 10000,
 inr_balance REAL NOT NULL DEFAULT 0,
 updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS demo_trades (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 symbol TEXT NOT NULL,
 side TEXT NOT NULL CHECK(side IN ('BUY','SELL')),
 quantity REAL NOT NULL CHECK(quantity>0),
 price REAL NOT NULL CHECK(price>0),
 fee REAL NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL
);
