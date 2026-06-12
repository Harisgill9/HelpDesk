# IUB Online Help Desk Portal

**Student Name:** Ahmed Ali  
**Roll No:** F24BDOCS1M0001  
**Course:** Web Technologies  
**Semester:** 4th  
**Section:** 1M  

---

## Project Description

The IUB Online Help Desk Portal is a web application built for Islamia University of Bahawalpur. It allows students to submit applications and requests online, and admins to manage and respond to those requests.

---

## Features

### Student Panel
- University portal landing page with links to E-Portal, My IUB, IUB Alumni and Help Desk
- Secure login with Roll No and Password
- Submit applications (Degree Issuance, Transcript, Leave, Fee Correction, Hostel, Scholarship, Bonafide Certificate)
- View application format guide
- Track submitted applications with status (Pending, Resolved, Rejected)
- Filter applications by type

### Admin Panel
- Separate admin login
- View all student applications
- Search by student name or roll no
- Filter by status and type
- Approve or Reject applications
- Add admin notes to applications
- Delete applications
- View statistics (Total, Pending, Resolved, Rejected)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 |
| JavaScript | Plain JavaScript |
| Backend | JSON Server |
| Data Format | JSON |

---

## How to Install and Run

### Step 1 — Install JSON Server
Open CMD and run:
npm install -g json-server


### Step 2 — Start JSON Server
Open CMD in project folder and run:
npx json-server --watch db.json 

### Step 3 — Open Project
Open `index.html` using Live Server in VS Code

---

## Demo Credentials

### Student Login
| Field | Value |
|---|---|
| Roll No | F24BDOCS1M0001 |
| Password | 123456 |

### Admin Login
| Field | Value |
|---|---|
| Roll No | ADMIN-001 |
| Password | admin123 |

---
## Project Structure
Semester_Project/

├── index.html       ← Landing page + Student panel

├── admin.html       ← Admin panel

├── style.css        ← All styles

├── app.js           ← Student panel JavaScript

├── admin.js         ← Admin panel JavaScript

├── db.json          ← JSON Server database

└── README.md        ← This file


## Notes
- JSON Server must be running before opening the project
- Live Server must ignore db.json changes (add to VS Code settings)