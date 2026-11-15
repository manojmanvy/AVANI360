import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0" if os.environ.get("RENDER") else "127.0.0.1"
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        loop="app.core.eventloop:selector_loop_factory",
    )

