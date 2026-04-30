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
    
    # We add some static chart data for now since we don't have historical series implemented
    return {
        "totalScans": metrics["total_transactions"],
        "fraudBlocked": metrics["fraud_detected"],
        "avgRiskScore": round(metrics["avg_risk_score"] * 100, 2), # Convert to percentage
        "activeAlerts": 8, # placeholder
        "riskTrend": [
            {"name": "May 12", "total": 40000, "fraud": 10000},
            {"name": "May 13", "total": 30000, "fraud": 8000},
            {"name": "May 14", "total": 45000, "fraud": 12000},
            {"name": "May 15", "total": 27800, "fraud": 9000},
            {"name": "May 16", "total": 18900, "fraud": 4800},
            {"name": "May 17", "total": 23900, "fraud": 3800},
            {"name": "May 18", "total": 34900, "fraud": 4300},
            {"name": "May 19", "total": 40000, "fraud": 15000},
        ],
        "riskDistribution": [
            {"name": "Low Risk", "value": 72.1, "color": "#4ade80"},
            {"name": "Medium Risk", "value": 18.7, "color": "#facc15"},
            {"name": "High Risk", "value": 7.5, "color": "#f97316"},
            {"name": "Critical Risk", "value": 1.7, "color": "#ef4444"},
        ]
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
