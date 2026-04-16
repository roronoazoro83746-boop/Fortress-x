import asyncio
from datetime import datetime
import structlog

logger = structlog.get_logger()

class BehaviorEngine:
    async def detect_anomalies(self, transaction: dict) -> float:
        """
        Evaluates behavioral patterns.
        """
        logger.info("behavior_check_start")
        await asyncio.sleep(0.05)

        risk_score = 0.0
        user_id = transaction.get("user_id", "guest")
        
        # 1. High Frequency Check (Simulation)
        if user_id.startswith("heavy_"):
            logger.warning("high_frequency_detected", user_id=user_id)
            risk_score += 0.4

        # 2. Unusual Time (e.g., 2 AM - 4 AM)
        hour = datetime.utcnow().hour
        if 2 <= hour <= 4:
            logger.warning("unusual_transaction_time", hour=hour)
            risk_score += 0.2

        # 3. Device Mismatch (Simulation)
        if not transaction.get("device_id"):
            logger.warning("missing_device_id")
            risk_score += 0.3

        final_score = min(risk_score, 1.0)
        logger.info("behavior_check_complete", score=final_score)
        return final_score

behavior_engine = BehaviorEngine()
