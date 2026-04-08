"""Seed script – populates the database from seed_data.json."""
import sys
import os
import json
from datetime import datetime, timezone
from decimal import Decimal
from dotenv import load_dotenv

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.core.config import get_settings
from app.models.user import User
from app.models.course import Course
from app.models.vacancy import Vacancy
from app.models.batch import Batch
from app.models.setting import Setting

load_dotenv()
settings = get_settings()

def seed():
    print("🚀 Starting database seeding from JSON...")

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Load JSON data
        seed_file = os.path.join(os.path.dirname(__file__), "seed_data.json")
        with open(seed_file, "r") as f:
            data = json.load(f)

        # --- 1. Seed Admin User ---
        admin_user = db.query(User).filter(User.username == settings.ADMIN_USER).first()
        if not admin_user:
            print(f"Seeding admin user: {settings.ADMIN_USER}")
            db.add(User(
                username=settings.ADMIN_USER,
                email=settings.ADMIN_EMAIL,
                full_name="Administrator",
                role="admin",
                hashed_password=hash_password(settings.ADMIN_PASS),
                is_active=True
            ))
            db.commit()
            print("✓ Admin user seeded")

        # --- 2. Seed Courses ---
        for c_data in data.get("courses", []):
            course = db.query(Course).filter(Course.name == c_data["name"]).first()
            if not course:
                print(f"Seeding course: {c_data['name']}")
                new_course = Course(
                    name=c_data["name"],
                    description=c_data["description"],
                    duration=c_data["duration"],
                    fees=Decimal(str(c_data["fees"])),
                    is_active=c_data.get("is_active", True)
                )
                db.add(new_course)
                db.commit()
                db.refresh(new_course)

                # Automatically seed batches for this course using the standard slots
                for slot in data.get("batch_slots", []):
                    batch_name = f"{new_course.name} - {slot}"
                    batch = Batch(
                        name=batch_name,
                        timing=slot,
                        course_id=new_course.id,
                        start_date=datetime.now(timezone.utc),
                        max_contacts=30,
                        is_active=True
                    )
                    db.add(batch)
                db.commit()
        print("✓ Courses and associated Batches seeded")

        # --- 3. Seed Vacancies ---
        for v_data in data.get("vacancies", []):
            exists = db.query(Vacancy).filter(Vacancy.title == v_data["title"]).first()
            if not exists:
                print(f"Seeding vacancy: {v_data['title']}")
                db.add(Vacancy(
                    title=v_data["title"],
                    description=v_data["description"],
                    eligibility=v_data["eligibility"],
                    deadline=datetime.strptime(v_data["deadline"], "%Y-%m-%d").date(),
                    location=v_data["location"]
                ))
        db.commit()
        print("✓ Vacancies seeded")

        # --- 4. Seed Settings ---
        for s_data in data.get("settings", []):
            exists = db.query(Setting).filter(Setting.key == s_data["key"]).first()
            if not exists:
                db.add(Setting(key=s_data["key"], value=s_data["value"]))
            else:
                exists.value = s_data["value"] # Update existing settings
        db.commit()
        print("✓ Settings seeded/updated")

        print("\n🎉 Database seeded successfully from JSON!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
