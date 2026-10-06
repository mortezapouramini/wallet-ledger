-- ============================================
-- wallet-ledger schema.sql
-- ============================================
-- For gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- ENUMS ----------
CREATE TYPE account_owner_type AS ENUM ('user', 'system', 'merchant');

CREATE TYPE account_label AS ENUM ('main', 'savings', 'business');

CREATE TYPE transaction_type AS ENUM (
    'deposit',
    'withdrawal',
    'purchase',
    'transfer',
    'refund'
);

CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'reversed');

CREATE TYPE ledger_direction AS ENUM ('debit', 'credit');

-- ---------- USERS ----------
CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

-- ---------- ACCOUNTS ----------
CREATE TABLE
    accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        owner_type account_owner_type NOT NULL,
        user_id UUID REFERENCES users (id),
        label account_label NOT NULL DEFAULT 'main',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        UNIQUE (user_id, label)
    );

CREATE INDEX idx_accounts_user_id ON accounts (user_id);

-- ---------- TRANSACTIONS ----------
CREATE TABLE
    transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        type transaction_type NOT NULL,
        status transaction_status NOT NULL DEFAULT 'pending',
        idempotency_key VARCHAR(255) NOT NULL UNIQUE,
        reversed_transaction_id UUID REFERENCES transactions (id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_transactions_idempotency_key ON transactions (idempotency_key);

CREATE INDEX idx_transactions_status ON transactions (status);

-- ---------- LEDGER ENTRIES ----------
CREATE TABLE
    ledger_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        transaction_id UUID NOT NULL REFERENCES transactions (id),
        account_id UUID NOT NULL REFERENCES accounts (id),
        direction ledger_direction NOT NULL,
        amount BIGINT NOT NULL CHECK (amount > 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_ledger_entries_account_id ON ledger_entries (account_id);

CREATE INDEX idx_ledger_entries_transaction_id ON ledger_entries (transaction_id);

-- ---------- SEED: System accounts ----------
INSERT INTO
    accounts (owner_type, label)
VALUES
    ('system', 'main');

INSERT INTO
    accounts (owner_type, label)
VALUES
    ('merchant', 'main');