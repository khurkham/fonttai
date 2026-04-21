CREATE TABLE IF NOT EXISTS active_visitors (
  ip_hash TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  user_agent TEXT,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen_at
ON active_visitors(last_seen_at);

CREATE INDEX IF NOT EXISTS idx_active_visitors_path
ON active_visitors(path);
