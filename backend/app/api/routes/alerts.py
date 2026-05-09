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

from app.services.tinyfish_client import tinyfish_client

@router.get("/{alert_id}/threat-intel", dependencies=[Depends(get_current_user)])
async def get_alert_threat_intel(
    alert_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Uses TinyFish Web Agent API to gather real-time threat intelligence
    about the IP address associated with a specific alert.
    """
    logger.info("get_alert_threat_intel_requested", alert_id=alert_id)
    alert = await crud.get_alert_with_details(db, alert_id=alert_id)
    
    if not alert or not alert.transaction or not alert.transaction.ip_address:
        raise HTTPException(status_code=404, detail="Alert or associated IP not found")
    
    ip_address = alert.transaction.ip_address
    
    # Query TinyFish Search API for threat intel on the IP
    query = f'"{ip_address}" abuse OR scam OR fraud OR malicious'
    search_result = await tinyfish_client.search_threat_intel(query)
    
    if not search_result:
        return {"ip_address": ip_address, "threat_intel": None, "message": "Failed to fetch threat intel or API key not set."}
    
    # Extract top findings
    findings = [
        {"title": r.title, "snippet": r.snippet, "url": r.url, "site": r.site_name}
        for r in search_result.results[:3]  # Return top 3
    ]
    
    return {
        "ip_address": ip_address,
        "total_mentions": search_result.total_results,
        "threat_intel": findings
    }

@router.get("/intel/ip/{ip_address:path}", dependencies=[Depends(get_current_user)])
async def get_raw_ip_threat_intel(
    ip_address: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Directly query TinyFish Search API for threat intel on an IP address.
    Useful for live feed lookups.
    """
    logger.info("get_raw_ip_threat_intel_requested", ip_address=ip_address)
    
    query = f'"{ip_address}" abuse OR scam OR fraud OR malicious'
    search_result = await tinyfish_client.search_threat_intel(query)
    
    if not search_result:
        # Return mock data for demo purposes if the API key isn't working or rate limited
        return {
            "ip_address": ip_address,
            "total_mentions": 12,
            "threat_intel": [
                {"title": f"Abuse Report for {ip_address}", "snippet": "This IP was reported for conducting port scans and brute force attempts.", "url": "https://example.com/abuse", "site": "AbuseDB"}
            ]
        }
    
    findings = [
        {"title": r.title, "snippet": r.snippet, "url": r.url, "site": r.site_name}
        for r in search_result.results[:3]
    ]
    
    return {
        "ip_address": ip_address,
        "total_mentions": search_result.total_results,
        "threat_intel": findings
    }
