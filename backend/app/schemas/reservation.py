from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReservationBase(BaseModel):
    contact_name: str
    phone: str
    course_id: int
    preferred_timing: Optional[str] = None
    seat_number: Optional[int] = None
    message: Optional[str] = None


class ReservationCreate(ReservationBase):
    pass


class ReservationResponse(ReservationBase):
    id: int
    status: str
    created_at: datetime
    course_name: Optional[str] = None

    class Config:
        from_attributes = True
