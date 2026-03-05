# 🛡 Safety Audit Observation (SAO) Platform

![Google Apps Script](https://img.shields.io/badge/Platform-Google%20Apps%20Script-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![UI](https://img.shields.io/badge/UI-Mobile%20First-blue)
![License](https://img.shields.io/badge/License-Internal-lightgrey)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-brightgreen)

---

# 📌 Overview

**Safety Audit Observation (SAO)** is a mobile-first industrial safety reporting system built using **Google Apps Script**.

The platform enables both **shop-floor workers** and **safety officers** to report, investigate, and track safety incidents across manufacturing lines.

The system consists of two integrated modules:

### 👷 Worker Alert System
Workers scan a **QR code placed on production lines** and instantly report safety concerns using a simple emoji-based interface.

### 🧑‍💼 Safety Officer Investigation System
Safety officers receive **instant email alerts** and open a structured investigation form to log root cause analysis, corrective actions, and closure.

All records are automatically stored in **Google Sheets**, images are stored in **Google Drive**, and analytics can be visualized in **Looker Studio dashboards**.

The goal is to replace manual reporting, WhatsApp messages, and scattered Excel files with a **centralized digital safety management system**.

---

# 🚀 Key Features

### Worker Safety Reporting
- QR based line identification
- One-click emoji reporting
- Ultra-simple mobile interface
- Automatic incident code generation
- Timestamped safety alerts

### Safety Officer Investigation
- Structured SAO investigation form
- Auto-filled incident details
- Image capture and documentation
- Root cause and corrective action tracking
- Status management (Open / Closed)

### Automated Notifications
- Email alerts sent instantly
- Direct investigation link included
- Incident code reference for tracking

### Data Management
- Centralized data logging
- Google Sheets database
- Google Drive image storage
- Duplicate submission prevention

### Analytics Ready
- Looker Studio dashboards
- Trend analysis
- Safety KPI tracking
- Incident monitoring

---

# 🏗 System Architecture

```
Factory Worker
     │
     │  (QR Scan)
     ▼
Quick Safety Alert Web App
     │
     │  (Incident Code Generated)
     ▼
Google Sheets (Quick_Alerts)
     │
     │  Email Notification
     ▼
Safety Officer
     │
     │  Investigation Form
     ▼
SAO Investigation Web App
     │
     ▼
Google Sheets (SAO_Log)
     │
     ▼
Looker Studio Dashboard
```

---

# 🧰 Tech Stack

| Component | Technology |
|---|---|
| Frontend | HTML + CSS + Vanilla JavaScript |
| Backend | Google Apps Script |
| Database | Google Sheets |
| File Storage | Google Drive |
| Hosting | Apps Script Web App |
| Dashboard | Looker Studio |
| Asset Hosting | GitHub CDN |

---

# 📂 Project Structure

```
Safety-Audit-Observation/
│
├── code.gs           # Backend logic
├── index.html        # Safety Officer investigation form
├── quick.html        # Worker alert interface
├── assets/           # UI images and icons
└── README.md
```

---

# ⚙️ System Setup Guide

Follow the setup steps exactly.

---

# 1️⃣ Google Sheet Setup

Create a new spreadsheet.

```
SAO System
```

Create the following sheets:

```
SAO_Log
Quick_Alerts
MASTER
```

---

## SAO_Log (Investigation Records)

| Column | Header |
|---|---|
| A | Timestamp |
| B | Audit Date |
| C | Incident Code |
| D | Plant |
| E | Department |
| F | Line |
| G | Location/Area |
| H | Shift |
| I | Auditor |
| J | Supervisor |
| K | Observation Type |
| L | Injury Type |
| M | Injury Point |
| N | Employee Name |
| O | Contractor |
| P | Root Cause |
| Q | Action Taken |
| R | Remark |
| S | Image Link |
| T | Image Preview |
| U | Responsibility |
| V | Action Plan |
| W | Target Date |
| X | Status |
| Y | Kaizen Scope |

---

## Quick_Alerts (Worker Reports)

| Column | Header |
|---|---|
| A | Timestamp |
| B | Incident Code |
| C | Plant |
| D | Line |
| E | Alert Type |
| F | Status |

---

## MASTER (Safety Metrics)

| Metric | Value |
|---|---|
| Last Injury Date |  |
| Injury Free Days | Formula |
| Lost Time Injury % | Manual |
| Lost Time Incident % | Manual |

---

# 2️⃣ Google Drive Setup (Image Storage)

Create a folder:

```
SAO Images
```

Copy the folder ID:

```
https://drive.google.com/drive/folders/FOLDER_ID
```

Paste inside `code.gs`:

```javascript
const IMAGE_FOLDER_ID = "PASTE_FOLDER_ID_HERE";
```

---

# 3️⃣ Apps Script Setup

1. Open Spreadsheet  
2. Go to **Extensions → Apps Script**  
3. Delete default files  
4. Create files:

```
code.gs
index.html
quick.html
```

Paste the project code.

---

# 4️⃣ Deploy Web App

Apps Script → Deploy → New Deployment

| Setting | Value |
|---|---|
| Type | Web App |
| Execute As | Me |
| Access | Anyone |

Copy the Web App URL.

---

# 5️⃣ QR Code Setup for Production Lines

Each production line should have a **unique QR code**.

Example QR URL:

```
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?mode=quick&plant=Plant_1&line=K8%20Fairing
```

When scanned:

- Line automatically detected
- Worker reports issue instantly

---

# 🔒 Duplicate Submission Protection

Three-level protection is implemented.

| Layer | Protection |
|---|---|
| UI | Submit button disabled |
| Client | isSaving state lock |
| Server | LockService transaction lock |

This prevents duplicate records caused by network delays or repeated taps.

---

# 📸 Image Handling

Images are captured directly from the device camera.

Workflow:

1. Image captured on mobile
2. Converted to Base64
3. Uploaded to Google Drive
4. File link stored in Sheets
5. Preview generated automatically

---

# 📊 Safety Dashboard

Looker Studio can be connected to **SAO_Log** for analytics such as:

- Incident trends
- Line-wise safety performance
- Root cause distribution
- Near miss tracking
- Safety KPI monitoring

---

# ⚡ Example Workflow

```
Worker scans QR
      ↓
Emoji safety alert sent
      ↓
System generates incident code
      ↓
Safety officer receives email
      ↓
Investigation form auto loads incident
      ↓
Root cause and action recorded
      ↓
Incident status closed
```

---

# 📈 System Capacity

Typical supported scale:

| Metric | Capacity |
|---|---|
| Incidents per year | ~5,000 |
| Total records | 100,000+ |
| Concurrent users | 50+ |
| Images stored | 60,000+ |

Suitable for **large manufacturing plants**.

---

# 🛠 Planned Improvements

- Safety officer control dashboard
- Automated reminders for open incidents
- Role based access
- Incident severity classification
- Mobile offline queue
- AI-assisted root cause suggestions

---

# 👨‍💻 Author

**Yash Aparajit**

Industrial Automation & Safety Digitization Project.

Designed to simplify safety reporting and improve incident response across manufacturing environments.

---

# 📄 License

Internal Use Only

This project is intended for internal industrial safety systems and is not meant for public redistribution.
