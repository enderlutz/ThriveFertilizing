from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.task import TaskCreate, TaskStatusUpdate, TaskRead
import services.task_service as svc

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
async def list_tasks(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    return await svc.list_tasks(db, status=status, priority=priority, assigned_to=assigned_to, limit=limit, offset=offset)


@router.post("", response_model=TaskRead, status_code=201)
async def create_task(data: TaskCreate, db: AsyncSession = Depends(get_db)):
    return await svc.create_task(db, data)


@router.put("/{task_id}/status", response_model=TaskRead)
async def update_task_status(task_id: UUID, data: TaskStatusUpdate, db: AsyncSession = Depends(get_db)):
    task = await svc.update_task_status(db, task_id, data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
