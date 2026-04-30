from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db import crud
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", dependencies=[Depends(get_current_user)])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves a paginated list of transactions.
    """
    transactions = await crud.get_all_transactions(db, skip=skip, limit=limit)
    return transactions
