# Maruti Computer – Project Overview

A professional, full-stack management and public-facing platform for the **Maruti Computer Education Academy**. This project integrates a high-performance administrative suite with a premium customer-facing website, designed for scalability and modern user experience.

---

## 🏛️ Project Architecture

The system is built as a decoupled full-stack application, containerized for consistent deployment.

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) – A performant, SEO-optimized React framework.
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python) – A modern, high-performance web framework for building APIs.
- **Database**: [PostgreSQL](https://www.postgresql.org/) – Relational database for persistent storage.
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) – Powerful database abstraction layer.
- **Containerization**: [Docker](https://www.docker.com/) – Multi-container setup via Docker Compose.

---

## ✨ Key Features

### 1. Unified Contact Registry
A generalized registry system that replaces the traditional "Student" model. It supports:
- **Hierarchical Management**: Individuals, Schools, Colleges, and Companies.
- **Parent-Child Relationships**: Associate students with their respective schools or parent organizations.
- **Detailed Profiles**: Capture education history, Aadhar details, and course enrollment status.

### 2. Strategic Invoicing System
A robust financial dashboard for generating and tracking institute revenue.
- **Dual Flow**: Supports both **Course Admission** and **Jobwork/Services**.
- **Live Preview**: Real-time PDF preview of invoices before submission.
- **Financial Registry**: Persistent history of all transactions with easy "View & Print" capabilities.
- **Historical Snapshots**: Preserves contact and course data at the time of issuance for accurate auditing.

### 3. Lab & Reservation Management
Interactive seat management for the computer laboratory.
- **Timing-Based Synchronization**: Multiple batches sharing the same time slot share the same physical laboratory layout.
- **Visual Grid**: Drag-and-drop-style assignment of seats to students.
- **Lead Tracking**: Manage pending inquiries and convert them into active enrollments.

### 4. Dynamic CMS & Website Settings
Empower administrators to manage public content without touching code.
- **Course Management**: Update fees, descriptions, and durations.
- **Vacancy Board**: Post and manage local job opportunities for students.
- **Global Settings**: Configure contact info, institute taglines, and integrated Google Maps.

---

## 🚀 Tech Stack Details

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Logic** | Python 3.12 | Rapid development and strong data handling. |
| **UI** | React / Next.js | Server-side rendering for fast initial loads. |
| **Styling** | Vanilla CSS / TailWind | Precise control over the "Atelier" design system. |
| **Auth** | JWT / OAuth2 | Secure, stateless authentication for the Admin Suite. |
| **DevOps** | Docker Compose | One-command setup for dev and production. |

---

## 🛠️ Getting Started

### Development Setup
1. **Environment**: Configure `.env` in both `backend` and `frontend` folders.
2. **Launch**:
   ```bash
   docker-compose up --build
   ```
3. **Database Seeding**:
   ```bash
   docker exec -it maruti-backend-1 python seed.py
   ```

### Default Admin Access
- **URL**: `http://localhost:3000/admin`
- **Credentials**: Standard credentials defined in `.env`

---

## 🎨 Design Philosophy: "Atelier"
The project follows a bespoke design system characterized by:
- **Harmony**: Use of Evergreen, Moss, and Berry color palettes.
- **Typography**: Elegant serif headings (Outfit/Playfair) paired with clean sans-serif body text.
- **Aesthetics**: Glassmorphism, subtle micro-animations, and high-fidelity layouts that feel premium and trustworthy.
