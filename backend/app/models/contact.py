from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Date, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)

    contact_type = Column(String(50), default="individual") # individual, school, college, company
    contact_person = Column(String(100), nullable=True) # For schools/colleges
    parent_id = Column(Integer, ForeignKey("contacts.id"), nullable=True) # E.g. A contact belongs to an organization

    aadhar_number = Column(String(12), nullable=True)
    dob = Column(Date, nullable=True)
    current_degree = Column(String(100), nullable=True)
    enrollment_number = Column(String(50), nullable=True)
    profile_photo_path = Column(String(255), nullable=True)

    # Education history stored as JSON: [{stream, passing_year, college, enrollment_no, percentage}]
    education_history = Column(JSON, nullable=True)

    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=True)
    seat_number = Column(Integer, nullable=True)

    enrollment_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    course = relationship("Course", back_populates="contacts")
    batch = relationship("Batch", back_populates="contacts")
    invoices = relationship("Invoice", back_populates="contact")
    reservations = relationship("Reservation", back_populates="contact")

    # Self-referential relationships
    parent = relationship("Contact", remote_side=[id], back_populates="children")
    children = relationship("Contact", back_populates="parent")
