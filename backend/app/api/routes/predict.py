import uuid
import structlog
from fastapi import APIRouter, Depends, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.transaction import TransactionCreate, PredictionResponse, EngineTrace
from app.services.fraud_orchestrator import fraud_orchestrator
from app.core.security import validate_api_key, limiter
from app.db.session import get_db
from app.db import models
from app.utils.persistence_worker import background_log_transaction

router = APIRouter()
logger = structlog.get_logger()

@router.post("/", response_model=PredictionResponse, dependencies=[Depends(validate_api_key)])
@limiter.limit("10/minute")
async def predict_fraud(
    request: Request, # Required by slowapi
    payload: TransactionCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db) 
):
    """
    Evaluates a transaction for potential fraud.
    
    Performance Optimizations:
    - Parallel engine orchestration.
    - Asynchronous DB persistence (Background Tasks).
    - Rate limiting to prevent engine overload.
    """
    transaction_id = str(uuid.uuid4())
    logger.info("predict_endpoint_called", transaction_id=transaction_id)

    # 1. Prepare data for backgrounding
    transaction_data = payload.model_dump()
    transaction_data["id"] = transaction_id
    if transaction_data["ip_address"]:
        transaction_data["ip_address"] = str(transaction_data["ip_address"])

    # 2. Execute Orchestration (The "Heavy" Sync/Async part)
    # This remains inline as we need the result for the response
    result = await fraud_orchestrator.evaluate_transaction(transaction_data)

    # 3. Prepare Scores & Alerts for background processing
    score_data = {
        "transaction_id": transaction_id,
        "ml_score": result["ml_score"],
        "ip_score": result["ip_score"],
        "behavior_score": result["behavior_score"],
        "final_score": result["final_score"],
        "decision": result["decision"],
        "reasons": result["reasons"],
        "ml_weight": result["weights"]["ml"],
        "ip_weight": result["weights"]["ip"],
        "behavior_weight": result["weights"]["behavior"]
    }

    alert_data = None
    if result["final_score"] > 0.75:
        severity = "MEDIUM"
        if result["final_score"] > 0.9: severity = "CRITICAL"
        elif result["final_score"] > 0.8: severity = "HIGH"
        
        alert_data = {
            "transaction_id": transaction_id,
            "severity": severity,
            "reason": "; ".join(result["reasons"]) if result["reasons"] else "Automated threshold breach"
        }

    # 4. Offload persistence to background tasks to return response immediately
    background_tasks.add_task(
        background_log_transaction,
        transaction_data=transaction_data,
        score_data=score_data,
        alert_data=alert_data
    )

    # 5. Return immediate response
    return PredictionResponse(
        transaction_id=transaction_id,
        score=result["final_score"],
        decision=result["decision"],
        explanation=result["reasons"],
        trace=EngineTrace(
            ml_score=result["ml_score"],
            ip_score=result["ip_score"],
            behavior_score=result["behavior_score"]
        )
    )
