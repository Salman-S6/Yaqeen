# Yaqeen (يَقِين) — Digital Government Services Platform

<div align="center">

**A modern, secure digital platform enabling Syrian citizens to obtain official government documents remotely.**

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?logo=php)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://mysql.com)
[![License](https://img.shields.io/badge/License-Academic-blue)](#)

</div>

---

## Overview

**Yaqeen** (Arabic: يَقِين — _certainty_) is a semester project developed at AL-Sham Private University. It is a full-stack digital government services platform that replaces Syria's paper-based, manually-operated civil document system with a secure, AI-assisted, semi-automated pipeline.

Citizens can remotely request official documents (family statements, civil registration extracts, etc.) through a Flutter mobile app, while employees review requests via a React.js web dashboard. All issued documents are signed with a digital signature and embedded with a verifiable QR code.

---

## Key Features

| Feature                              | Description                                                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **AI-Powered Identity Verification** | OCR engine (Python/Gemini) extracts data from ID images at registration; system auto-accepts if ≥70% match |
| **Digital Signatures (RSA/ECDSA)**   | All issued documents are cryptographically signed                                                          |
| **Offline QR Verification**          | Anyone can verify document authenticity without internet — public key is embedded in the Flutter app       |
| **Automatic Load Balancing**         | New requests are auto-assigned to the least-busy employee                                                  |
| **Admin Analytics Dashboard**        | SLA monitoring, OCR performance, audit logs, team efficiency metrics                                       |
| **Role-Based Access Control**        | Granular permissions via Spatie (admin / employee / citizen)                                               |
| **Async Email Notifications**        | Queue-based email notifications with retry logic (3 attempts)                                              |
| **Full Audit Trail**                 | Every create/update/delete action is logged with IP address and user agent                                 |

---

## System Architecture

```
┌─────────────────┐     ┌────────────────────────┐      ┌─────────────────┐
│   Flutter App   │────▶│   Laravel 12 API       │────▶│     MySQL       │
│   (Citizens)    │     │                        │      │   (Database)    │
└─────────────────┘     │  • Sanctum Auth        │      └─────────────────┘
                        │  • Spatie Permissions  │
┌─────────────────┐     │  • Service Layer       │      ┌─────────────────┐
│   React.js Web  │────▶│  • Queue System        │────▶│  Python OCR     │
│  (Employees &   │     │  • Digital Signatures  │      │   (Subprocess)  │
│    Admin)       │     └────────────────────────┘      └─────────────────┘
└─────────────────┘
```

### Request Lifecycle

```
[Registration — once]
Citizen uploads ID image
    → OCR extraction (Python/Gemini)
    → Data matching (≥70% required)
    → Account auto-created and verified

[Service Request]
Citizen selects service type
    → System fetches pre-verified data from DB (no re-upload)
    → Duplicate check
    → Auto-assigned to least-busy employee
    → Employee reviews visually + approves/rejects
    → On approval: Document record + RSA-signed QR code generated
    → Email notification sent (queued)
    → Citizen exports PDF locally in Flutter (no server-side PDF storage)
```

---

## Technology Stack

| Layer                  | Technology                                  |
| ---------------------- | ------------------------------------------- |
| **Backend API**        | Laravel 12 (PHP 8.x)                        |
| **Authentication**     | Laravel Sanctum (Token-based)               |
| **Authorization**      | Spatie Laravel Permission                   |
| **Database**           | MySQL 8.0                                   |
| **Frontend Web**       | React.js + Vite                             |
| **Mobile App**         | Flutter (Dart)                              |
| **AI / OCR**           | Python (Google Gemini)                      |
| **Digital Signatures** | OpenSSL (RSA 2048-bit)                      |
| **QR Verification**    | ECDSA / RSA + Base64 payload (offline)      |
| **Email Queue**        | Laravel Queues (ShouldQueue)                |
| **PDF Export**         | Flutter-side only (pdf / printing packages) |
| **Secure Storage**     | flutter_secure_storage (public key)         |

---

## Project Structure

```
app/
├── Console/Commands/
│   └── GenerateRSAKeys.php          # Generate RSA key pair → writes to .env
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── RequestController.php
│   │   ├── AttachmentController.php
│   │   ├── EmployeeController.php
│   │   ├── NotificationController.php
│   │   ├── ServiceTypeController.php
│   │   └── Dashboards/Admin/        # Admin-specific controllers
│   ├── Middleware/
│   │   └── CheckPermission.php      # Permission-based route guard
│   ├── Requests/                    # Form Requests (validation)
│   └── Resources/                   # API Resources (response transformation)
├── Models/                          # Eloquent Models
├── Services/                        # Business Logic Layer
│   ├── AuthService.php
│   ├── RequestService.php
│   ├── AttachmentService.php
│   ├── OCRService.php               # Calls Python subprocess
│   ├── SignatureService.php         # RSA signing
│   ├── AutoAssignService.php        # Load balancing
│   ├── NotificationService.php
│   └── Dashboards/                  # Dashboard-specific services
├── Notifications/                   # Queued email notifications
├── Mail/                            # Mailable classes
└── Traits/
    └── Auditable.php                # Auto audit logging for all models

database/
├── migrations/                      # 17 migration files
└── seeders/
    ├── RolePermissionSeeder.php     # Roles + Permissions setup
    ├── AdminSeeder.php              # Default admin account
    └── ServiceTypeSeeder.php        # Sample service types

routes/
├── api.php                          # All API routes
└── web.php                          # Public QR verification route
```

---

## Installation & Setup

### Prerequisites

- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js 18+ (for frontend, optional)
- Python 3.9+ with required packages (for OCR)
- Redis (recommended for queues and cache)
- OpenSSL

### Step 1 — Clone & Install

```bash
git clone https://github.com/Salman-S6/Yaqeen.git
cd Yaqeen/laravel
composer install
```

### Step 2 — Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your configuration:

```env
# Python OCR Script Path
PYTHON_BINARY=python3
OCR_SCRIPT_PATH=/path/to/python_ocr/ocr.py

# OPENSSL_CNF_PATH=/your/path/to/openssl.cnf

# RSA Keys (populated automatically by keys:generate-rsa command)
PRIVATE_KEY=""
PUBLIC_KEY=""
```

### Step 3 — Database Setup

```bash
php artisan migrate
php artisan db:seed
```

This creates:

- All 17 database tables
- Roles: `admin`, `employee` and `citizen`
- Default admin account: `admin@yaqeen.test` / `Password@123`
- Sample service types

### Step 4 — Generate Digital Signature Keys

```bash
php artisan keys:generate-rsa
```

This generates an RSA 2048-bit key pair and writes `PRIVATE_KEY` and `PUBLIC_KEY` directly into your `.env` file.

### Step 5 — Start Queue Worker

The email notification system uses Laravel Queues. Start the worker:

```bash
php artisan queue:work --tries=3 --timeout=60
```

For production, use a process manager like **Supervisor**.

### Step 6 — Start the Server

```bash
php artisan serve
```

API base URL: `http://localhost:8000/api`

---

## API Overview

| Group              | Base Path              | Auth Required |
| ------------------ | ---------------------- | ------------- |
| Authentication     | `/api/auth/*`          | Partial       |
| Service Requests   | `/api/requests/*`      | ✓             |
| Attachments        | `/api/attachments/*`   | ✓             |
| Service Types      | `/api/service-types/*` | ✓             |
| Employee Dashboard | `/api/employee/*`      | ✓             |
| Notifications      | `/api/notifications/*` | ✓             |
| Admin Panel        | `/api/admin/*`         | ✓ + admin     |
| QR Verification    | `/verify`              | ✗ (public)    |

**Postman Collection**
For full endpoint details: [Postman Collection](https://drive.google.com/file/d/1FwcoTXdHMz_RqPoMkN9bgEcUjM_ldoxz/view?usp=sharing)

---

## Authentication Flow

All protected routes use **Bearer Token** authentication via Laravel Sanctum.

```http
Authorization: Bearer {your_token}
Accept: application/json
```

Obtain a token via `POST /api/auth/login` or `POST /api/auth/register`.

---

## Roles & Permissions

| Role       | Key Permissions                                                                |
| ---------- | ------------------------------------------------------------------------------ |
| `admin`    | All permissions                                                                |
| `employee` | `view_requests`, `approve_requests`, `reject_requests`, `process_requests`     |
| `citizen`  | `create_requests`, `view_requests`, `upload_attachments`, `view_service_types` |

Permissions are managed per-employee by the admin via `PUT /api/admin/employees/{id}/permissions`.

---

## Digital Signature & QR Verification

Documents are signed using **RSA with SHA-256**. The signed payload includes:

```json
{
    "data": {
        "document_id": 1,
        "request_number": "REQ-20260531-0001",
        "citizen_name": "مواطن",
        "national_id": "12345678901",
        "service": "إخراج قيد فردي",
        "issued_at": "2026-05-31T10:00:00Z"
    },
    "signature": "<base64-encoded-RSA-signature>",
    "verify_url": "https://yaqeen.sy/verify?req=1&p=<payload>&sig=<signature>"
}
```

**Verification is fully offline** — the Flutter app embeds the public key and verifies signatures locally without any server request.

---

## Environment Variables Reference

| Variable           | Description                        | Default                |
| ------------------ | ---------------------------------- | ---------------------- |
| `PYTHON_BINARY`    | Python executable name             | `python3`              |
| `OCR_SCRIPT_PATH`  | Absolute path to OCR Python script | `../python_ocr/ocr.py` |
| `PRIVATE_KEY`      | RSA private key (auto-generated)   | —                      |
| `PUBLIC_KEY`       | RSA public key (auto-generated)    | —                      |
| `OPENSSL_CNF_PATH` | OpenSSL config path                | —                      |
| `QUEUE_CONNECTION` | Queue driver                       | `database`             |

---

## Key Design Decisions

1. **No server-side PDF storage** — PDFs are generated client-side in Flutter. The server only stores the document record and signed QR payload. This reduces storage requirements and eliminates PDF tampering risks.

2. **Automated registration (no employee approval)** — Account verification is fully automated via OCR matching. Human review only happens at the service request stage.

3. **Polymorphic attachments** — The `attachments` table uses Laravel's polymorphic relations to support attaching files to different models (Citizen, Request) without schema changes.

4. **Atomic request numbering** — `Cache::increment()` ensures sequential, collision-free request numbers even under concurrent load.

5. **Audit logging via Eloquent events** — The `Auditable` trait hooks into `created/updated/deleted` model events globally, ensuring no action goes unrecorded.

---

## Semester Project Info

| Field          | Details                                  |
| -------------- | ---------------------------------------- |
| **University** | AL-Sham Private University               |
| **Department** | Information Engineering                  |
| **Supervisor** | Eng. Moaz Talab                          |
| **Team Size**  | 5 members                                |
| **Stack**      | Laravel + Flutter + React.js + Python AI |

---

<div align="center">
<sub>Yaqeen Platform — Semester Project 2026 · AL-Sham Private University — ASPU</sub>
</div>
