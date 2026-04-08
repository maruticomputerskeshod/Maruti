from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.reservation import Reservation
from app.models.contact import Contact
from app.models.batch import Batch
from app.schemas.reservation import ReservationCreate, ReservationResponse

router = APIRouter(prefix="/api/reservations", tags=["Reservations"])


@router.get("/occupied", response_model=List[int])
def get_occupied_seats(timing: str = Query(...), db: Session = Depends(get_db)):
    """Returns a list of occupied seat numbers for a specific timing."""
    timing = timing.strip()

    # 1. Seats from Contacts in batches that match this timing precisely
    contact_seats = db.query(Contact.seat_number).join(Batch).filter(
        Batch.timing == timing,
        Contact.seat_number != None
    ).all()

    # 2. Seats from Pending/Confirmed Reservations for this timing precisely
    reservation_seats = db.query(Reservation.seat_number).filter(
        Reservation.preferred_timing == timing,
        Reservation.status.in_(["pending", "confirmed"]),
        Reservation.seat_number != None
    ).all()

    # Flatten and combine
    occupied = {s[0] for s in contact_seats} | {s[0] for s in reservation_seats}
    return sorted(list(occupied))


def _enrich(r: Reservation) -> dict:
    return {
        "id": r.id,
        "contact_name": r.contact_name,
        "phone": r.phone,
        "course_id": r.course_id,
        "preferred_timing": r.preferred_timing,
        "message": r.message,
        "status": r.status,
        "created_at": r.created_at,
        "course_name": r.course.name if r.course else None,
    }


@router.get("", response_model=List[ReservationResponse])
def list_reservations(db: Session = Depends(get_db), _=Depends(get_current_user)):
    reservations = db.query(Reservation).order_by(Reservation.created_at.desc()).all()
    return [_enrich(r) for r in reservations]


@router.post("", response_model=ReservationResponse)
def create_reservation(data: ReservationCreate, db: Session = Depends(get_db)):
    """Public endpoint – anyone can reserve a seat."""
    reservation = Reservation(**data.model_dump())
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return _enrich(reservation)


@router.post("/{reservation_id}/convert")
def convert_to_contact(
    reservation_id: int,
    batch_id: int = Query(...),
    seat_number: int = Query(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    """Convert a reservation into a contact record with batch and seat."""
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")

    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if batch.course_id != res.course_id:
        raise HTTPException(status_code=400, detail="Batch does not belong to the reserved course")

    # Check if seat is already taken
    existing = db.query(Contact).filter(Contact.batch_id == batch_id, Contact.seat_number == seat_number).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Seat {seat_number} is already occupied in this batch")

    contact = Contact(
        name=res.contact_name,
        phone=res.phone,
        course_id=res.course_id,
        batch_id=batch_id,
        seat_number=seat_number
    )
    db.add(contact)
    res.status = "converted"
    db.commit()
    db.refresh(contact)
    return {"message": "Reservation converted to contact", "contact_id": contact.id}



@router.put("/{reservation_id}/status")
def update_status(reservation_id: int, status: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    res.status = status
    db.commit()
    return {"message": f"Status updated to {status}"}
