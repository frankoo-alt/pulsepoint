# PulsePoint 🩸🩺
### Integrated Healthcare, Pharmacy Stock, Diagnostic Lab Booking & Secure Blood Bank Hub

> **Healthcare Innovation Hackathon Prototype**  
> *A high-contrast, accessible medical platform featuring role-based access control (RBAC), real-time chemist inventory, diagnostic scheduling, and a cryptographically verified inter-facility emergency blood transfer pipeline.*

---

## 🌟 Executive Summary & Key Highlights

In critical medical emergencies, seconds matter. Hospitals often struggle with fragmented inventory registries, delayed blood crossmatching, and manual telephone coordination. Meanwhile, patients face difficulty finding local pharmacy dispensaries carrying urgent prescription medicines or securing laboratory test appointments.

**PulsePoint** solves this by unifying four vital healthcare modules into a single, high-contrast, accessible medical platform:
1. **Public Pharmacy Stock Finder**: Real-time chemist stock status (`In Stock`, `Low Stock`, `Out of Stock`), comparative retail prices, and 4-hour hold reservations.
2. **Diagnostic Lab Booking Engine**: Fast-track booking for pathology and radiology screenings (CMP, Chest X-Ray, Lipid Profile, HbA1c, Thyroid, Ultrasound) with pre-test fasting guidance and digital booking passes.
3. **Aggregated Public Blood Availability Hub**: Regional blood reserve status with HIPAA/GDPR privacy masking (sensitive storage racks and donor PII are completely redacted).
4. **Voluntary Donor Portal & Emergency Standby**: Clinical donor triage (age, weight, donation cooldown), instant holographic Digital Donor ID card, and live Level 1 trauma alert response dispatch.
5. **Restricted Hospital / Blood Bank Admin Portal**: Authenticated medical officer view with exact cold-chain freezer racks, sensor temperatures (`3.8°C`), pathogen clearance stamps, and an **Inter-Facility Blood Transfer Pipeline** that generates cryptographic tracking tokens (`PP-TX-...`).

---

## 🗂️ Project Architecture & Directory Structure

```text
tm_zero/
├── index.html                   # Semantic HTML5 entry point with accessible ARIA hierarchy
├── assets/
│   ├── logo.png                 # PulsePoint medical emblem (cyan pulse + crimson heart/cross)
│   └── hero_banner.jpg          # High-resolution healthcare platform banner
├── styles/
│   ├── main.css                 # Medical blue & white design tokens, glassmorphism, alerts
│   ├── components.css           # Modular component styling (cards, tables, steppers, badges)
│   └── responsive.css           # Mobile breakpoints, touch targets & print stylesheet
├── js/
│   ├── app.js                   # Application lifecycle orchestrator & reactive subscriptions
│   ├── store.js                 # Central state manager (RBAC, mutations, local persistence)
│   ├── mockData.js              # Seeded medical datasets matching database schema
│   └── components/
│       ├── navbar.js            # Top emergency broadcast ticker, nav tabs, role switcher
│       ├── pharmacy.js          # Medicine lookup, chemist comparison, hold reservation
│       ├── diagnostics.js       # Diagnostic test catalog, 7-day calendar, slot booking pass
│       ├── bloodPublic.js       # Aggregated supply meters, privacy shield, compatibility grid
│       ├── donorPortal.js       # Donor registration, eligibility checks, emergency alerts
│       └── hospitalAdmin.js     # Restricted cold-chain racks, transfer pipeline & steppers
├── database/
│   ├── schema.sql               # Production-grade PostgreSQL / MySQL relational DDL
│   ├── seed.sql                 # SQL seed data matching real-world clinical inventories
│   └── models.md                # Entity relationship documentation & HIPAA privacy policy
├── server/
│   └── serve.ps1                # Lightweight PowerShell local static HTTP server
└── README.md                    # Project documentation & presentation guide
```

---

## 🔐 Role-Based Access Control (RBAC) & Privacy Guardrails

