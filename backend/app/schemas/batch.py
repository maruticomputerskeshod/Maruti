from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BatchBase(BaseModel):
    name: str
    timing: str
    start_date: Optional[datetime] = None
    max_contacts: int = 30


class BatchCreate(BatchBase):
    pass


class BatchUpdate(BaseModel):
    name: Optional[str] = None
    timing: Optional[str] = None
    start_date: Optional[datetime] = None
    max_contacts: Optional[int] = None
    is_active: Optional[bool] = None


class BatchResponse(BatchBase):
    id: int
    is_active: bool
    created_at: datetime
    contact_count: int = 0

    class Config:
        from_attributes = True


class BatchWithContactsResponse(BatchResponse):
    contacts: List[dict]
    is_active: bool
    created_at: datetime
    contact_count: int = 0

    class Config:
        from_attributes = True
