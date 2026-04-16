from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import structlog

from app.db.session import get_db
from app.db import crud
from app.schemas.alert import AlertResponse
from app.core.security import validate_api_key

router = APIRouter()
logger = structlog.get_logger()

@router.get("/", response_model=List[AlertResponse], dependencies=[Depends(validate_api_key)])
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
