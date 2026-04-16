import asyncio
import structlog
from app.services.ml_engine import ml_engine
from app.services.ip_intelligence import ip_engine
from app.services.behavior_engine import behavior_engine
from app.services.risk_engine import risk_engine

logger = structlog.get_logger()

class FraudOrchestrator:
    async def evaluate_transaction(self, transaction: dict):
        """
        Coordinates the fraud evaluation pipeline.
        Runs specific engines in parallel for performance.
        """
        logger.info("orchestration_started", transaction_id=transaction.get("id"))

        # Parallel execution of context-less engines
        results = await asyncio.gather(
            ml_engine.predict(transaction),
            ip_engine.get_ip_risk(transaction.get("ip_address", "")),
            behavior_engine.detect_anomalies(transaction),
            return_exceptions=True
        )

        # Unpack results
        ml_score, ip_score, behavior_score = results

        # Handle potential engine failures (not shown here in full for brevity)
        if isinstance(ml_score, Exception):
            logger.error("ml_engine_failed", error=str(ml_score))
            ml_score = 0.5 # Neutral risk on failure

        # Decision phase
        evaluation = risk_engine.combine_scores(
            ml_score=ml_score,
            ip_score=ip_score,
            behavior_score=behavior_score
        )

        logger.info(
            "orchestration_complete", 
            transaction_id=transaction.get("id"),
            decision=evaluation["decision"]
        )

        return {
            "ml_score": ml_score,
            "ip_score": ip_score,
            "behavior_score": behavior_score,
            **evaluation
        }

fraud_orchestrator = FraudOrchestrator()
