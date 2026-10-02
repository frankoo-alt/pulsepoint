-- ============================================================================
-- PulsePoint Seed Data - Real-World Healthcare Mock Dataset
-- ============================================================================

-- 1. FACILITIES
INSERT INTO healthcare_facilities (id, name, facility_type, license_number, address_line, district, city, postal_code, phone, emergency_contact, latitude, longitude, is_cold_chain_certified, operating_hours)
VALUES
('fac-hosp-01', 'St. Jude Academic Medical Center', 'HOSPITAL', 'HOSP-LIC-78921', '450 University Blvd', 'Medical District', 'Metro City', '10001', '+1-555-019-2000', '+1-555-019-9111', 40.7128, -74.0060, true, '24/7 Trauma Emergency'),
('fac-hosp-02', 'Metropolitan Trauma & Surgical Center', 'HOSPITAL', 'HOSP-LIC-66102', '128 Grand Central Ave', 'Downtown', 'Metro City', '10004', '+1-555-019-3500', '+1-555-019-9222', 40.7061, -74.0092, true, '24/7 Level 1 Trauma'),
('fac-bank-01', 'Regional Central Blood & Plasma Repository', 'BLOOD_BANK', 'BB-LIC-99014', '77 Healthway Parkway', 'North District', 'Metro City', '10018', '+1-555-019-7000', '+1-555-019-7999', 40.7589, -73.9851, true, '24/7 Emergency Logistics'),
('fac-pharm-01', 'Apollo 24x7 Super Care Chemist', 'PHARMACY', 'PHARM-LIC-33201', '88 Lexington Avenue', 'Midtown', 'Metro City', '10016', '+1-555-019-4100', '+1-555-019-4101', 40.7484, -73.9857, false, '24 Hours Open'),
('fac-pharm-02', 'Metro Health Pharmacy & MedStore', 'PHARMACY', 'PHARM-LIC-44109', '302 5th Avenue', 'Chelsea', 'Metro City', '10001', '+1-555-019-4200', '+1-555-019-4201', 40.7445, -73.9890, false, '07:00 AM - 11:30 PM'),
('fac-pharm-03', 'City Care Generic & Critical Drugs', 'PHARMACY', 'PHARM-LIC-55032', '15 Broadway Suite 4', 'Financial District', 'Metro City', '10006', '+1-555-019-4300', '+1-555-019-4301', 40.7075, -74.0113, false, '08:00 AM - 10:00 PM'),
('fac-lab-01', 'PulsePoint Diagnostic & Molecular Imaging Hub', 'DIAGNOSTIC_LAB', 'LAB-LIC-11099', '210 Medical Center Way', 'Health District', 'Metro City', '10021', '+1-555-019-6100', '+1-555-019-6101', 40.7648, -73.9567, true, '06:30 AM - 09:00 PM');

