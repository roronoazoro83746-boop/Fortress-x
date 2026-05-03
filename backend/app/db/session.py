import ssl as _ssl
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Build connect_args based on database type
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif "supabase" in settings.DATABASE_URL or "postgresql" in settings.DATABASE_URL:
    # Supabase (and most cloud Postgres) requires SSL
    ssl_ctx = _ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = _ssl.CERT_NONE
    connect_args = {"ssl": ssl_ctx}
else:
    connect_args = {}

engine = create_async_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=True if settings.ENVIRONMENT == "development" else False,
    pool_pre_ping=True,  # Detect stale connections
)

SessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
