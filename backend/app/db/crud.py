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

from sqlalchemy.orm import selectinload
from sqlalchemy import func, case
import calendar

async def get_alert_with_details(db: AsyncSession, alert_id: int):
    result = await db.execute(
        select(models.Alert)
        .options(selectinload(models.Alert.transaction).selectinload(models.Transaction.score))
        .where(models.Alert.id == alert_id)
    )
    return result.scalars().first()

async def get_dashboard_metrics(db: AsyncSession):
    total_tx = await db.scalar(select(func.count(models.Transaction.id))) or 0
    fraud_count = await db.scalar(select(func.count(models.Score.id)).where(models.Score.decision.in_([models.Decision.BLOCK, models.Decision.REVIEW]))) or 0
    avg_risk = await db.scalar(select(func.avg(models.Score.final_score))) or 0.0

    return {
        "total_transactions": total_tx,
        "fraud_detected": fraud_count,
        "avg_risk_score": avg_risk,
    }

async def get_public_metrics(db: AsyncSession):
    total_tx = await db.scalar(select(func.count(models.Transaction.id))) or 0
    active_users = await db.scalar(select(func.count(func.distinct(models.Transaction.user_id)))) or 0
    threats_blocked = await db.scalar(select(func.count(models.Score.id)).where(models.Score.decision == models.Decision.BLOCK)) or 0
    avg_risk = await db.scalar(select(func.avg(models.Score.final_score))) or 0.0

    return {
        "transactions_analyzed": total_tx,
        "active_users": active_users,
        "threats_blocked": threats_blocked,
        "avg_risk_score": avg_risk,
    }

async def init_db():
    from app.db.session import engine, Base
    async with engine.begin() as conn:
        from sqlalchemy import text
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'analyst'"))
        except Exception:
            pass
        await conn.run_sync(Base.metadata.create_all)

async def get_historical_risk_trend(db: AsyncSession):
    stmt = (
        select(
            func.date(models.Transaction.timestamp).label("date"),
            func.count(models.Transaction.id).label("total"),
            func.sum(case((models.Score.decision.in_([models.Decision.BLOCK, models.Decision.REVIEW]), 1), else_=0)).label("fraud")
        )
        .outerjoin(models.Score)
        .group_by(func.date(models.Transaction.timestamp))
        .order_by(func.date(models.Transaction.timestamp).asc())
        .limit(7)
    )
    result = await db.execute(stmt)
    rows = result.all()
    
    trend = []
    for row in rows:
        d = row.date
        if isinstance(d, str):
            from datetime import datetime
            try:
                d = datetime.strptime(d, "%Y-%m-%d").date()
            except Exception:
                pass
        name = f"{calendar.month_abbr[d.month]} {d.day}" if not isinstance(d, str) else d
        trend.append({
            "name": name,
            "total": row.total or 0,
            "fraud": row.fraud or 0
        })
    return trend

async def get_risk_distribution(db: AsyncSession):
    stmt = select(
        func.sum(case((models.Score.final_score < 0.3, 1), else_=0)).label("low"),
        func.sum(case((models.Score.final_score.between(0.3, 0.6), 1), else_=0)).label("medium"),
        func.sum(case((models.Score.final_score.between(0.6, 0.8), 1), else_=0)).label("high"),
        func.sum(case((models.Score.final_score >= 0.8, 1), else_=0)).label("critical"),
        func.count(models.Score.id).label("total")
    )
    result = await db.execute(stmt)
    row = result.first()
    total = row.total if row and row.total and row.total > 0 else 1
    return [
        {"name": "Low Risk", "value": round(((row.low or 0) / total) * 100, 1), "color": "#4ade80"},
        {"name": "Medium Risk", "value": round(((row.medium or 0) / total) * 100, 1), "color": "#facc15"},
        {"name": "High Risk", "value": round(((row.high or 0) / total) * 100, 1), "color": "#f97316"},
        {"name": "Critical Risk", "value": round(((row.critical or 0) / total) * 100, 1), "color": "#ef4444"},
    ]

async def get_all_transactions(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Transaction)
        .options(selectinload(models.Transaction.score))
        .order_by(models.Transaction.timestamp.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def get_all_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.User)
        .order_by(models.User.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
