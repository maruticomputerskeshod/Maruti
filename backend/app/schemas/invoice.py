from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class InvoiceBase(BaseModel):
    contact_id: Optional[int] = None
    contact_snapshot: Optional[str] = None
    amount: Decimal
    invoice_type: Optional[str] = "course"
    items: Optional[str] = None # JSON string
    notes: Optional[str] = None
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None


class InvoiceCreate(InvoiceBase):
    invoice_number: Optional[str] = None


class InvoiceUpdate(BaseModel):
    amount: Optional[Decimal] = None
    paid_amount: Optional[Decimal] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    due_date: Optional[datetime] = None


class InvoiceResponse(InvoiceBase):
    id: int
    invoice_number: str
    paid_amount: Decimal
    status: str
    created_at: datetime
    contact_name: Optional[str] = None

    class Config:
        from_attributes = True
