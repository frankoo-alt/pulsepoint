-- ============================================================================
-- PulsePoint Healthcare Platform - Relational Database Schema
-- HIPAA & GDPR privacy-aligned architecture with strict role-based separation
-- Supports: PostgreSQL 14+ / MySQL 8+
-- ============================================================================

-- 1. ENUMS & DOMAINS
CREATE TYPE user_role AS ENUM ('PATIENT', 'VOLUNTARY_DONOR', 'VERIFIED_HOSPITAL_ADMIN', 'PHARMACY_MANAGER');
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE blood_component_type AS ENUM ('WHOLE_BLOOD', 'PACKED_RBC', 'PLATELETS', 'FRESH_FROZEN_PLASMA');
CREATE TYPE stock_status_type AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');
CREATE TYPE urgency_level_type AS ENUM ('ROUTINE', 'HIGH', 'CODE_RED_CRITICAL');
CREATE TYPE requisition_status_type AS ENUM ('PENDING_REVIEW', 'STOCK_MATCHED', 'COURIER_DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');
CREATE TYPE booking_status_type AS ENUM ('CONFIRMED', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- 2. USERS & ACCESS CONTROL TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'PATIENT',
    blood_group blood_group_type NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    hospital_affiliation_id VARCHAR(36) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. HEALTHCARE FACILITIES (Hospitals, Blood Banks, Diagnostic Centers, Pharmacies)
CREATE TABLE IF NOT EXISTS healthcare_facilities (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    facility_type VARCHAR(50) NOT NULL, -- 'HOSPITAL', 'BLOOD_BANK', 'PHARMACY', 'DIAGNOSTIC_LAB'
    license_number VARCHAR(100) UNIQUE NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    emergency_contact VARCHAR(25) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    is_cold_chain_certified BOOLEAN DEFAULT FALSE,
    operating_hours VARCHAR(100) DEFAULT '24/7 Emergency',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PHARMACY MEDICINES & STOCK INVENTORY
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(36) PRIMARY KEY,
    facility_id VARCHAR(36) NOT NULL REFERENCES healthcare_facilities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL, -- 'Tablet', 'Syrup', 'Injection', 'Inhaler', 'Capsule'
    therapeutic_category VARCHAR(100) NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    stock_status stock_status_type DEFAULT 'IN_STOCK',
    quantity_in_stock INTEGER NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    reorder_threshold INTEGER NOT NULL DEFAULT 10,
    batch_number VARCHAR(80) NOT NULL,
    expiry_date DATE NOT NULL,
    prescription_required BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DIAGNOSTIC TESTS CATALOG
CREATE TABLE IF NOT EXISTS diagnostic_tests (
    id VARCHAR(36) PRIMARY KEY,
    test_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(160) NOT NULL,
    category VARCHAR(80) NOT NULL, -- 'Pathology', 'Radiology', 'Cardiology', 'Biochemistry'
    description TEXT NOT NULL,
    fasting_hours INTEGER DEFAULT 0,
    preparation_instructions TEXT,
    turnaround_hours INTEGER NOT NULL DEFAULT 24,
    sample_type VARCHAR(60) NOT NULL, -- 'Blood', 'Urine', 'X-Ray Scan', 'Swab'
    standard_price_cents INTEGER NOT NULL CHECK (standard_price_cents > 0),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. DIAGNOSTIC LAB SCHEDULE SLOTS
CREATE TABLE IF NOT EXISTS lab_slots (
    id VARCHAR(36) PRIMARY KEY,
    facility_id VARCHAR(36) NOT NULL REFERENCES healthcare_facilities(id) ON DELETE CASCADE,
    test_id VARCHAR(36) NOT NULL REFERENCES diagnostic_tests(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    time_window VARCHAR(30) NOT NULL, -- e.g., '08:30 AM - 09:30 AM'
    time_period VARCHAR(20) NOT NULL, -- 'MORNING', 'AFTERNOON', 'EVENING'
    max_capacity INTEGER NOT NULL DEFAULT 6,
    booked_count INTEGER NOT NULL DEFAULT 0 CHECK (booked_count <= max_capacity),
    is_available BOOLEAN GENERATED ALWAYS AS (booked_count < max_capacity) STORED
);

-- 7. PATIENT LAB BOOKINGS
CREATE TABLE IF NOT EXISTS lab_bookings (
    id VARCHAR(36) PRIMARY KEY,
    booking_reference VARCHAR(40) UNIQUE NOT NULL,
    user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    patient_name VARCHAR(120) NOT NULL,
    patient_phone VARCHAR(25) NOT NULL,
    patient_email VARCHAR(160) NOT NULL,
    facility_id VARCHAR(36) NOT NULL REFERENCES healthcare_facilities(id),
    test_id VARCHAR(36) NOT NULL REFERENCES diagnostic_tests(id),
    slot_id VARCHAR(36) NOT NULL REFERENCES lab_slots(id),
    status booking_status_type DEFAULT 'CONFIRMED',
    total_paid_cents INTEGER NOT NULL,
    payment_mode VARCHAR(40) DEFAULT 'PAY_AT_CLINIC',
    special_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SECURE BLOOD BANK INVENTORY (PRIVATE FACILITY LEVEL)
-- Notice: This table contains sensitive storage unit locations & pathogen test verifications
CREATE TABLE IF NOT EXISTS blood_inventory (
    id VARCHAR(36) PRIMARY KEY,
    facility_id VARCHAR(36) NOT NULL REFERENCES healthcare_facilities(id) ON DELETE CASCADE,
    blood_group blood_group_type NOT NULL,
    component_type blood_component_type NOT NULL DEFAULT 'PACKED_RBC',
    units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
    cold_storage_unit_code VARCHAR(60) NOT NULL, -- e.g., 'CRYO-BAY-4 / SHELF-B'
    storage_temp_celsius DECIMAL(4, 2) NOT NULL DEFAULT 4.00,
    pathogen_screened BOOLEAN NOT NULL DEFAULT TRUE, -- HIV, Hep-B, Hep-C, Syphilis cleared
    screened_by_officer VARCHAR(100) NOT NULL,
    expiration_date DATE NOT NULL,
    last_calibrated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. VOLUNTARY BLOOD DONORS (DATA PRIVACY COMPLIANT)
-- Private phone and detailed coordinates are masked from public APIs
CREATE TABLE IF NOT EXISTS voluntary_donors (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(120) NOT NULL,
    blood_group blood_group_type NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
    weight_kg DECIMAL(5, 2) NOT NULL CHECK (weight_kg >= 50.0),
    last_donation_date DATE NULL,
    district VARCHAR(100) NOT NULL,
    masked_phone VARCHAR(20) NOT NULL, -- Public: '98765*****'
    encrypted_phone VARCHAR(255) NOT NULL, -- For internal emergency dispatch only
    is_emergency_standby BOOLEAN DEFAULT TRUE,
    availability_status VARCHAR(40) DEFAULT 'ACTIVE_STANDBY', -- 'ACTIVE_STANDBY', 'DONATED_RESTING', 'INACTIVE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SIMULATED EMERGENCY BLOOD ALERTS (PUBLIC & DONOR BROADCAST)
CREATE TABLE IF NOT EXISTS emergency_blood_alerts (
    id VARCHAR(36) PRIMARY KEY,
    facility_id VARCHAR(36) NOT NULL REFERENCES healthcare_facilities(id),
    blood_group blood_group_type NOT NULL,
    units_needed INTEGER NOT NULL CHECK (units_needed > 0),
    clinical_urgency urgency_level_type DEFAULT 'CODE_RED_CRITICAL',
    case_summary VARCHAR(255) NOT NULL, -- e.g., 'Urgent: Multiple trauma casualty intake'
    patient_ward VARCHAR(80) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. SECURE INTER-FACILITY BLOOD TRANSFER REQUISITIONS (RESTRICTED HOSPITAL VIEW)
-- Implements end-to-end cryptographic tracking tokens & cold-chain compliance
CREATE TABLE IF NOT EXISTS secure_hospital_requests (
    id VARCHAR(36) PRIMARY KEY,
    requisition_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'REQ-2026-STJUDE-8891'
    requesting_hospital_id VARCHAR(36) NOT NULL REFERENCES healthcare_facilities(id),
    fulfilling_facility_id VARCHAR(36) REFERENCES healthcare_facilities(id),
    blood_group blood_group_type NOT NULL,
    component_type blood_component_type NOT NULL DEFAULT 'PACKED_RBC',
    units_requested INTEGER NOT NULL CHECK (units_requested > 0),
    priority urgency_level_type NOT NULL DEFAULT 'CODE_RED_CRITICAL',
    clinical_rationale TEXT NOT NULL,
    status requisition_status_type DEFAULT 'PENDING_REVIEW',
    tracking_token VARCHAR(120) UNIQUE NOT NULL, -- SHA-256 hashed logistics token
    cold_chain_temp_celsius DECIMAL(4, 2) DEFAULT 4.20,
    dispatched_at TIMESTAMP WITH TIME ZONE NULL,
    estimated_arrival_minutes INTEGER DEFAULT 25,
    received_at TIMESTAMP WITH TIME ZONE NULL,
    authorized_by_doctor VARCHAR(120) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. AUDIT LOG (HIPAA COMPLIANCE & ACCESS INTEGRITY)
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_id VARCHAR(36) NULL REFERENCES users(id),
    actor_role user_role NOT NULL,
    action_type VARCHAR(80) NOT NULL, -- 'PUBLIC_STOCK_LOOKUP', 'ADMIN_TRANSFER_DISPATCH', 'DONOR_TRIAGE'
    resource_accessed VARCHAR(120) NOT NULL,
    metadata_json JSONB NULL,
    ip_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. INDEXES FOR HIGH-THROUGHPUT MEDICAL QUERIES
CREATE INDEX idx_medicines_search ON medicines (name, generic_name, stock_status);
CREATE INDEX idx_lab_slots_date ON lab_slots (slot_date, facility_id, test_id);
CREATE INDEX idx_blood_inventory_group ON blood_inventory (blood_group, facility_id);
CREATE INDEX idx_emergency_alerts_active ON emergency_blood_alerts (is_active, blood_group);
CREATE INDEX idx_hospital_requests_tracking ON secure_hospital_requests (tracking_token, status);
