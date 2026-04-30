from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.db.session import get_db
from app.db import crud
from app.core.security import get_current_user

router = APIRouter()
logger = structlog.get_logger()

@router.get("/", dependencies=[Depends(get_current_user)])
async def get_metrics(db: AsyncSession = Depends(get_db)):
    """
    Retrieves aggregated metrics for the dashboard.
    """
    logger.info("get_metrics_requested")
    metrics = await crud.get_dashboard_metrics(db)
    
    # Use real DB queries for charts
    risk_trend = await crud.get_historical_risk_trend(db)
    risk_dist = await crud.get_risk_distribution(db)
    
    # Count open alerts
    from sqlalchemy import select, func
    from app.db import models
    active_alerts = await db.scalar(select(func.count(models.Alert.id)).where(models.Alert.status == "OPEN")) or 0

    return {
        "totalScans": metrics["total_transactions"],
        "fraudBlocked": metrics["fraud_detected"],
        "avgRiskScore": round(metrics["avg_risk_score"] * 100, 2), # Convert to percentage
        "activeAlerts": active_alerts,
        "riskTrend": risk_trend,
        "riskDistribution": risk_dist
    }

@router.get("/public")
async def get_public_metrics(db: AsyncSession = Depends(get_db)):
    """
    Retrieves public metrics for the landing page (no auth required).
    """
    logger.info("get_public_metrics_requested")
    metrics = await crud.get_public_metrics(db)
    
    return {
        "transactionsAnalyzed": metrics["transactions_analyzed"],
        "activeUsers": metrics["active_users"],
        "threatsBlocked": metrics["threats_blocked"],
        "avgRiskScore": round(metrics["avg_risk_score"] * 100, 2),
    }