| Module / Action | 👤 Public Patient | 🩸 Voluntary Donor | 🏥 Verified Hospital Admin |
| :--- | :---: | :---: | :---: |
| Search Medicines & Compare Chemist Prices | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| Reserve Medication for Pharmacy Pickup | ✅ 4-Hour Hold | ✅ 4-Hour Hold | ✅ Full Access |
| Schedule Diagnostic Lab Appointments | ✅ Instant Pass | ✅ Instant Pass | ✅ View Schedules |
| View Regional Aggregated Blood Group Stock | ✅ Aggregated | ✅ Aggregated | ✅ Exact Counts |
| View Sensitive Cold-Chain Freezer Unit Codes | 🛑 Masked | 🛑 Masked | ✅ Full Rack View |
| Register as Voluntary Donor & Generate Pass | ❌ Needs Form | ✅ Manage Profile | ✅ Emergency Directory |
| Respond to Trauma Emergency Blood Need | ❌ Register First | ✅ Direct Dispatch | ✅ Broadcast Alerts |
| Raise Inter-Facility Blood Requisition | 🛑 Forbidden | 🛑 Forbidden | ✅ Passkey Required |
| Advance Logistics Courier Status Stepper | 🛑 Forbidden | 🛑 Forbidden | ✅ Full Authorization |
| Update Medicine Inventory / Add New Drug | 🛑 Forbidden | 🛑 Forbidden | ✅ Live Stepper & Editor |

### 🛡️ HIPAA & GDPR Data Privacy Separation
1. **Public Anonymization**: The public blood hub displays only regional health meters (e.g. `O- : Critical Low Stock`). Sensitive storage vault codes (e.g. `CRYOBANK-A / TANK-02`) and pathogen screening officers are never exposed on public endpoints.
2. **Donor PII Redaction**: Voluntary donor contact numbers are masked (`98451*****`) across public views. Unmasked data is restricted to verified medical dispatchers during active trauma alerts.
3. **Cryptographic Chain of Custody**: Inter-facility requisitions produce a SHA-style logistics tracking token (e.g. `PP-TX-7994-O-NEG-COLD-CHAIN-VERIFIED-9812A`) monitoring storage temperature (`3.8°C - 4.2°C`) during courier transit.

---

## 🚀 Quickstart & Demo Walkthrough

### 1. Launching the Local Server
To start the application locally with HTTP module support:

```powershell
# In PowerShell inside the project directory:
powershell -ExecutionPolicy Bypass -File server/serve.ps1
```
The server will start at `http://localhost:8080` (or fallback to `8085` if port 8080 is in use).

### 2. Hackathon Demo Credentials
* **Public Patient**: Open portal directly — all search, comparative pricing, lab booking, and blood overview tools work immediately out-of-the-box.
* **Voluntary Donor**: Select **"Voluntary Donor"** in the top navigation role dropdown to view your digital donor badge or register a new donor profile.
* **Verified Hospital Admin**:
  * Select **"Hospital Admin (Restricted)"** in the navigation or role switcher.
  * Enter Medical Authorization Passkey:  
    `MED-AUTH-9082`  
    *(A convenient 1-click **"Autofill"** button is provided in the security modal for rapid hackathon evaluations).*

---

## 🧪 Interactive Walkthrough of Core Modules

### 💊 Module A: Pharmacy Finder & Comparative Pricing
1. Type `Amoxicillin`, `Metformin`, `Lipitor`, or `Ventolin` in the live search bar.
2. Click category filters (`Antibiotics`, `Antidiabetic`, `Cardiovascular`, `Pain & Fever`).
3. Toggle the **"Show In-Stock Dispensaries Only"** switch.
4. Click **"Compare Chemist Prices"** to view comparative price differences between Apollo Chemist, Metro Health, and City Care.
5. Click **"Hold / Reserve"** to simulate placing a 4-hour reservation hold.

