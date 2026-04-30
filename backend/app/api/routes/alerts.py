from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import structlog

from app.db.session import get_db
from app.db import crud
from app.schemas.alert import AlertResponse
from app.core.security import get_current_user

router = APIRouter()
logger = structlog.get_logger()

@router.get("/", response_model=List[AlertResponse], dependencies=[Depends(get_current_user)])
async def list_alerts(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves all security alerts.
    Requires X-API-Key header.
    """
    logger.info("list_alerts_requested", skip=skip, limit=limit)
    alerts = await crud.get_all_alerts(db, skip=skip, limit=limit)
    return alerts

from fastapi import HTTPException

@router.get("/{alert_id}", dependencies=[Depends(get_current_user)])
async def get_alert(
    alert_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves a specific security alert with its transaction and score details.
    """
    logger.info("get_alert_requested", alert_id=alert_id)
    alert = await crud.get_alert_with_details(db, alert_id=alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {
        "id": alert.id,
        "transaction_id": alert.transaction_id,
        "severity": alert.severity,
        "reason": alert.reason,
        "status": alert.status,
        "created_at": alert.created_at,
        "transaction": {
            "amount": alert.transaction.amount,
            "currency": alert.transaction.currency,
            "user_id": alert.transaction.user_id,
            "ip_address": alert.transaction.ip_address,
            "timestamp": alert.transaction.timestamp,
        } if alert.transaction else None,
        "score": {
            "final_score": alert.transaction.score.final_score,
            "ml_score": alert.transaction.score.ml_score,
            "ip_score": alert.transaction.score.ip_score,
            "behavior_score": alert.transaction.score.behavior_score,
            "decision": alert.transaction.score.decision,
            "reasons": alert.transaction.score.reasons,
        } if alert.transaction and alert.transaction.score else None
    }
