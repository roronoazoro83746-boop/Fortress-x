import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    # We use Uvicorn directly since it's highly performant and doesn't require complex shell expansion
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, workers=1)
