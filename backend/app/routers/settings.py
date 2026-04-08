from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.setting import Setting
from app.schemas.setting import SettingUpdate
from app.core.security import require_admin
from typing import Dict

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("")
def get_all_settings(db: Session = Depends(get_db)):
    settings = db.query(Setting).all()
    return {s.key: s.value for s in settings}

@router.patch("")
def update_settings(
    payload: SettingUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    for key, value in payload.settings.items():
        db_setting = db.query(Setting).filter(Setting.key == key).first()
        if db_setting:
            db_setting.value = value
        else:
            db_setting = Setting(key=key, value=value)
            db.add(db_setting)
    db.commit()
    return {"message": "Settings updated successfully"}
