from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.contact import Contact
from app.models.course import Course
from app.models.batch import Batch
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])


def _enrich(contact: Contact) -> dict:
    return {
        "id": contact.id,
        "name": contact.name,
        "phone": contact.phone,
        "email": contact.email,
        "address": contact.address,
        "contact_type": contact.contact_type,
        "contact_person": contact.contact_person,
        "parent_id": contact.parent_id,
        "aadhar_number": contact.aadhar_number,
        "dob": contact.dob,
        "current_degree": contact.current_degree,
        "enrollment_number": contact.enrollment_number,
        "profile_photo_path": contact.profile_photo_path,
        "education_history": contact.education_history,
        "course_id": contact.course_id,
        "batch_id": contact.batch_id,
        "seat_number": contact.seat_number,
        "enrollment_date": contact.enrollment_date,
        "created_at": contact.created_at,
        "course_name": contact.course.name if contact.course else None,
        "batch_name": contact.batch.name if contact.batch else None,
        "parent_name": contact.parent.name if contact.parent else None,
    }


@router.get("", response_model=List[ContactResponse])
def list_contacts(
    search: Optional[str] = Query(None),
    course_id: Optional[int] = Query(None),
    batch_id: Optional[int] = Query(None),
    timing: Optional[str] = Query(None),
    contact_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(Contact)
    if search:
        q = q.filter(
            (Contact.name.ilike(f"%{search}%")) | (Contact.phone.ilike(f"%{search}%"))
        )
    if course_id:
        q = q.filter(Contact.course_id == course_id)
    if batch_id:
        q = q.filter(Contact.batch_id == batch_id)
    if timing:
        q = q.join(Batch).filter(Batch.timing == timing)
    if contact_type:
        q = q.filter(Contact.contact_type == contact_type)

    contacts = q.order_by(Contact.created_at.desc()).all()
    return [_enrich(c) for c in contacts]


@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db), _=Depends(get_current_user)):
    contacts = db.query(Contact).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Type", "Phone", "Email", "Course", "Batch", "Enrollment Date", "Parent Organization"])
    for c in contacts:
        writer.writerow([
            c.id, c.name, c.contact_type, c.phone, c.email,
            c.course.name if c.course else "",
            c.batch.name if c.batch else "",
            c.enrollment_date.strftime("%Y-%m-%d") if c.enrollment_date else "",
            c.parent.name if c.parent else "",
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=contacts.csv"},
    )


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return _enrich(contact)


@router.post("", response_model=ContactResponse)
def create_contact(data: ContactCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contact = Contact(**data.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return _enrich(contact)


@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: int, data: ContactUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return _enrich(contact)


@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted"}
