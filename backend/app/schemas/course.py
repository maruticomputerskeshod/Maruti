from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: str
    fees: Decimal


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    fees: Optional[Decimal] = None
    is_active: Optional[bool] = None


class CourseResponse(CourseBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
