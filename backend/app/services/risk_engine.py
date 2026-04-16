import structlog
from app.core.config import settings
from app.db.models import Decision

logger = structlog.get_logger()

class RiskEngine:
    def __init__(self):
        self.ml_weight = settings.ML_WEIGHT
        self.ip_weight = settings.IP_WEIGHT
        self.behavior_weight = settings.BEHAVIOR_WEIGHT

    def combine_scores(self, ml_score: float, ip_score: float, behavior_score: float):
        """
        Weighted average of engine scores.
        """
        final_score = (
            (ml_score * self.ml_weight) +
            (ip_score * self.ip_weight) +
            (behavior_score * self.behavior_weight)
        )

        reasons = []
        if ml_score > 0.7:
            reasons.append("High risk verdict from ML model")
        if ip_score > 0.7:
            reasons.append("Suspicious IP reputation")
        if behavior_score > 0.5:
            reasons.append("Anomalous behavioral patterns detected")

        # Threshold logic
        if final_score >= 0.7:
            decision = Decision.BLOCK
        elif final_score >= 0.4:
            decision = Decision.REVIEW
        else:
            decision = Decision.ALLOW

        logger.info(
            "risk_evaluation_complete", 
            final_score=final_score, 
            decision=decision
        )

        return {
            "final_score": round(final_score, 4),
            "decision": decision,
            "reasons": reasons,
            "weights": {
                "ml": self.ml_weight,
                "ip": self.ip_weight,
                "behavior": self.behavior_weight
            }
        }

risk_engine = RiskEngine()
