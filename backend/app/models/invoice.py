from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, nullable=False)
    invoice_type = Column(String(20), default="course") # course, jobwork
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=True) # Nullable for jobwork or record persistence
    contact_snapshot = Column(Text, nullable=True) # Storing full details (name, phone) at time of issuance
    amount = Column(Numeric(10, 2), nullable=False)
    paid_amount = Column(Numeric(10, 2), default=0)
    status = Column(String(20), default="unpaid") # paid, unpaid, partial
    items = Column(Text, nullable=True) # JSON string of line items
    notes = Column(Text, nullable=True)
    issue_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    contact = relationship("Contact", back_populates="invoices")