-- 2. MEDICINES
INSERT INTO medicines (id, facility_id, name, generic_name, dosage, dosage_form, therapeutic_category, price_cents, stock_status, quantity_in_stock, reorder_threshold, batch_number, expiry_date, prescription_required)
VALUES
('med-01', 'fac-pharm-01', 'Amoxicillin Trihydrate', 'Amoxicillin', '500mg', 'Capsule', 'Antibiotic', 1250, 'IN_STOCK', 145, 20, 'AMX-2026-B1', '2027-08-30', true),
('med-02', 'fac-pharm-02', 'Amoxil Forte', 'Amoxicillin', '500mg', 'Capsule', 'Antibiotic', 1400, 'IN_STOCK', 60, 20, 'AMX-2026-M2', '2027-09-15', true),
('med-03', 'fac-pharm-03', 'Generic Amoxicillin', 'Amoxicillin', '500mg', 'Capsule', 'Antibiotic', 950, 'LOW_STOCK', 8, 15, 'AMX-2026-G9', '2027-05-10', true),
('med-04', 'fac-pharm-01', 'Glucophage XR', 'Metformin HCl', '1000mg', 'Tablet', 'Antidiabetic', 1850, 'IN_STOCK', 210, 30, 'MET-2026-K4', '2028-01-20', true),
('med-05', 'fac-pharm-02', 'Metformin Extended Release', 'Metformin HCl', '1000mg', 'Tablet', 'Antidiabetic', 1600, 'IN_STOCK', 95, 25, 'MET-2026-E1', '2027-11-12', true),
('med-06', 'fac-pharm-03', 'Metformin Generic', 'Metformin HCl', '1000mg', 'Tablet', 'Antidiabetic', 1300, 'OUT_OF_STOCK', 0, 25, 'MET-2026-X0', '2027-04-18', true),
('med-07', 'fac-pharm-01', 'Lipitor Cardiac Care', 'Atorvastatin Calcium', '20mg', 'Tablet', 'Cardiovascular', 2400, 'IN_STOCK', 180, 20, 'ATV-2026-L1', '2027-12-01', true),
('med-08', 'fac-pharm-02', 'Atorva Gold', 'Atorvastatin Calcium', '20mg', 'Tablet', 'Cardiovascular', 2250, 'IN_STOCK', 45, 15, 'ATV-2026-A3', '2027-10-15', true),
('med-09', 'fac-pharm-01', 'Ventolin HFA Inhaler', 'Albuterol / Salbutamol', '100mcg', 'Inhaler', 'Respiratory', 3200, 'IN_STOCK', 38, 10, 'ALB-2026-V8', '2027-07-22', true),
('med-10', 'fac-pharm-02', 'Asthalin Inhaler', 'Albuterol / Salbutamol', '100mcg', 'Inhaler', 'Respiratory', 2850, 'LOW_STOCK', 4, 10, 'ALB-2026-S2', '2027-06-18', true),
('med-11', 'fac-pharm-03', 'Salbutamol Inhalation Aerosol', 'Albuterol / Salbutamol', '100mcg', 'Inhaler', 'Respiratory', 2600, 'OUT_OF_STOCK', 0, 10, 'ALB-2026-G1', '2027-03-30', true),
('med-12', 'fac-pharm-01', 'Lantus SoloStar Pen', 'Insulin Glargine', '100 units/mL', 'Injection', 'Antidiabetic', 6800, 'IN_STOCK', 24, 8, 'INS-2026-L9', '2027-04-12', true),
('med-13', 'fac-pharm-03', 'Paracetamol Fast Relief', 'Acetaminophen', '650mg', 'Tablet', 'Analgesic / Antipyretic', 450, 'IN_STOCK', 320, 50, 'PCM-2026-P3', '2028-06-01', false);

-- 3. DIAGNOSTIC TESTS
INSERT INTO diagnostic_tests (id, test_code, name, category, description, fasting_hours, preparation_instructions, turnaround_hours, sample_type, standard_price_cents)
VALUES
('test-01', 'CBP-01', 'Comprehensive Metabolic & Blood Panel (CMP)', 'Pathology', 'Complete blood count, kidney function, liver enzymes, electrolytes, and blood glucose index.', 10, 'Strict overnight 10-hour water-only fasting recommended prior to draw.', 6, 'Venous Blood', 85000),
('test-02', 'CXR-02', 'High-Resolution Digital Chest X-Ray (PA View)', 'Radiology', 'Evaluation of lungs, mediastinum, pleura, and cardiac silhouette.', 0, 'No fasting required. Wear metal-free comfortable clothing.', 2, 'Radiographic Imaging', 65000),
('test-03', 'LIP-03', 'Advanced Lipid & Cardiovascular Profile', 'Biochemistry', 'Total cholesterol, HDL, LDL, VLDL, and Triglycerides with risk stratification.', 12, '12-hour complete fasting. Avoid alcohol 24h prior.', 4, 'Venous Blood', 55000),
('test-04', 'HBA1C-04', 'Glycated Hemoglobin (HbA1c) Diabetic Monitor', 'Pathology', 'Assesses average 3-month blood sugar control for diabetes management.', 0, 'No fasting required. Can be done anytime during operating hours.', 3, 'Venous Blood', 45000),
('test-05', 'THY-05', 'Thyroid Function Ultra-Profile (T3, T4, TSH)', 'Biochemistry', 'Evaluates primary, secondary, and subclinical thyroid disorders.', 0, 'Early morning sample preferred. Take thyroid medications after blood collection.', 8, 'Venous Blood', 60000),
('test-06', 'USG-06', 'Ultrasound Whole Abdomen & Pelvis Screening', 'Radiology', 'High-frequency sonography of liver, gallbladder, kidneys, spleen, and bladder.', 6, '6-hour fasting before test. Drink 1L water 45 mins prior to retain full bladder.', 1, 'Ultrasound Imaging', 120000);

