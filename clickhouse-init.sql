CREATE TABLE IF NOT EXISTS events
(
    event_type String,
    page String,
    session_id String,
    timestamp DateTime
)
ENGINE = MergeTree()
ORDER BY timestamp;
