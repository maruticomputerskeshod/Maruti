from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime, date


class ContactBase(BaseModel):
    name: str  # Renamed from full_name
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None

    contact_type: Optional[str] = "individual"
    contact_person: Optional[str] = None
    parent_id: Optional[int] = None

    # Individual/Specific fields
    aadhar_number: Optional[str] = None
    dob: Optional[date] = None
    current_degree: Optional[str] = None
    enrollment_number: Optional[str] = None
    profile_photo_path: Optional[str] = None
    education_history: Optional[List[dict]] = None
    course_id: Optional[int] = None
    batch_id: Optional[int] = None
    seat_number: Optional[int] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    contact_type: Optional[str] = None
    contact_person: Optional[str] = None
    parent_id: Optional[int] = None

    aadhar_number: Optional[str] = None
    dob: Optional[date] = None
    current_degree: Optional[str] = None
    enrollment_number: Optional[str] = None
    profile_photo_path: Optional[str] = None
    education_history: Optional[List[dict]] = None
    course_id: Optional[int] = None
    batch_id: Optional[int] = None
    seat_number: Optional[int] = None


class ContactResponse(ContactBase):
    id: int
    enrollment_date: datetime
    created_at: datetime
    course_name: Optional[str] = None
    batch_name: Optional[str] = None
    parent_name: Optional[str] = None # For displaying the school/org name

    class Config:
        from_attributes = True
