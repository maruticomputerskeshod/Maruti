from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.vacancy import Vacancy
from app.schemas.vacancy import VacancyCreate, VacancyUpdate, VacancyResponse

router = APIRouter(prefix="/api/vacancies", tags=["Vacancies"])


@router.get("", response_model=List[VacancyResponse])
def list_vacancies(
    search: Optional[str] = Query(None),
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    q = db.query(Vacancy)
    if active_only:
        q = q.filter(Vacancy.is_active == True)
    if search:
        q = q.filter(
            (Vacancy.title.ilike(f"%{search}%")) | (Vacancy.description.ilike(f"%{search}%"))
        )
    return q.order_by(Vacancy.created_at.desc()).all()


@router.get("/{vacancy_id}", response_model=VacancyResponse)
def get_vacancy(vacancy_id: int, db: Session = Depends(get_db)):
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return vacancy


@router.post("", response_model=VacancyResponse)
def create_vacancy(data: VacancyCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    vacancy = Vacancy(**data.model_dump())
    db.add(vacancy)
    db.commit()
    db.refresh(vacancy)
    return vacancy


@router.put("/{vacancy_id}", response_model=VacancyResponse)
def update_vacancy(vacancy_id: int, data: VacancyUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(vacancy, key, value)
    db.commit()
    db.refresh(vacancy)
    return vacancy


@router.delete("/{vacancy_id}")
def delete_vacancy(vacancy_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    db.delete(vacancy)
    db.commit()
    return {"message": "Vacancy deleted"}
