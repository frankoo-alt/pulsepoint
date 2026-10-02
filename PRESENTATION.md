# PulsePoint 🩸🩺 &mdash; Official Presentation Deck & Pitch Script
### Integrated Healthcare, Pharmacy Stock, Diagnostic Lab Booking & Secure Blood Bank Hub

> **Presentation Deck URL**: Open [`presentation.html`](presentation.html) in any browser (or at `http://localhost:8080/presentation.html`)  
> **Live Web Application**: Open [`index.html`](index.html) or `http://localhost:8080`  
> **Interactive Features**: Arrow keys to switch slides, `F` for Fullscreen, `N` for Speaker Notes, and `Ctrl + P` to Export as PDF.

---

## ⏱️ 3-Minute Hackathon Pitch Script (Word-for-Word)

### Slide 1: Introduction & Hook (0:00 - 0:30)
> *"Judges, in acute medical emergencies, seconds determine whether a patient survives. Today, hospitals and patients face a critical paradox: we have world-class doctors, but our medical inventory and logistics operate in dark, fragmented silos.  
> We built **PulsePoint**—a unified healthcare platform bridging local chemist inventories, diagnostic lab appointments, regional blood supplies, and cryptographically verified inter-hospital cold-chain logistics."*

### Slide 2: The Problem (0:30 - 1:00)
> *"Consider what happens during a Level 1 trauma incident:  
> 1. Hospitals lose hours manually calling neighboring facilities to locate rare O-negative blood units.  
> 2. Discharged patients and family members run between 4 to 5 pharmacies desperately searching for in-stock critical antibiotics or insulin.  
> 3. Existing systems risk patient privacy or fail to verify cold-chain storage compliance during transit.  
> PulsePoint completely eliminates these bottlenecks."*

### Slide 3 - 5: Patient, Pharmacy & Diagnostic Labs (1:00 - 1:50)
> *"On the public side:  
> * **Module A (Pharmacy Finder)**: Patients search by brand or generic molecule like Amoxicillin or Metformin. They can compare real-time prices across licensed chemists and place an instant 4-hour reservation hold so the medicine is waiting for them.  
> * **Module B (Diagnostic Labs)**: Patients book screenings across 6 major pathology and radiology panels, receive pre-test fasting instructions, pick morning fasting slots, and generate a secure digital medical pass with barcode.  
> * **Module C & D (Blood Hub & Donors)**: The public monitors regional supply meters under strict HIPAA anonymization. Voluntary donors complete clinical triage to receive a holographic Digital Donor ID and can respond to urgent trauma broadcasts with one click."*

### Slide 6 - 7: Flagship Innovation & Cold-Chain Pipeline (1:50 - 2:35)
> *"Now to our core innovation: **The Verified Hospital Admin Portal**.  
> Protected by passkey authorization, authorized medical officers view unmasked cold-chain freezer vaults with real-time temperature probes at 3.8°C.  
> When an emergency occurs, hospitals initiate an **Inter-Facility Blood Requisition**. Our automated matching algorithm finds available units from regional banks, generates an immutable cryptographic SHA tracking token, and monitors the transfer across a 5-stage logistics status stepper from courier dispatch to cryo-vault delivery."*

### Slide 8: Technical Architecture & Close (2:35 - 3:00)
> *"PulsePoint is built entirely on zero-dependency web standards—loading under 100 milliseconds. It features a production-grade 13-table PostgreSQL schema, HIPAA-compliant audit logging, and is 100% turnkey ready for immediate deployment on Vercel, Netlify, or GitHub Pages.  
> Thank you, and we welcome your questions!"*

---

## 📑 Slide-by-Slide Deck Outline

### Slide 1: PulsePoint Platform Overview
* **Headline**: The Future of Integrated Healthcare & Blood Logistics
* **Tagline**: Healthcare Innovation Hackathon 2026 Showcase
* **Visuals**: 3-Pillar Architecture (Pharmacy Chemist Stock, Diagnostic Scheduling, Cold-Chain Blood Pipeline).
* **Key Takeaway**: Zero-dependency, accessible, high-contrast clinical interface.

### Slide 2: The Cost of Fragmented Healthcare
* **Problem 1**: Manual telephone coordination during emergency surgery blood shortages.
* **Problem 2**: Prescription counter stockouts and chemist price disparities.
* **Problem 3**: HIPAA privacy concerns when publishing regional blood health metrics.
* **Problem 4**: Chain-of-custody gaps during inter-hospital courier transport.

