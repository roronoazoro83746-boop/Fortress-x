import enum
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Float, ForeignKey, DateTime, Enum as SQLEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Decision(str, enum.Enum):
    ALLOW = "ALLOW"
    REVIEW = "REVIEW"
    BLOCK = "BLOCK"

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, index=True)
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    device_id: Mapped[Optional[str]] = mapped_column(String)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Metadata for additional context
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, default={})

    # Relationships
    score: Mapped["Score"] = relationship(back_populates="transaction", uselist=False)
    alerts: Mapped[List["Alert"]] = relationship(back_populates="transaction")

class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    transaction_id: Mapped[str] = mapped_column(String, ForeignKey("transactions.id"), unique=True)
    
    # Internal scores
    ml_score: Mapped[float] = mapped_column(Float)
    ip_score: Mapped[float] = mapped_column(Float)
    behavior_score: Mapped[float] = mapped_column(Float)
    
    # Final outcome
    final_score: Mapped[float] = mapped_column(Float)
    decision: Mapped[Decision] = mapped_column(SQLEnum(Decision), default=Decision.ALLOW)
    
    # Audit trail: Weights used at time of calculation
    ml_weight: Mapped[float] = mapped_column(Float)
    ip_weight: Mapped[float] = mapped_column(Float)
    behavior_weight: Mapped[float] = mapped_column(Float)
    
    reasons: Mapped[Optional[List[str]]] = mapped_column(JSON, default=[])
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    transaction: Mapped["Transaction"] = relationship(back_populates="score")

class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    transaction_id: Mapped[str] = mapped_column(String, ForeignKey("transactions.id"))
    
    severity: Mapped[str] = mapped_column(String) # LOW, MEDIUM, HIGH
    reason: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="OPEN") # OPEN, RESOLVED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    transaction: Mapped["Transaction"] = relationship(back_populates="alerts")
