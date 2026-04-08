from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.core.config import get_settings
from app.routers import auth, courses, vacancies, contacts, batches, reservations, invoices, dashboard, settings

# Import all models so they are registered with Base
from app.models import user, course, vacancy, contact, batch, reservation, invoice, setting  # noqa

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Maruti Computer API",
    description="Backend API for Maruti Computer Training Institute",
    version="1.0.0",
)

@app.on_event("startup")
def startup_event():
    if os.getenv("SEED_DB") == "true":
        from app.initial_data import init_db
        print("Running database seeding...")
        init_db()

settings_conf = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings_conf.ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(vacancies.router)
app.include_router(contacts.router)
app.include_router(batches.router)
app.include_router(reservations.router)
app.include_router(invoices.router)
app.include_router(dashboard.router)
app.include_router(settings.router)


@app.get("/")
@app.head("/")
def root():
    return {"message": "Maruti Computer API is running"}


@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok"}
