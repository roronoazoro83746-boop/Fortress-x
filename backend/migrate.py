import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def main():
    try:
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            # SQLite doesn't support IF NOT EXISTS in ADD COLUMN easily, so we catch exception
            try:
                await conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'analyst'"))
                print("Successfully added column")
            except Exception as inner_e:
                print(f"Column might already exist: {inner_e}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())