### Slide 3: Multi-Tenant RBAC & Privacy Separation
* **Public Patient**: Zero-friction lookup, price comparison in ₹, 4-hour holds, diagnostic appointments.
* **Voluntary Donor**: Clinical eligibility verification (Age 18–65, $\ge$50kg), Holographic ID, trauma alert dispatch.
* **Verified Medical Shop Admin**: Drug License passkey authentication (`PHARM-AUTH-4421`), 4-hour hold pickup queue processing, live ₹ pricing & stock adjustments, statutory license verification.
  * **Explicit Restrictions**: Strictly sandboxed to own dispensary; barred from viewing or editing other shops' inventory; zero blood bank authority; zero inter-facility logistics clearance; total redaction of donor PII.
* **Verified Hospital Admin**: Medical passkey access (`MED-AUTH-9082`), cold-chain freezer codes, transfer logistics stepper.

### Slide 4: Pharmacy Stock Finder & Comparative Pricing
* **Search Engine**: Brand names (Augmentin, Lipitor) & generic molecules (Amoxicillin, Atorvastatin).
* **Comparative Pricing**: Multi-dispensary comparison table (Apollo 24x7 vs Metro Health vs City Care).
* **Reservation Engine**: Real-time inventory decrement, 4-hour hold token (`MED-RES-XXXXXX`).

### Slide 5: Diagnostic Lab Booking Engine
* **6 Screening Panels**: CMP, High-Resolution Chest X-Ray, Lipid Profile, HbA1c, Thyroid, Abdominal Ultrasound.
* **Preparation Rules**: Fasting notices (e.g. 10h water fasting) to prevent sample invalidation.
* **Interactive Scheduling**: 7-Day calendar date chips, morning fasting slots, printable digital pass (`PP-LAB-XXXXXX`).

### Slide 6: Regional Blood Supply Hub & Voluntary Donor Portal
* **8 Blood Groups**: O+, O-, A+, A-, B+, B-, AB+, AB- with live shortage alerts (`CRITICAL LOW`, `OPTIMAL`).
* **HIPAA Privacy Shield**: Masked storage racks and encrypted donor contacts (`98451*****`).
* **Trauma Alerts Feed**: Level 1 trauma emergency broadcasts with *"I Can Donate Now"* fast-track routing.

### Slide 7: Inter-Facility Transfer Pipeline & Cold-Chain Stepper
* **Logistics Stepper**: `PENDING_REVIEW` ➔ `STOCK_MATCHED` ➔ `COURIER_DISPATCHED` ➔ `IN_TRANSIT` ➔ `DELIVERED`.
* **Cryptographic Token**: SHA logistics tracking token (e.g. `PP-TX-7994-O-NEG-COLD-CHAIN-VERIFIED-9812A`).
* **Temperature Sensors**: Live cold-chain monitoring (`3.8°C` &ndash; `4.2°C`) adhering to WHO/AABB standards.

### Slide 8: Production Readiness & Hosting
* **Zero Dependencies**: Pure HTML5, CSS3, ES6 JavaScript.
* **Database DDL**: Complete PostgreSQL / MySQL schema in `database/schema.sql`.
* **1-Click Hosting**: Ready for Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

---

## 🎯 Live Demonstration Walkthrough Checklist (For Judges)

1. **Launch App**: Open `http://localhost:8080` (or `index.html`).
2. **Pharmacy Search**: Type `Amoxicillin`, click `Compare Chemist Prices`, then click `Hold / Reserve`. Show reservation reference.
3. **Lab Booking**: Switch to `Diagnostic Lab Booking`, select `Comprehensive Metabolic & Blood Panel`, choose tomorrow's date, click `Confirm Appointment`, show printable digital pass.
4. **Blood Availability**: Switch to `Blood Availability`, point out the `CRITICAL LOW` badge on `O-`, show the HIPAA Privacy Shield badge and Compatibility Matrix.
5. **Donor Response**: Click `Voluntary Donor Hub`, show the holographic ID pass, click `I Can Donate Now` on the active Level 1 trauma alert.
6. **Hospital Admin (The Climax)**:
   * Switch role to `Hospital Admin (Restricted)`.
   * Click **Autofill** (`MED-AUTH-9082`) and unlock.
   * Point out the unmasked freezer rack (`CRYOBANK-A / TANK-01`) and live `3.8°C` sensor temp.
   * Go to `Inter-Facility Transfer Pipeline`, raise an emergency requisition for `O-` units, and click `Advance Logistics Status` through the 5-stage stepper.
