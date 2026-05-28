CREATE SCHEMA IF NOT EXISTS kleron;

CREATE TABLE IF NOT EXISTS kleron.users (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email      TEXT        UNIQUE NOT NULL,
    name       TEXT        NOT NULL,
    avatar_url TEXT        NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kleron.cards (
    id               TEXT    PRIMARY KEY,
    name             TEXT    NOT NULL,
    number           INT     NOT NULL,
    suit             TEXT    NOT NULL,
    image_url        TEXT    NOT NULL DEFAULT '',
    upright_meaning  TEXT    NOT NULL DEFAULT '',
    reversed_meaning TEXT    NOT NULL DEFAULT '',
    keywords         TEXT[]  NOT NULL DEFAULT '{}',
    description      TEXT    NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS kleron.readings (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES kleron.users(id) ON DELETE CASCADE,
    question    TEXT        NOT NULL DEFAULT '',
    spread_type TEXT        NOT NULL DEFAULT 'three-card',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kleron.reading_cards (
    reading_id  UUID    NOT NULL REFERENCES kleron.readings(id) ON DELETE CASCADE,
    card_id     TEXT    NOT NULL REFERENCES kleron.cards(id),
    position    INT     NOT NULL,
    is_reversed BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (reading_id, position)
);

CREATE INDEX IF NOT EXISTS readings_user_id_idx ON kleron.readings(user_id, created_at DESC);
