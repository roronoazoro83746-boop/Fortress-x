import structlog
from app.db import crud, models
from app.db.session import SessionLocal

logger = structlog.get_logger()

async def background_log_transaction(
    transaction_data: dict, 
    score_data: dict, 
    alert_data: dict = None
):
    """
    Handles database persistence in a separate background context.
    Ensures primary request latency is decoupled from DB roundtrips.
    """
    async with SessionLocal() as db:
        try:
            # 1. Save Transaction
            await crud.save_transaction(db, transaction_data)
            
            # 2. Save Score
            await crud.save_score(db, score_data)
            
            # 3. Create Alert if provided
            if alert_data:
                await crud.create_alert(db, alert_data)
                
            logger.info("background_persistence_complete", transaction_id=transaction_data["id"])
            
        except Exception as e:
            logger.error("background_persistence_failed", error=str(e), transaction_id=transaction_data["id"])
        finally:
            await db.close()
