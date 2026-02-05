from fastapi import FastAPI
from app.presentation.api import news

app = FastAPI(title="GAIA App", version="0.1.0")

app.include_router(news.router, prefix="/api/v1", tags=["news"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
