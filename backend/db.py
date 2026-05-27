import os
import json
import uuid
from typing import Optional

import requests

TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL", "")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")


def _get_http_url() -> str:
    """Convert libsql:// URL to https:// for the Turso HTTP API."""
    url = TURSO_DATABASE_URL
    if url.startswith("libsql://"):
        url = "https://" + url[len("libsql://"):]
    elif not url.startswith("http"):
        url = "https://" + url
    return url


def _execute(sql: str, args: Optional[list] = None) -> dict:
    """Execute a SQL statement via the Turso HTTP v2 pipeline API."""
    if args is None:
        args = []

    url = f"{_get_http_url()}/v2/pipeline"
    headers = {
        "Authorization": f"Bearer {TURSO_AUTH_TOKEN}",
        "Content-Type": "application/json",
    }

    typed_args = []
    for a in args:
        if a is None:
            typed_args.append({"type": "null"})
        elif isinstance(a, int):
            typed_args.append({"type": "integer", "value": str(a)})
        elif isinstance(a, float):
            typed_args.append({"type": "float", "value": str(a)})
        else:
            typed_args.append({"type": "text", "value": str(a)})

    body = {
        "requests": [
            {"type": "execute", "stmt": {"sql": sql, "args": typed_args}},
            {"type": "close"},
        ]
    }

    resp = requests.post(url, headers=headers, json=body, timeout=10)
    resp.raise_for_status()
    return resp.json()


def _query(sql: str, args: Optional[list] = None) -> list[dict]:
    """Execute a SELECT / read query and return rows as dicts."""
    result = _execute(sql, args)
    rows = []
    for response in result.get("responses", []):
        if "response" in response and "result" in response["response"]:
            result_set = response["response"]["result"]
            cols = [c["name"] for c in result_set.get("cols", [])]
            for row in result_set.get("rows", []):
                row_dict = {}
                for i, cell in enumerate(row):
                    val = cell.get("value")
                    # Turso returns values as strings in the "value" field
                    row_dict[cols[i]] = val
                rows.append(row_dict)
    return rows


def init_db() -> bool:
    """Create tables if they don't exist. Returns True on success, False on failure."""
    try:
        _execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                clerk_id TEXT NOT NULL UNIQUE,
                email TEXT,
                name TEXT,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
        """)
        _execute("""
            CREATE TABLE IF NOT EXISTS summaries (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                original_filename TEXT NOT NULL,
                page_count INTEGER NOT NULL,
                original_word_count INTEGER NOT NULL,
                summary_word_count INTEGER NOT NULL,
                chunks_processed INTEGER NOT NULL,
                summary TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
        """)
        return True
    except Exception as e:
        import logging
        logging.warning(f"Database initialization failed (will retry on first request): {e}")
        return False


# --- User helpers ---


def find_or_create_user(clerk_id: str, email: str = "", name: str = "") -> str:
    """Return internal user ID, creating the user row if new."""
    rows = _query("SELECT id, email, name FROM users WHERE clerk_id = ?", [clerk_id])
    if rows:
        row = rows[0]
        # Update info if changed
        new_email = email or row.get("email") or ""
        new_name = name or row.get("name") or ""
        if new_email != row.get("email") or new_name != row.get("name"):
            _execute(
                "UPDATE users SET email = ?, name = ?, updated_at = datetime('now') WHERE clerk_id = ?",
                [new_email, new_name, clerk_id],
            )
        return row["id"]

    user_id = str(uuid.uuid4())
    _execute(
        "INSERT INTO users (id, clerk_id, email, name) VALUES (?, ?, ?, ?)",
        [user_id, clerk_id, email, name],
    )
    return user_id


# --- Summary helpers ---


def create_summary(
    user_id: str,
    original_filename: str,
    page_count: int,
    original_word_count: int,
    summary_word_count: int,
    chunks_processed: int,
    summary: str,
    file_size: int,
) -> str:
    summary_id = str(uuid.uuid4())
    _execute(
        """
        INSERT INTO summaries (id, user_id, original_filename, page_count,
            original_word_count, summary_word_count, chunks_processed,
            summary, file_size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            summary_id,
            user_id,
            original_filename,
            page_count,
            original_word_count,
            summary_word_count,
            chunks_processed,
            summary,
            file_size,
        ],
    )
    return summary_id


def get_summaries(user_id: str) -> list[dict]:
    return _query(
        """
        SELECT id, original_filename, page_count, summary_word_count,
               original_word_count, created_at
        FROM summaries
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        [user_id],
    )


def get_summary(summary_id: str) -> Optional[dict]:
    rows = _query("SELECT * FROM summaries WHERE id = ?", [summary_id])
    return rows[0] if rows else None


def delete_summary(summary_id: str, user_id: str) -> bool:
    _execute(
        "DELETE FROM summaries WHERE id = ? AND user_id = ?",
        [summary_id, user_id],
    )
    return True
