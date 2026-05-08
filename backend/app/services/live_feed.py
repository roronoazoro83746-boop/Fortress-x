import asyncio
import json
import uuid
import random
import structlog
import websockets
from app.services.fraud_orchestrator import fraud_orchestrator
from app.utils.persistence_worker import background_log_transaction
from app.api.routes.websockets import manager
from app.db.session import async_sessionmaker, engine, AsyncSession
from app.db import crud

logger = structlog.get_logger()

MOCK_USERS = [f"user_{i}" for i in range(1, 101)]
MOCK_IPS = [f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}" for _ in range(50)]
MOCK_IPS.append("192.168.1.100") # Deliberately add a recognizable IP that might flag rules if implemented

async def get_latest_dashboard_data():
    SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
    async with SessionLocal() as db:
        metrics = await crud.get_public_metrics(db)
        alerts_db = await crud.get_all_alerts(db, skip=0, limit=5)
        alerts = [
            {
                "id": a.id,
                "transaction_id": a.transaction_id,
                "severity": a.severity,
                "reason": a.reason,
                "status": a.status,
                "created_at": a.created_at.isoformat()
            } for a in alerts_db
        ]
        
        # We also need the auth-metrics style for the Dashboard
        auth_metrics = await crud.get_dashboard_metrics(db)
        risk_trend = await crud.get_historical_risk_trend(db)
        risk_dist = await crud.get_risk_distribution(db)
        
        return {
            "type": "dashboard_update",
            "metrics": {
                "totalScans": auth_metrics["total_transactions"],
                "fraudBlocked": auth_metrics["fraud_detected"],
                "avgRiskScore": round(auth_metrics["avg_risk_score"] * 100, 2),
                "activeAlerts": len(alerts), # using recent alerts count as proxy
                "riskTrend": risk_trend,
                "riskDistribution": risk_dist
            },
            "publicMetrics": {
                "transactionsAnalyzed": metrics["transactions_analyzed"],
                "activeUsers": metrics["active_users"],
                "threatsBlocked": metrics["threats_blocked"],
                "avgRiskScore": round(metrics["avg_risk_score"] * 100, 2),
            },
            "alerts": alerts
        }

async def process_binance_trade(trade_data):
    try:
        price = float(trade_data.get('p', 0))
        quantity = float(trade_data.get('q', 0))
        amount = price * quantity
        
        if amount < 100:
            return

        transaction_id = str(uuid.uuid4())
        
        transaction_data = {
            "id": transaction_id,
            "user_id": random.choice(MOCK_USERS),
            "amount": amount,
            "currency": "USD",
            "ip_address": random.choice(MOCK_IPS),
            "device_id": f"device_{random.randint(1, 20)}",
            "metadata_json": {"source": "binance_live", "symbol": trade_data.get('s')}
        }

        result = await fraud_orchestrator.evaluate_transaction(transaction_data)

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

        await background_log_transaction(transaction_data, score_data, alert_data)
        
        # Only broadcast if there are connected clients
        if manager.active_connections:
            update_payload = await get_latest_dashboard_data()
            await manager.broadcast(update_payload)

    except Exception as e:
        logger.error("error_processing_live_trade", error=str(e))

async def live_feed_task():
    uri = "wss://stream.binance.com:9443/ws/btcusdt@trade"
    while True:
        try:
            logger.info("connecting_to_binance_ws")
            async with websockets.connect(uri) as websocket:
                while True:
                    message = await websocket.recv()
                    trade_data = json.loads(message)
                    
                    asyncio.create_task(process_binance_trade(trade_data))
                    
                    # Process 1 trade every 2 seconds
                    await asyncio.sleep(2)
        except Exception as e:
            logger.error("live_feed_connection_error", error=str(e))
            await asyncio.sleep(5)
