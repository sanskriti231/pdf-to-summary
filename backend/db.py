import os
import uuid
from typing import Optional

import libsql

TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL", "")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

_conn = None


def _get_connection():
    """Get or create a persistent libsql connection to Turso Cloud."""
    global _conn
    if _conn is None:
        _conn = libsql.connect(
            database=TURSO_DATABASE_URL,
            auth_token=TURSO_AUTH_TOKEN,
        )
    return _conn


def init_db() -> bool:
    """Create tables if they don't exist. Returns True on success, False on failure."""
    try:
        conn = _get_connection()
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                clerk_id TEXT NOT NULL UNIQUE,
                email TEXT,
                name TEXT,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
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
        conn.commit()
        return True
    except Exception as e:
        import logging
        logging.warning(f"Database initialization failed: {e}")
        return False


# --- User helpers ---


def find_or_create_user(clerk_id: str, email: str = "", name: str = "") -> str:
    """Return internal user ID, creating the user row if new."""
    conn = _get_connection()
    rows = conn.execute(
        "SELECT id, email, name FROM users WHERE clerk_id = ?",
        [clerk_id],
    ).fetchall()

    if rows:
        row = rows[0]
        user_id = row[0]
        # Update info if changed
        new_email = email or row[1] or ""
        new_name = name or row[2] or ""
        if new_email != (row[1] or "") or new_name != (row[2] or ""):
            conn.execute(
                "UPDATE users SET email = ?, name = ?, updated_at = datetime('now') WHERE clerk_id = ?",
                [new_email, new_name, clerk_id],
            )
            conn.commit()
        return user_id

    user_id = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO users (id, clerk_id, email, name) VALUES (?, ?, ?, ?)",
        [user_id, clerk_id, email, name],
    )
    conn.commit()
    return user_id


def get_or_create_default_user() -> str:
    """Return an internal user ID for anonymous/unauthenticated usage."""
    conn = _get_connection()
    clerk_id = "_anonymous_"
    rows = conn.execute(
        "SELECT id FROM users WHERE clerk_id = ?", [clerk_id]
    ).fetchall()
    if rows:
        return rows[0][0]
    user_id = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO users (id, clerk_id, email, name) VALUES (?, ?, ?, ?)",
        [user_id, clerk_id, "", "Guest"],
    )
    conn.commit()
    return user_id


def find_user_by_clerk_id(clerk_id: str) -> Optional[str]:
    """Find a user by clerk_id. Returns user_id or None."""
    conn = _get_connection()
    rows = conn.execute(
        "SELECT id FROM users WHERE clerk_id = ?", [clerk_id]
    ).fetchall()
    return rows[0][0] if rows else None


# --- Summary helpers ---

_COLUMN_NAMES = [
    "id", "user_id", "original_filename", "page_count",
    "original_word_count", "summary_word_count", "chunks_processed",
    "summary", "file_size", "created_at", "updated_at",
]


def _row_to_dict(row) -> dict:
    """Convert a libsql Row to a dictionary."""
    return {name: row[i] for i, name in enumerate(_COLUMN_NAMES)}


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
    conn = _get_connection()
    summary_id = str(uuid.uuid4())
    conn.execute(
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
    conn.commit()
    return summary_id


def get_summaries(user_id: Optional[str] = None) -> list[dict]:
    conn = _get_connection()
    if user_id:
        rows = conn.execute(
            """
            SELECT id, original_filename, page_count, summary_word_count,
                   original_word_count, created_at
            FROM summaries
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            [user_id],
        ).fetchall()
    else:
        rows = conn.execute(
            """
            SELECT id, original_filename, page_count, summary_word_count,
                   original_word_count, created_at
            FROM summaries
            ORDER BY created_at DESC
            """
        ).fetchall()

    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "original_filename": row[1],
            "page_count": row[2],
            "summary_word_count": row[3],
            "original_word_count": row[4],
            "created_at": row[5] or "",
        })
    return result


def get_summary(summary_id: str) -> Optional[dict]:
    conn = _get_connection()
    rows = conn.execute("SELECT * FROM summaries WHERE id = ?", [summary_id]).fetchall()
    if not rows:
        return None
    return _row_to_dict(rows[0])


def delete_summary(summary_id: str) -> bool:
    conn = _get_connection()
    conn.execute("DELETE FROM summaries WHERE id = ?", [summary_id])
    conn.commit()
    return True