-- 4. LAB SLOTS
INSERT INTO lab_slots (id, facility_id, test_id, slot_date, time_window, time_period, max_capacity, booked_count)
VALUES
('slot-01', 'fac-lab-01', 'test-01', CURRENT_DATE, '08:00 AM - 09:00 AM', 'MORNING', 6, 4),
('slot-02', 'fac-lab-01', 'test-01', CURRENT_DATE, '10:00 AM - 11:00 AM', 'MORNING', 6, 2),
('slot-03', 'fac-lab-01', 'test-01', CURRENT_DATE, '02:00 PM - 03:00 PM', 'AFTERNOON', 6, 1),
('slot-04', 'fac-lab-01', 'test-02', CURRENT_DATE, '09:30 AM - 10:30 AM', 'MORNING', 8, 3),
('slot-05', 'fac-lab-01', 'test-02', CURRENT_DATE, '03:30 PM - 04:30 PM', 'AFTERNOON', 8, 2),
('slot-06', 'fac-lab-01', 'test-03', CURRENT_DATE, '07:30 AM - 08:30 AM', 'MORNING', 6, 5),
('slot-07', 'fac-lab-01', 'test-04', CURRENT_DATE, '11:30 AM - 12:30 PM', 'MORNING', 10, 3),
('slot-08', 'fac-lab-01', 'test-05', CURRENT_DATE, '08:00 AM - 09:00 AM', 'MORNING', 6, 2),
('slot-09', 'fac-lab-01', 'test-06', CURRENT_DATE, '04:00 PM - 05:00 PM', 'EVENING', 4, 1);

-- 5. BLOOD INVENTORY (PRIVATE COLD-CHAIN REGISTRY)
INSERT INTO blood_inventory (id, facility_id, blood_group, component_type, units_available, cold_storage_unit_code, storage_temp_celsius, pathogen_screened, screened_by_officer, expiration_date)
VALUES
('bld-01', 'fac-bank-01', 'O+', 'PACKED_RBC', 42, 'CRYOBANK-A / TANK-01', 3.8, true, 'Dr. Marcus Vance (Pathologist)', CURRENT_DATE + INTERVAL '28 day'),
('bld-02', 'fac-bank-01', 'O-', 'PACKED_RBC', 4, 'CRYOBANK-A / TANK-02', 4.0, true, 'Dr. Marcus Vance (Pathologist)', CURRENT_DATE + INTERVAL '14 day'),
('bld-03', 'fac-bank-01', 'A+', 'PACKED_RBC', 38, 'CRYOBANK-B / TANK-01', 4.1, true, 'Dr. Elena Rostova', CURRENT_DATE + INTERVAL '30 day'),
('bld-04', 'fac-bank-01', 'A-', 'PACKED_RBC', 7, 'CRYOBANK-B / TANK-02', 3.9, true, 'Dr. Elena Rostova', CURRENT_DATE + INTERVAL '18 day'),
('bld-05', 'fac-bank-01', 'B+', 'PACKED_RBC', 29, 'CRYOBANK-C / TANK-01', 4.2, true, 'Dr. Marcus Vance', CURRENT_DATE + INTERVAL '24 day'),
('bld-06', 'fac-bank-01', 'B-', 'PACKED_RBC', 3, 'CRYOBANK-C / TANK-02', 4.0, true, 'Dr. Marcus Vance', CURRENT_DATE + INTERVAL '12 day'),
('bld-07', 'fac-bank-01', 'AB+', 'PACKED_RBC', 22, 'CRYOBANK-D / TANK-01', 4.0, true, 'Dr. Elena Rostova', CURRENT_DATE + INTERVAL '35 day'),
('bld-08', 'fac-bank-01', 'AB-', 'PACKED_RBC', 2, 'CRYOBANK-D / TANK-02', 3.7, true, 'Dr. Elena Rostova', CURRENT_DATE + INTERVAL '9 day'),
('bld-09', 'fac-hosp-01', 'O-', 'PACKED_RBC', 2, 'STJUDE-TRAUMA-FRIDGE-1', 4.1, true, 'Dr. Sarah Lin (Chief Hematology)', CURRENT_DATE + INTERVAL '8 day'),
('bld-10', 'fac-hosp-01', 'O+', 'PACKED_RBC', 12, 'STJUDE-TRAUMA-FRIDGE-1', 4.0, true, 'Dr. Sarah Lin', CURRENT_DATE + INTERVAL '21 day'),
('bld-11', 'fac-hosp-02', 'B-', 'PACKED_RBC', 1, 'METRO-SURGICAL-FRIDGE-3', 4.2, true, 'Dr. Robert Hall', CURRENT_DATE + INTERVAL '7 day');

