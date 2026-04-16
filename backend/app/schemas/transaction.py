from pydantic import BaseModel, Field, IPvAnyAddress
from typing import List, Optional, Dict
from datetime import datetime
from app.db.models import Decision

class TransactionBase(BaseModel):
    user_id: str = Field(..., example="user_123")
    amount: float = Field(..., gt=0, example=250.50)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    ip_address: Optional[IPvAnyAddress] = Field(None, example="192.168.1.1")
    device_id: Optional[str] = Field(None, example="device_xyz_789")
    metadata: Optional[Dict] = Field(default_factory=dict)

class TransactionCreate(TransactionBase):
    pass

class EngineTrace(BaseModel):
    ml_score: float
    ip_score: float
    behavior_score: float

class PredictionResponse(BaseModel):
    transaction_id: str
    score: float
    decision: Decision
    explanation: List[str]
    trace: EngineTrace
    timestamp: datetime = Field(default_factory=datetime.utcnow)
