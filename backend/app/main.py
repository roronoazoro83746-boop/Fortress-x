import time
import uuid
import structlog
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.logging_conf import setup_logging
from app.core.security import limiter, _rate_limit_exceeded_handler, RateLimitExceeded

# Initialize logging
setup_logging()
logger = structlog.get_logger()

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)
        
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = str(process_time)
        
        logger.info(
            "request_processed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration=process_time,
            client_ip=request.client.host if request.client else "unknown"
        )
        return response

import asyncio
from app.api.api_v1 import api_router
from app.services.live_feed import live_feed_task

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

from app.db.crud import init_db

@app.on_event("startup")
async def startup_event():
    # Initialize database tables
    try:
        await init_db()
        logger.info("database_initialized")
    except Exception as e:
        logger.error("database_initialization_failed", error=str(e))
    # Start the live feed task in the background
    asyncio.create_task(live_feed_task())

# Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware
app.add_middleware(RequestIDMiddleware)
origins = [str(origin) for origin in settings.CORS_ORIGINS] if settings.CORS_ORIGINS else ["https://fortress-x-nine.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {
        "status": "active",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": time.time()
    }

@app.get("/metrics")
async def metrics():
    # Production note: In a real system, we'd use Prometheus registry here
    return {
        "active_engines": ["ml", "ip", "behavior"],
        "api_v1_status": "operational",
        "uptime": "simulated_99.99"
    }

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}", "version": "1.0.0"}
