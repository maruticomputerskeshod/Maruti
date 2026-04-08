from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.contact import Contact
from app.models.course import Course
from app.models.batch import Batch
from app.models.reservation import Reservation
from app.models.invoice import Invoice
from app.models.vacancy import Vacancy

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return {
        "total_contacts": db.query(Contact).count(),
        "total_courses": db.query(Course).filter(Course.is_active == True).count(),
        "total_batches": db.query(Batch).filter(Batch.is_active == True).count(),
        "pending_reservations": db.query(Reservation).filter(Reservation.status == "pending").count(),
        "unpaid_invoices": db.query(Invoice).filter(Invoice.status == "unpaid").count(),
        "active_vacancies": db.query(Vacancy).filter(Vacancy.is_active == True).count(),
        "total_revenue": float(
            db.query(Invoice).with_entities(
                __import__("sqlalchemy").func.coalesce(__import__("sqlalchemy").func.sum(Invoice.paid_amount), 0)
            ).scalar()
        ),
    }
