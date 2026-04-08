from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.invoice import Invoice
from app.models.contact import Contact
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])


def _next_invoice_number(db: Session) -> str:
    last = db.query(Invoice).order_by(Invoice.id.desc()).first()
    num = (last.id + 1) if last else 1
    return f"INV-{num:05d}"


def _enrich(inv: Invoice) -> dict:
    import json
    return {
        "id": inv.id,
        "invoice_number": inv.invoice_number,
        "contact_id": inv.contact_id,
        "contact_snapshot": inv.contact_snapshot,
        "amount": inv.amount,
        "paid_amount": inv.paid_amount,
        "status": inv.status,
        "invoice_type": inv.invoice_type,
        "items": inv.items,
        "notes": inv.notes,
        "issue_date": inv.issue_date,
        "due_date": inv.due_date,
        "created_at": inv.created_at,
        "contact_name": inv.contact.name if inv.contact else (json.loads(inv.contact_snapshot).get('name') if inv.contact_snapshot else "Unknown"),
        "contact_phone": inv.contact.phone if inv.contact else (json.loads(inv.contact_snapshot).get('phone') if inv.contact_snapshot else "Unknown"),
    }


@router.get("", response_model=List[InvoiceResponse])
def list_invoices(
    status: Optional[str] = Query(None),
    contact_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(Invoice)
    if status:
        q = q.filter(Invoice.status == status)
    if contact_id:
        q = q.filter(Invoice.contact_id == contact_id)
    invoices = q.order_by(Invoice.created_at.desc()).all()
    return [_enrich(i) for i in invoices]


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return _enrich(inv)


@router.post("", response_model=InvoiceResponse)
def create_invoice(data: InvoiceCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    import json
    contact_id = data.contact_id
    contact_snapshot = data.contact_snapshot

    if contact_id and not contact_snapshot:
        contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if contact:
            contact_snapshot = json.dumps({
                "name": contact.name,
                "phone": contact.phone,
                "address": getattr(contact, 'address', '')
            })

    inv_num = data.invoice_number or _next_invoice_number(db)

    # Check uniqueness if provided
    if data.invoice_number:
        existing = db.query(Invoice).filter(Invoice.invoice_number == inv_num).first()
        if existing:
            raise HTTPException(status_code=400, detail="Invoice number already exists")

    inv = Invoice(
        invoice_number=inv_num,
        invoice_type=data.invoice_type or "course",
        contact_id=contact_id,
        contact_snapshot=contact_snapshot,
        amount=data.amount,
        items=data.items,
        notes=data.notes,
        issue_date=data.issue_date or datetime.now(timezone.utc),
        due_date=data.due_date,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return _enrich(inv)


@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(invoice_id: int, data: InvoiceUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(inv, key, value)
    db.commit()
    db.refresh(inv)
    return _enrich(inv)


@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    db.delete(inv)
    db.commit()
    return {"message": "Invoice deleted"}
