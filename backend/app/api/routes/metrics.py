from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.db.session import get_db
from app.db import crud
from app.core.security import get_current_user

router = APIRouter()
logger = structlog.get_logger()

@router.get("/")
async def get_metrics(db: AsyncSession = Depends(get_db)):
    """
    Retrieves aggregated metrics for the dashboard.
    """
    logger.info("get_metrics_requested")
    try:
        metrics = await crud.get_dashboard_metrics(db)
        
        # Use real DB queries for charts
        risk_trend = await crud.get_historical_risk_trend(db)
        risk_dist = await crud.get_risk_distribution(db)
        
        # Count open alerts
        from sqlalchemy import select, func
        from app.db import models
        active_alerts = await db.scalar(select(func.count(models.Alert.id)).where(models.Alert.status == "OPEN")) or 0

        if metrics.get("total_transactions", 0) > 0:
            return {
                "totalScans": metrics["total_transactions"],
                "fraudBlocked": metrics["fraud_detected"],
                "avgRiskScore": round(metrics["avg_risk_score"] * 100, 2), # Convert to percentage
                "activeAlerts": active_alerts,
                "riskTrend": risk_trend,
                "riskDistribution": risk_dist
            }
    except Exception as e:
        logger.error("get_metrics_failed", error=str(e))

    # Fallback demo data
    return {
        "totalScans": 12450,
        "fraudBlocked": 432,
        "avgRiskScore": 12.5,
        "activeAlerts": 15,
        "riskTrend": [
            {"name": "Mon", "total": 1200, "fraud": 45},
            {"name": "Tue", "total": 1500, "fraud": 55},
            {"name": "Wed", "total": 1800, "fraud": 60},
            {"name": "Thu", "total": 2100, "fraud": 80},
            {"name": "Fri", "total": 2500, "fraud": 95},
            {"name": "Sat", "total": 1900, "fraud": 50},
            {"name": "Sun", "total": 1450, "fraud": 47}
        ],
        "riskDistribution": [
            {"name": "Low Risk", "value": 75.5, "color": "#4ade80"},
            {"name": "Medium Risk", "value": 15.0, "color": "#facc15"},
            {"name": "High Risk", "value": 7.5, "color": "#f97316"},
            {"name": "Critical Risk", "value": 2.0, "color": "#ef4444"}
        ]
    }

@router.get("/public")
async def get_public_metrics(db: AsyncSession = Depends(get_db)):
    """
    Retrieves public metrics for the landing page (no auth required).
    """
    logger.info("get_public_metrics_requested")
    try:
        metrics = await crud.get_public_metrics(db)
        
        if metrics.get("transactions_analyzed", 0) > 0:
            return {
                "transactionsAnalyzed": metrics["transactions_analyzed"],
                "activeUsers": metrics["active_users"],
                "threatsBlocked": metrics["threats_blocked"],
                "avgRiskScore": round(metrics["avg_risk_score"] * 100, 2),
            }
    except Exception as e:
        logger.error("get_public_metrics_failed", error=str(e))

    # Fallback demo data
    return {
        "transactionsAnalyzed": 12450,
        "activeUsers": 340,
        "threatsBlocked": 432,
        "avgRiskScore": 12.5,
    }
