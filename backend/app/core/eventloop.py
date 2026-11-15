import asyncio
import sys


def configure_windows_event_loop() -> None:
    """psycopg async needs a SelectorEventLoop on Windows (not the default Proactor)."""
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


def selector_loop_factory() -> asyncio.AbstractEventLoop:
    """Custom uvicorn loop factory so psycopg async works on Windows."""
    return asyncio.SelectorEventLoop()
