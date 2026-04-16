import pytest
from app.services.ml_engine import ml_engine
from app.services.risk_engine import risk_engine
from app.db.models import Decision

@pytest.mark.asyncio
async def test_ml_engine_risk_scaling():
    # Test low amount
    low_risk = await ml_engine.predict({"amount": 100})
    # Test high amount
    high_risk = await ml_engine.predict({"amount": 20000})
    
    assert high_risk > low_risk
    assert 0.0 <= low_risk <= 1.0
    assert 0.0 <= high_risk <= 1.0

def test_risk_engine_decision_thresholds():
    # Case 1: All clear -> ALLOW
    res_allow = risk_engine.combine_scores(ml_score=0.1, ip_score=0.1, behavior_score=0.1)
    assert res_allow["decision"] == Decision.ALLOW
    
    # Case 2: High ML risk -> BLOCK (or REVIEW depending on weight)
    # ML weight is 0.5. 0.9 * 0.5 = 0.45 (Enough for REVIEW)
    res_review = risk_engine.combine_scores(ml_score=0.9, ip_score=0.0, behavior_score=0.0)
    assert res_review["decision"] == Decision.REVIEW
    
    # Case 3: High across the board -> BLOCK
    res_block = risk_engine.combine_scores(ml_score=0.9, ip_score=0.9, behavior_score=0.9)
    assert res_block["decision"] == Decision.BLOCK

def test_risk_engine_reasoning():
    res = risk_engine.combine_scores(ml_score=0.8, ip_score=0.8, behavior_score=0.8)
    assert len(res["reasons"]) >= 3
    assert "High risk verdict from ML model" in res["reasons"]
