from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.batch import Batch
from app.models.batch import Batch
from app.models.contact import Contact
from app.models.course import Course
from app.schemas.batch import BatchCreate, BatchUpdate, BatchResponse, BatchWithContactsResponse

router = APIRouter(prefix="/api/batches", tags=["Batches"])


def _enrich(batch: Batch, db: Session) -> dict:
    count = db.query(Contact).filter(Contact.batch_id == batch.id).count()
    return {
        "id": batch.id,
        "name": batch.name,
        "timing": batch.timing,
        "start_date": batch.start_date,
        "max_contacts": batch.max_contacts,
        "is_active": batch.is_active,
        "created_at": batch.created_at,
        "contact_count": count,
    }


@router.get("", response_model=List[BatchResponse])
def list_batches(
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(Batch)
    if active_only:
        q = q.filter(Batch.is_active == True)
    batches = q.order_by(Batch.created_at.desc()).all()
    return [_enrich(b, db) for b in batches]


@router.get("/{batch_id}", response_model=BatchResponse)
def get_batch(batch_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return _enrich(batch, db)


@router.post("", response_model=BatchResponse)
def create_batch(data: BatchCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    batch = Batch(**data.model_dump())
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return _enrich(batch, db)


@router.put("/{batch_id}", response_model=BatchResponse)
def update_batch(batch_id: int, data: BatchUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(batch, key, value)
    db.commit()
    db.refresh(batch)
    return _enrich(batch, db)


@router.delete("/{batch_id}")
def delete_batch(batch_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    db.delete(batch)
    db.commit()
    return {"message": "Batch deleted"}
@router.get("/{batch_id}/seats")
def get_batch_seats(batch_id: int, db: Session = Depends(get_db)):
    """Get list of occupied seats in a batch."""
    contacts = db.query(Contact).filter(Contact.batch_id == batch_id).all()
    occupied = [c.seat_number for c in contacts if c.seat_number is not None]
    return {"occupied": occupied}
