import asyncio
import random
import structlog

logger = structlog.get_logger()

class MLEngine:
    def __init__(self):
        self.name = "ML_Engine_v1"

    async def predict(self, transaction: dict) -> float:
        """
        Simulates ML inference.
        Higher amount generally increases risk score in this mock.
        """
        logger.info("ml_inference_start", engine=self.name)
        
        # Simulate network latency
        await asyncio.sleep(0.1)

        amount = transaction.get("amount", 0)
        
        # Mock logic: base risk 0.1, increase by 0.1 for every 1000 units
        base_risk = 0.1
        amount_risk = min(amount / 10000, 0.6)
        
        # Add a tiny bit of randomness
        random_factor = random.uniform(0, 0.1)
        
        final_score = min(base_risk + amount_risk + random_factor, 1.0)
        
        logger.info("ml_inference_complete", score=final_score)
        return final_score

ml_engine = MLEngine()
