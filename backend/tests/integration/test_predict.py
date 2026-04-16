import pytest
from app.api.api_v1 import api_router
from app.db.models import Decision

@pytest.mark.asyncio
async def test_predict_normal(client, auth_header):
    payload = {
        "user_id": "normal_user_1",
        "amount": 100.0,
        "currency": "USD",
        "ip_address": "192.168.1.10",
        "device_id": "phone_1"
    }
    response = await client.post("/api/v1/predict/", json=payload, headers=auth_header)
    
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == Decision.ALLOW
    assert "transaction_id" in data
    assert data["score"] < 0.4

@pytest.mark.asyncio
async def test_predict_fraud(client, auth_header):
    # '1.1.1.1' is simulated as a TOR node in ip_intelligence.py
    # 'heavy_' prefix is simulated as high velocity in behavior_engine.py
    payload = {
        "user_id": "heavy_scammer_99",
        "amount": 50000.0,
        "currency": "USD",
        "ip_address": "1.1.1.1",
        "device_id": "hacker_box"
    }
    response = await client.post("/api/v1/predict/", json=payload, headers=auth_header)
    
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] in [Decision.REVIEW, Decision.BLOCK]
    assert data["score"] > 0.5
    assert len(data["explanation"]) > 0

@pytest.mark.asyncio
async def test_predict_unauthorized(client):
    payload = {
        "user_id": "test",
        "amount": 10.0
    }
    # No auth header
    response = await client.post("/api/v1/predict/", json=payload)
    assert response.status_code == 403
