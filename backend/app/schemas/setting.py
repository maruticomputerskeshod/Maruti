from pydantic import BaseModel
from typing import Dict

class SettingBase(BaseModel):
    key: str
    value: str

class SettingCreate(BaseModel):
    key: str
    value: str

class SettingUpdate(BaseModel):
    settings: Dict[str, str]

class Setting(BaseModel):
    key: str
    value: str

    class Config:
        from_attributes = True
