from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AlertResponse(BaseModel):
    id: int
    transaction_id: str
    severity: str
    reason: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