-- 6. VOLUNTARY DONORS
INSERT INTO voluntary_donors (id, full_name, blood_group, age, weight_kg, last_donation_date, district, masked_phone, encrypted_phone, is_emergency_standby, availability_status)
VALUES
('don-01', 'Jonathan Reed', 'O-', 32, 74.5, CURRENT_DATE - INTERVAL '110 day', 'Downtown Metro', '98124*****', 'ENC_f9a8c17b5e028d7a', true, 'ACTIVE_STANDBY'),
('don-02', 'Ananya Sharma', 'B-', 27, 58.0, CURRENT_DATE - INTERVAL '140 day', 'North Midtown', '97441*****', 'ENC_8a49c210d4812a4f', true, 'ACTIVE_STANDBY'),
('don-03', 'Carlos Mendez', 'AB-', 41, 81.2, CURRENT_DATE - INTERVAL '95 day', 'Chelsea District', '98902*****', 'ENC_33bc71a941eef001', true, 'ACTIVE_STANDBY'),
('don-04', 'Emily Watson', 'A-', 29, 62.0, CURRENT_DATE - INTERVAL '130 day', 'Financial District', '91234*****', 'ENC_4a5b6c7d8e9f0123', true, 'ACTIVE_STANDBY'),
('don-05', 'David Kim', 'O+', 35, 78.0, CURRENT_DATE - INTERVAL '40 day', 'Midtown', '98765*****', 'ENC_1234567890abcdef', false, 'DONATED_RESTING');

-- 7. EMERGENCY BLOOD ALERTS
INSERT INTO emergency_blood_alerts (id, facility_id, blood_group, units_needed, clinical_urgency, case_summary, patient_ward, expires_at, is_active)
VALUES
('alt-01', 'fac-hosp-01', 'O-', 2, 'CODE_RED_CRITICAL', 'Urgent: Road Accident Multiple Trauma Intake - Massive Transfusion Protocol', 'ICU Bay 3', CURRENT_TIMESTAMP + INTERVAL '4 hour', true),
('alt-02', 'fac-hosp-02', 'B-', 3, 'HIGH', 'Emergency Cardiac Bypass Surgery with Unanticipated Hemorrhage', 'Cardiovascular OR 4', CURRENT_TIMESTAMP + INTERVAL '6 hour', true),
('alt-03', 'fac-hosp-01', 'AB-', 1, 'HIGH', 'Pediatric Oncology Platelet / Red Cell Critical Support', 'Pediatric Wing 2B', CURRENT_TIMESTAMP + INTERVAL '8 hour', true);

-- 8. SECURE HOSPITAL TRANSFER REQUISITIONS (RESTRICTED VIEW)
INSERT INTO secure_hospital_requests (id, requisition_id, requesting_hospital_id, fulfilling_facility_id, blood_group, component_type, units_requested, priority, clinical_rationale, status, tracking_token, cold_chain_temp_celsius, dispatched_at, estimated_arrival_minutes, authorized_by_doctor)
VALUES
('req-01', 'REQ-2026-STJUDE-9041', 'fac-hosp-01', 'fac-bank-01', 'O-', 'PACKED_RBC', 2, 'CODE_RED_CRITICAL', 'Severe hypovolemic shock following blunt polytrauma. Type-specific crossmatch running concurrently.', 'COURIER_DISPATCHED', 'PP-TX-7994-O-NEG-COLD-CHAIN-VERIFIED-9812A', 3.8, CURRENT_TIMESTAMP - INTERVAL '12 minute', 13, 'Dr. Sarah Lin (Lic #MED-8812)'),
('req-02', 'REQ-2026-METRO-4412', 'fac-hosp-02', 'fac-bank-01', 'B-', 'PACKED_RBC', 2, 'HIGH', 'Aortic valve replacement post-op coagulopathy management.', 'STOCK_MATCHED', 'PP-TX-6621-B-NEG-COLD-CHAIN-ALLOCATED-4421B', 4.1, NULL, 30, 'Dr. Robert Hall (Lic #MED-5401)'),
('req-03', 'REQ-2026-STJUDE-8890', 'fac-hosp-01', 'fac-bank-01', 'A+', 'PACKED_RBC', 4, 'ROUTINE', 'Scheduled orthopedic bilateral hip arthroplasty reserved reserve pool.', 'DELIVERED', 'PP-TX-3310-A-POS-DELIVERED-ARCHIVE-5520Z', 4.0, CURRENT_TIMESTAMP - INTERVAL '180 minute', 0, 'Dr. Sarah Lin (Lic #MED-8812)');
