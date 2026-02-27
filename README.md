# 🛡 Safety Audit Observation (SAO) Web App

![Google Apps Script](https://img.shields.io/badge/Platform-Google%20Apps%20Script-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![UI](https://img.shields.io/badge/UI-Mobile%20First-blue)
![License](https://img.shields.io/badge/License-Internal-lightgrey)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-brightgreen)

---

## 📌 Overview

**Safety Audit Observation (SAO)** is a mobile-first web application built using **Google Apps Script** for capturing safety observations directly from the shop floor.

The system allows auditors and supervisors to:

- Record safety observations
- Capture images instantly
- Assign responsibility
- Track corrective actions
- Maintain centralized audit records automatically in Google Sheets

Designed for **industrial environments**, optimized for **speed, clarity, and zero duplicate submissions**.

---

## 🚀 Features

✅ Mobile-first UI  
✅ Searchable Line selection  
✅ Dynamic form fields 
✅ Image capture & Drive storage  
✅ Duplicate submission prevention  
✅ Auto timestamp logging  
✅ Status tracking workflow  
✅ Clean enterprise UI/UX  
✅ Google Workspace native integration  

---

## 🏗 System Architecture

Operator (Mobile)
↓
Apps Script Web App
↓
Google Sheets (Database)
↓
Google Drive (Image Storage)


---

## 🧰 Tech Stack

| Component | Technology |
|---|---|
| Frontend | HTML + CSS + Vanilla JS |
| Backend | Google Apps Script |
| Database | Google Sheets |
| File Storage | Google Drive |
| Hosting | Apps Script Web App |

---

## 📂 Project Structure

SAO-App/
│
├── code.gs # Backend logic
├── index.html # UI + client logic
└── README.md


---

## ⚙️ Setup Guide

Follow steps **exactly**.

---

**# 1️⃣ Google Sheet Setup**

Create a new Google Spreadsheet.

### Rename spreadsheet:
SAO System

### Create Sheet:  
SAO_Log


---

### Add Header Row (Row 1)

| Column | Header |
|---|---|
| A | Timestamp |
| B | Plant |
| C | Line |
| D | Line Location/Area |
| E | Shift |
| F | Auditor Name |
| G | Supervisor Name |
| H | Observation Type |
| I | Injury Point |
| J | Employee Name |
| K | Employee Contractor |
| L | Root Cause |
| M | Action Taken |
| N | NC Observation Remark |
| O | Image Link |
| P | Image Preview |
| Q | Responsibility |
| R | Action Plan |
| S | Target Date |
| T | Status |

---

**# 2️⃣ Google Drive Setup (Image Storage)**

### Step 1
Create folder in Google Drive:
SAO Images


### Step 2
Open folder → copy Folder ID from URL:


### Step 3
Paste into `code.gs`:

```javascript
const IMAGE_FOLDER_ID = "PASTE_FOLDER_ID_HERE";

---

**# 3️⃣ Apps Script Setup**

Open Spreadsheet

Extensions → Apps Script

Delete default files

Create:
code.gs
index.html

---

**# 4️⃣ Deploy Web App**

---

🔒 Duplicate Submission Protection

Three-level protection implemented:

Layer	Protection
| Layer  | Protection                     |
| ------ | ------------------------------ |
| UI     | Button disabled while saving   |
| Client | `isSaving` state lock          |
| Server | `LockService` transaction lock |
This prevents accidental double entries.

---

**📸 Image Handling**

Images are:
-Captured from device camera
-Converted to Base64
-Uploaded to Drive folder
-Stored as link in Sheet
-Preview auto-generated

---

**🛠 Future Improvements**

-Dashboard view
-Status update panel
-Email notifications
-Analytics charts
-Role-based access
-Offline submission queue

