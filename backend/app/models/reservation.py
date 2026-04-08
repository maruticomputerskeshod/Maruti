from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    contact_name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=True)
    preferred_timing = Column(String(100), nullable=True)
    seat_number = Column(Integer, nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, confirmed, converted
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    contact = relationship("Contact", back_populates="reservations")
    course = relationship("Course", back_populates="reservations")
