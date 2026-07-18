"""PIZZALAB history API.

Run:
    python server.py

Environment:
    PIZZALAB_DATA_DIR  Directory containing sessions.json and photos/
    HOST                Bind address (default: 127.0.0.1)
    PORT                Bind port (default: 8787)
"""

from __future__ import annotations

import json
import mimetypes
import os
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("PIZZALAB_DATA_DIR", ROOT / "data")).resolve()
SESSIONS_FILE = DATA_DIR / "sessions.json"
PHOTOS_DIR = DATA_DIR / "photos"
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8787"))


def load_sessions() -> list[dict]:
    if not SESSIONS_FILE.exists():
        return []

    with SESSIONS_FILE.open("r", encoding="utf-8") as handle:
        data = json.load(handle)

    if isinstance(data, dict):
        data = data.get("sessions", [])

    return data if isinstance(data, list) else []


def split_boss_comment(comment: str) -> tuple[list[str], str]:
    lines = comment.splitlines()
    if lines and lines[0].strip().startswith("#"):
        return [lines[0].strip()], "\n".join(lines[1:]).strip()
    return [], comment.strip()


def image_url(value: str | None) -> str | None:
    if not value:
        return None
    if value.startswith(("http://", "https://", "/")):
        return value
    return f"/photos/{value}"


def normalize_detail(raw: dict) -> dict:
    if isinstance(raw.get("card"), dict):
        detail = dict(raw)
        detail["card"] = {
            **raw["card"],
            "image": image_url(raw["card"].get("image")),
        }
        detail["photos"] = sorted(
            raw.get("photos", []), key=lambda photo: photo.get("gameTime", 0)
        )[:6]
        return detail

    hashtags, comment = split_boss_comment(raw.get("bossComment", ""))
    session_id = raw.get("id") or raw.get("sessionId", "")
    played_at = raw.get("playedAt") or datetime.now(timezone.utc).isoformat()

    return {
        "id": session_id,
        "playedAt": played_at,
        "card": {
            "image": image_url(
                raw.get("cardImage") or raw.get("playerCardImage")
            ),
            "hashtags": raw.get("hashtags") or hashtags,
            "persona": raw.get("persona")
            or raw.get("playerPersona")
            or "PIZZALAB PLAYER",
        },
        "bossComment": comment,
        "photos": sorted(
            raw.get("photos", []), key=lambda photo: photo.get("gameTime", 0)
        )[:6],
    }


def to_summary(detail: dict) -> dict:
    card = detail["card"]
    return {
        "id": detail["id"],
        "playedAt": detail["playedAt"],
        "cardImage": card.get("image"),
        "hashtags": card.get("hashtags", []),
        "persona": card.get("persona", "PIZZALAB PLAYER"),
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "PIZZALAB/1.0"

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        path = unquote(urlparse(self.path).path)

        if path == "/api/ping":
            self.send_json(
                {
                    "ok": True,
                    "serverTime": datetime.now(timezone.utc).isoformat(),
                }
            )
            return

        if path == "/api/sessions":
            details = [normalize_detail(item) for item in load_sessions()]
            sessions = sorted(
                (to_summary(item) for item in details),
                key=lambda item: item["playedAt"],
                reverse=True,
            )
            self.send_json({"sessions": sessions})
            return

        if path.startswith("/api/sessions/"):
            session_id = path.removeprefix("/api/sessions/")
            detail = next(
                (
                    normalize_detail(item)
                    for item in load_sessions()
                    if (item.get("id") or item.get("sessionId")) == session_id
                ),
                None,
            )
            if detail is None:
                self.send_json({"error": "session not found"}, status=404)
            else:
                self.send_json(detail)
            return

        if path.startswith("/photos/"):
            self.send_photo(path.removeprefix("/photos/"))
            return

        self.send_json({"error": "not found"}, status=404)

    def send_json(self, payload: object, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_photo(self, filename: str) -> None:
        safe_name = Path(filename).name
        photo_path = (PHOTOS_DIR / safe_name).resolve()

        if PHOTOS_DIR not in photo_path.parents or not photo_path.is_file():
            self.send_json({"error": "photo not found"}, status=404)
            return

        content_type = mimetypes.guess_type(photo_path.name)[0] or "image/png"
        body = photo_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "public, max-age=60")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    print(f"PIZZALAB API: http://{HOST}:{PORT}")
    print(f"Data directory: {DATA_DIR}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
