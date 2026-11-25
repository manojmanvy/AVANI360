"""Start/stop a local PostgreSQL server using the bundled binaries (no admin needed)."""

import argparse
import subprocess
from pathlib import Path

from embedded_postgres._commands import POSTGRES_BIN_PATH

BACKEND_DIR = Path(__file__).resolve().parent
PGDATA = BACKEND_DIR / ".pgdata"
LOG_FILE = BACKEND_DIR / "postgres.log"
HOST = "127.0.0.1"
PORT = 5432
DB_USER = "postgres"
DB_NAME = "avani360"


def _exe(name: str) -> str:
    return str(POSTGRES_BIN_PATH / name)


def _run(exe: str, args: list[str], timeout: int = 60) -> None:
    print("+", exe, " ".join(args))
    subprocess.run([_exe(exe), *args], check=True, timeout=timeout)


def _is_running() -> bool:
    return (
        subprocess.run(
            [_exe("pg_ctl.exe"), "-D", str(PGDATA), "status"],
            capture_output=True,
            check=False,
        ).returncode
        == 0
    )


def _psql(sql: str, database: str = "postgres") -> str:
    return subprocess.run(
        [
            _exe("psql.exe"),
            "-h",
            HOST,
            "-p",
            str(PORT),
            "-U",
            DB_USER,
            "-d",
            database,
            "-tAc",
            sql,
        ],
        check=True,
        capture_output=True,
        text=True,
        timeout=30,
    ).stdout.strip()


def _init() -> None:
    if (PGDATA / "PG_VERSION").exists():
        return
    PGDATA.mkdir(parents=True, exist_ok=True)
    _run(
        "initdb.exe",
        [
            "-D",
            str(PGDATA),
            "-U",
            DB_USER,
            "--auth=trust",
            "--encoding=UTF8",
        ],
        timeout=120,
    )


def _ensure_database() -> None:
    if _psql(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'") != "1":
        _psql(f'CREATE DATABASE "{DB_NAME}"')
        print(f"created database {DB_NAME}")


def start() -> None:
    _init()
    if _is_running():
        print("postgres already running")
    else:
        _run(
            "pg_ctl.exe",
            [
                "-D",
                str(PGDATA),
                "-l",
                str(LOG_FILE),
                "-o",
                f'-h "{HOST}"',
                "-o",
                f"-p {PORT}",
                "-w",
                "start",
            ],
            timeout=60,
        )
    _ensure_database()
    print(f"ready: postgresql+psycopg://{DB_USER}:postgres@{HOST}:{PORT}/{DB_NAME}")


def stop() -> None:
    if _is_running():
        _run(
            "pg_ctl.exe",
            ["-D", str(PGDATA), "-m", "fast", "-w", "stop"],
            timeout=60,
        )
        print("postgres stopped")
    else:
        print("postgres is not running")


def status() -> None:
    print("postgres is running" if _is_running() else "postgres is not running")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["start", "stop", "status"])
    args = parser.parse_args()
    {"start": start, "stop": stop, "status": status}[args.action]()
