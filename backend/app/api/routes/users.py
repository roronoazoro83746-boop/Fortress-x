from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db import crud
from app.core.security import get_current_admin

router = APIRouter()

@router.get("/", dependencies=[Depends(get_current_admin)])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves a paginated list of users. Admin only.
    """
    users = await crud.get_all_users(db, skip=skip, limit=limit)
    return users
