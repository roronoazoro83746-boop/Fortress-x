from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import models

async def save_transaction(db: AsyncSession, transaction_data: dict) -> models.Transaction:
    db_transaction = models.Transaction(**transaction_data)
    db.add(db_transaction)
    await db.commit()
    await db.refresh(db_transaction)
    return db_transaction

async def save_score(db: AsyncSession, score_data: dict) -> models.Score:
    db_score = models.Score(**score_data)
    db.add(db_score)
    await db.commit()
    await db.refresh(db_score)
    return db_score

async def create_alert(db: AsyncSession, alert_data: dict) -> models.Alert:
    db_alert = models.Alert(**alert_data)
    db.add(db_alert)
    await db.commit()
    await db.refresh(db_alert)
    return db_alert

async def get_transaction_with_details(db: AsyncSession, transaction_id: str):
    result = await db.execute(
        select(models.Transaction).where(models.Transaction.id == transaction_id)
    )
    return result.scalars().first()

async def get_all_alerts(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Alert).order_by(models.Alert.created_at.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()

async def init_db():
    from app.db.session import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
