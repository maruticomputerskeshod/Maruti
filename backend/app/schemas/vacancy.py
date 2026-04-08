from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class VacancyBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: Optional[date] = None
    location: Optional[str] = None


class VacancyCreate(VacancyBase):
    pass


class VacancyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: Optional[date] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None


class VacancyResponse(VacancyBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