### 🧪 Module B: Diagnostic Lab Booking
1. Click **"Diagnostic Lab Booking"** in the navigation.
2. Select a diagnostic panel (e.g. *Comprehensive Metabolic & Blood Panel* or *Chest X-Ray*).
3. Notice dynamic pre-test instructions (e.g. *10-Hour Fasting Required* vs *No Fasting*).
4. Click through the **7-Day Date Picker Chips** and select an appointment time slot.
5. Click **"Confirm Appointment"** to generate the digital medical pass with an appointment reference code (`PP-LAB-XXXXXX`) and click **"Print Digital Pass"**.

### 🩸 Module C: Public Blood Availability Hub
1. Click **"Blood Availability"** in the navigation.
2. Review aggregated regional stats and the 8 blood group cards (O+, O-, A+, A-, B+, B-, AB+, AB-).
3. Notice alert badges (`CRITICAL LOW`, `OPTIMAL`, `LOW SUPPLY`) with color-coded gauge fill bars.
4. Review the **Clinical Blood Compatibility Matrix** explaining donor-recipient match rules.

### 🙋 Module D: Voluntary Donor Hub
1. Click **"Voluntary Donor Hub"**.
2. Complete the donor registration form with your blood type, age, and weight.
3. An instant **Holographic Digital Donor Pass** is generated with unique donor code and on-call availability status.
4. In the **Live Trauma Emergency Alerts** section, click **"I Can Donate Now"** on an active alert to simulate emergency response dispatch.

### 🔒 Module E: Verified Hospital Admin (Private View)
1. Switch role to **"Verified Hospital Admin"** and authenticate with passkey `MED-AUTH-9082`.
2. **Cold-Chain Blood Bank Racks**: View unmasked storage freezer codes (`CRYOBANK-A / TANK-01`), real-time sensor temperature (`3.8°C`), and pathogen clearance stamps. Use the `+` and `-` steppers to modify unit counts.
3. **Inter-Facility Transfer Pipeline**:
   * Raise a new emergency requisition for a specific blood type and priority (`CODE RED`).
   * Watch the stock matching algorithm find available regional units and deduct from bank inventory.
   * Review the generated cryptographic tracking token and click **"Advance Logistics Status"** through the 5-stage pipeline (`PENDING_REVIEW` ➔ `STOCK_MATCHED` ➔ `COURIER_DISPATCHED` ➔ `IN_TRANSIT` ➔ `DELIVERED`).
4. **Pharmacy Stock & Schedule Manager**: Toggle stock status (`In Stock`, `Low Stock`, `Out of Stock`), edit retail prices, or click **"+ Add New Medicine Batch"**.

---

## 🗄️ Relational Database Schema

PulsePoint includes a clean PostgreSQL/MySQL relational database schema in [`database/schema.sql`](database/schema.sql) and seed data in [`database/seed.sql`](database/seed.sql):
* `healthcare_facilities`: Hospitals, blood banks, diagnostic centers, and pharmacies.
* `medicines`: Dispensary stock, pricing, formulation, batches, and reorder levels.
* `diagnostic_tests` & `lab_slots`: Test catalog, fasting constraints, capacity, and scheduling.
* `lab_bookings`: Patient reservations and reference identifiers.
* `blood_inventory`: Private cold-chain freezer racks, temperatures, and pathogen clearance records.
* `voluntary_donors`: Voluntary donors with encrypted contact vaults and safety cooldown limits.
* `emergency_blood_alerts`: Broadcasted Level 1 trauma requirements.
* `secure_hospital_requests`: Inter-facility blood transfer pipeline with cryptographic logistics tokens.
* `security_audit_logs`: HIPAA-compliant audit trail of all access and dispatch operations.

---

## 🏆 Hackathon Innovation Summary
PulsePoint eliminates bureaucratic bottlenecks during medical crises by combining public accessibility with enterprise-grade clinical security:
* **Zero Dependencies for Local Execution**: Runs directly with vanilla web standards and a built-in PowerShell server.
* **High-Contrast Medical Aesthetic**: Designed for high clarity, accessibility, and intuitive emergency operations.
* **End-to-End Workflow**: Covers the entire lifecycle from patient medicine search to inter-hospital cold-chain blood transfer.
