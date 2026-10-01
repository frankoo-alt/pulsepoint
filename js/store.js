/**
 * PulsePoint Central Reactive State Store
 * Manages roles, public/private data separation, persistence, and mutations.
 */

import {
  INITIAL_FACILITIES,
  INITIAL_MEDICINES,
  INITIAL_DIAGNOSTIC_TESTS,
  INITIAL_SLOT_WINDOWS,
  INITIAL_BLOOD_INVENTORY,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_DONORS,
  INITIAL_HOSPITAL_REQUESTS,
  COMPATIBILITY_RULES
} from './mockData.js';

const STORAGE_KEY = 'PULSEPOINT_STATE_V1';
export const ADMIN_PASSKEY = 'MED-AUTH-9082';

class Store {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadState();
  }

  loadState() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Ensure default structure if previous version lacked any key
        return {
          currentRole: parsed.currentRole || 'PATIENT', // 'PATIENT' | 'DONOR' | 'HOSPITAL_ADMIN'
          activeTab: parsed.activeTab || 'pharmacy',
          facilities: parsed.facilities || INITIAL_FACILITIES,
          medicines: parsed.medicines || INITIAL_MEDICINES,
          tests: parsed.tests || INITIAL_DIAGNOSTIC_TESTS,
          slotWindows: INITIAL_SLOT_WINDOWS,
          bookings: parsed.bookings || [],
          bloodInventory: parsed.bloodInventory || INITIAL_BLOOD_INVENTORY,
          emergencyAlerts: parsed.emergencyAlerts || INITIAL_EMERGENCY_ALERTS,
          donors: parsed.donors || INITIAL_DONORS,
          hospitalRequests: parsed.hospitalRequests || INITIAL_HOSPITAL_REQUESTS,
          currentDonorProfile: parsed.currentDonorProfile || null,
          adminSession: parsed.adminSession || { isAuthenticated: false, hospital: 'fac-hosp-01', officer: 'Dr. Sarah Lin' },
          toasts: []
        };
      } catch (e) {
        console.warn('Corrupted local state, falling back to default seed data', e);
      }
    }

    return {
      currentRole: 'PATIENT',
      activeTab: 'pharmacy',
      facilities: INITIAL_FACILITIES,
      medicines: INITIAL_MEDICINES,
      tests: INITIAL_DIAGNOSTIC_TESTS,
      slotWindows: INITIAL_SLOT_WINDOWS,
      bookings: [
        {
          id: 'bk-demo-01',
          bookingRef: 'PP-LAB-891024',
          patientName: 'Eleanor Vance',
          patientPhone: '+1 (555) 019-3321',
          patientEmail: 'eleanor.vance@example.com',
          testId: 'test-01',
          testName: 'Comprehensive Metabolic & Blood Panel (CMP)',
          slotDate: new Date().toISOString().split('T')[0],
          slotTime: '08:00 AM - 09:00 AM',
          fastingRequired: '10 Hours Fasting',
          price: 45.00,
          status: 'CONFIRMED',
          bookedAt: new Date().toLocaleString()
        }
      ],
      bloodInventory: INITIAL_BLOOD_INVENTORY,
      emergencyAlerts: INITIAL_EMERGENCY_ALERTS,
      donors: INITIAL_DONORS,
      hospitalRequests: INITIAL_HOSPITAL_REQUESTS,
      currentDonorProfile: {
        id: 'don-current-user',
        fullName: 'Alexander Wright',
        bloodGroup: 'O-',
        age: 31,
        weightKg: 76.0,
        lastDonationDate: '2026-05-18',
        district: 'Downtown Health Zone',
        maskedPhone: '98451*****',
        emergencyStandby: true,
        donorCardId: 'DONOR-US-99120',
        joinedDate: '2026-07-01'
      },
      adminSession: {
        isAuthenticated: false,
        hospital: 'fac-hosp-01',
        officer: 'Dr. Sarah Lin (Chief Hematology, Lic #MED-8812)'
      },
      toasts: []
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const callback of this.subscribers) {
      callback(this.state);
    }
  }

  // Toast Notification System
  showToast(title, message, type = 'info') {
    const toast = {
      id: 'toast-' + Math.random().toString(36).substring(2, 9),
      title,
      message,
      type, // 'info', 'success', 'warning', 'danger'
      timestamp: Date.now()
    };
    this.state.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.state.toasts = this.state.toasts.filter(t => t.id !== toast.id);
      this.notify();
    }, 4500);
  }

  // Navigation & Role Control
  setRole(role, passkey = '') {
    if (role === 'HOSPITAL_ADMIN' && !this.state.adminSession.isAuthenticated) {
      if (passkey !== ADMIN_PASSKEY) {
        this.showToast('Authentication Denied', 'Invalid hospital security passkey. Please check medical credentials.', 'danger');
        return false;
      }
      this.state.adminSession.isAuthenticated = true;
      this.showToast('Security Cleared', 'Logged in as St. Jude Verified Medical Officer. Private facilities unmasked.', 'success');
    }

    this.state.currentRole = role;
    if (role === 'HOSPITAL_ADMIN') {
      this.state.activeTab = 'hospital-admin';
    } else if (role === 'DONOR') {
      this.state.activeTab = 'donor-portal';
    } else if (this.state.activeTab === 'hospital-admin') {
      this.state.activeTab = 'pharmacy';
    }

    this.save();
    return true;
  }

  logoutAdmin() {
    this.state.adminSession.isAuthenticated = false;
    this.state.currentRole = 'PATIENT';
    this.state.activeTab = 'pharmacy';
    this.showToast('Session Ended', 'Logged out of restricted hospital inventory portal.', 'info');
    this.save();
  }

  setActiveTab(tab) {
    if (tab === 'hospital-admin' && this.state.currentRole !== 'HOSPITAL_ADMIN') {
      this.showToast('Restricted Access', 'Hospital Admin portal requires verified credentials and medical passkey.', 'warning');
      return false;
    }
    this.state.activeTab = tab;
    this.save();
    return true;
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.showToast('System Reset', 'All records have been reset to default mock state.', 'info');
    this.save();
  }

  // --- MODULE A: PHARMACY FINDER & STOCK ---
  searchMedicines(query = '', categoryFilter = 'ALL', stockOnly = false) {
    const q = query.trim().toLowerCase();
    return this.state.medicines.filter(med => {
      const matchesSearch = !q ||
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        med.category.toLowerCase().includes(q) ||
        med.facilityName.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === 'ALL' || med.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStock = !stockOnly || med.stockStatus === 'IN_STOCK';

      return matchesSearch && matchesCategory && matchesStock;
    });
  }

  reserveMedicine(medicineId, patientDetails) {
    const med = this.state.medicines.find(m => m.id === medicineId);
    if (!med || med.stockStatus === 'OUT_OF_STOCK' || med.quantity <= 0) {
      this.showToast('Item Unavailable', 'This medicine is currently out of stock at this chemist.', 'danger');
      return null;
    }

    med.quantity -= 1;
    if (med.quantity === 0) {
      med.stockStatus = 'OUT_OF_STOCK';
    } else if (med.quantity <= 10) {
      med.stockStatus = 'LOW_STOCK';
    }

    const reservationRef = 'MED-RES-' + Math.floor(100000 + Math.random() * 900000);
    this.save();
    this.showToast('Stock Reserved!', `Reservation ${reservationRef} confirmed at ${med.facilityName}. Valid for 4 hours.`, 'success');
    return reservationRef;
  }

  // --- MODULE A: DIAGNOSTIC LAB BOOKING ---
  bookLabSlot(bookingData) {
    const { testId, slotDate, slotTime, patientName, patientPhone, patientEmail, specialNotes } = bookingData;
    const test = this.state.tests.find(t => t.id === testId);
    if (!test) {
      this.showToast('Booking Error', 'Diagnostic test not found.', 'danger');
      return null;
    }

    const bookingRef = 'PP-LAB-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      id: 'bk-' + Math.random().toString(36).substring(2, 9),
      bookingRef,
      patientName,
      patientPhone,
      patientEmail,
      testId: test.id,
      testName: test.name,
      testCategory: test.category,
      slotDate,
      slotTime,
      fastingRequired: test.fastingHours > 0 ? `${test.fastingHours}h Fasting Required` : 'No Fasting Required',
      price: test.price,
      status: 'CONFIRMED',
      specialNotes: specialNotes || '',
      bookedAt: new Date().toLocaleString()
    };

    this.state.bookings.unshift(newBooking);
    this.save();
    this.showToast('Slot Confirmed!', `Appointment ${bookingRef} scheduled for ${test.name} on ${slotDate} (${slotTime}).`, 'success');
    return newBooking;
  }

  // --- MODULE A: PUBLIC BLOOD AVAILABILITY OVERVIEW ---
  getAggregatedBloodSupply() {
    const groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const aggregated = {};

    groups.forEach(grp => {
      const units = this.state.bloodInventory
        .filter(item => item.bloodGroup === grp)
        .reduce((sum, item) => sum + item.unitsAvailable, 0);

      let status = 'OPTIMAL';
      let badgeClass = 'badge-success';
      if (units <= 5) {
        status = 'CRITICAL LOW';
        badgeClass = 'badge-danger pulse-dot';
      } else if (units <= 12) {
        status = 'LOW SUPPLY';
        badgeClass = 'badge-warning';
      } else if (units <= 25) {
        status = 'MODERATE';
        badgeClass = 'badge-info';
      }

      aggregated[grp] = {
        group: grp,
        units,
        status,
        badgeClass,
        compatibility: COMPATIBILITY_RULES[grp]
      };
    });

    return aggregated;
  }

  // --- MODULE B: VOLUNTARY DONOR REGISTRATION & ALERTS ---
  registerDonor(donorForm) {
    const { fullName, bloodGroup, age, weightKg, district, phone, emergencyStandby } = donorForm;

    // Strict Clinical Validation
    if (age < 18 || age > 65) {
      this.showToast('Eligibility Notice', 'Donors must be between 18 and 65 years of age according to medical guidelines.', 'warning');
      return null;
    }

    if (weightKg < 50.0) {
      this.showToast('Eligibility Notice', 'Weight must be at least 50 kg to safely donate whole blood.', 'warning');
      return null;
    }

    const maskedPhone = phone.length >= 10 
      ? phone.substring(0, 5) + '*****'
      : '98***-PROTECTED';

    const donorCardId = 'DONOR-US-' + Math.floor(10000 + Math.random() * 90000);

    const newDonor = {
      id: 'don-' + Math.random().toString(36).substring(2, 9),
      fullName,
      bloodGroup,
      age: Number(age),
      weightKg: Number(weightKg),
      lastDonationDate: new Date().toISOString().split('T')[0],
      district,
      maskedPhone,
      phone, // Local device copy for card display
      emergencyStandby: Boolean(emergencyStandby),
      status: 'ACTIVE_STANDBY',
      donorCardId,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    this.state.donors.unshift(newDonor);
    this.state.currentDonorProfile = newDonor;
    this.state.currentRole = 'DONOR';
    this.state.activeTab = 'donor-portal';
    this.save();
    this.showToast('Donor Registered!', `Welcome, ${fullName}! Your Digital Donor Pass ${donorCardId} is now active.`, 'success');
    return newDonor;
  }

  respondToEmergencyAlert(alertId) {
    const alert = this.state.emergencyAlerts.find(a => a.id === alertId);
    if (!alert) return;

    this.showToast('Response Transmitted!', `Thank you! St. Jude Emergency Triage has received your response for ${alert.bloodGroup}. An emergency coordinator will contact you immediately.`, 'success');
  }

  // --- MODULE C: VERIFIED HOSPITAL INVENTORY MANAGEMENT ---
  updateMedicineStock(medId, deltaQuantity, newStatus, newPrice) {
    const med = this.state.medicines.find(m => m.id === medId);
    if (!med) return;

    if (deltaQuantity !== undefined) {
      med.quantity = Math.max(0, med.quantity + deltaQuantity);
      if (med.quantity === 0) med.stockStatus = 'OUT_OF_STOCK';
      else if (med.quantity <= 10) med.stockStatus = 'LOW_STOCK';
      else med.stockStatus = 'IN_STOCK';
    }

    if (newStatus) med.stockStatus = newStatus;
    if (newPrice !== undefined && newPrice > 0) med.price = Number(newPrice);

    this.save();
    this.showToast('Inventory Updated', `Stock parameters updated for ${med.name}.`, 'info');
  }

  addNewMedicine(medData) {
    const newMed = {
      id: 'med-' + Math.random().toString(36).substring(2, 9),
      facilityId: 'fac-pharm-01',
      facilityName: 'Apollo 24x7 Super Care Chemist',
      name: medData.name,
      genericName: medData.genericName,
      dosage: medData.dosage,
      form: medData.form,
      category: medData.category,
      price: Number(medData.price),
      stockStatus: Number(medData.quantity) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
      quantity: Number(medData.quantity),
      batchNo: 'BAT-' + Math.floor(1000 + Math.random() * 9000),
      expiryDate: medData.expiryDate || '2027-12-31',
      prescriptionRequired: Boolean(medData.prescriptionRequired)
    };
    this.state.medicines.unshift(newMed);
    this.save();
    this.showToast('Medicine Listed', `${newMed.name} added to pharmacy inventory.`, 'success');
  }

  updateBloodUnitCount(inventoryId, delta) {
    const item = this.state.bloodInventory.find(b => b.id === inventoryId);
    if (!item) return;

    item.unitsAvailable = Math.max(0, item.unitsAvailable + delta);
    if (item.unitsAvailable <= 3) item.statusLevel = 'CRITICAL';
    else if (item.unitsAvailable <= 10) item.statusLevel = 'LOW';
    else if (item.unitsAvailable <= 20) item.statusLevel = 'MODERATE';
    else item.statusLevel = 'OPTIMAL';

    this.save();
    this.showToast('Cold-Chain Log Updated', `${item.bloodGroup} inventory updated: ${item.unitsAvailable} units remaining in ${item.rackCode}.`, 'info');
  }

  // --- MODULE C: SECURE INTER-FACILITY BLOOD TRANSFER PIPELINE ---
  createHospitalRequisition(reqData) {
    const { requestingHospital, bloodGroup, units, priority, rationale } = reqData;

    // Automated Stock Matching Algorithm: Scan regional cold-chain repository
    const matchedBank = this.state.bloodInventory.find(b => 
      b.bloodGroup === bloodGroup && b.unitsAvailable >= Number(units)
    );

    const tokenHash = 'PP-TX-' + Math.floor(1000 + Math.random() * 9000) + '-' + 
      bloodGroup.replace('+', 'POS').replace('-', 'NEG') + 
      '-VERIFIED-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const newReq = {
      id: 'req-' + Math.random().toString(36).substring(2, 9),
      requisitionId: 'REQ-2026-STJUDE-' + Math.floor(1000 + Math.random() * 9000),
      requestingHospital: requestingHospital || 'St. Jude Academic Medical Center',
      fulfillingFacility: matchedBank ? matchedBank.facilityName : 'Regional Central Blood & Plasma Repository',
      bloodGroup,
      component: 'Packed Red Blood Cells (PRBC)',
      units: Number(units),
      priority, // 'ROUTINE', 'HIGH', 'CODE_RED_CRITICAL'
      rationale,
      status: matchedBank ? 'STOCK_MATCHED' : 'PENDING_REVIEW',
      trackingToken: tokenHash,
      tempCelsius: 4.1,
      dispatchedTime: 'Allocated Just Now',
      etaMinutes: priority === 'CODE_RED_CRITICAL' ? 15 : 35,
      doctor: 'Dr. Sarah Lin (Chief Hematology, Lic #MED-8812)'
    };

    // Deduct from matched repository
    if (matchedBank) {
      matchedBank.unitsAvailable -= Number(units);
    }

    this.state.hospitalRequests.unshift(newReq);
    this.save();
    this.showToast('Requisition Raised!', `Emergency Requisition ${newReq.requisitionId} initiated with secure tracking token ${tokenHash.substring(0, 16)}...`, 'success');
    return newReq;
  }

  advanceRequisitionStatus(reqId) {
    const req = this.state.hospitalRequests.find(r => r.id === reqId);
    if (!req) return;

    const pipeline = ['PENDING_REVIEW', 'STOCK_MATCHED', 'COURIER_DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];
    const currentIndex = pipeline.indexOf(req.status);
    if (currentIndex < pipeline.length - 1) {
      req.status = pipeline[currentIndex + 1];
      if (req.status === 'COURIER_DISPATCHED') {
        req.dispatchedTime = 'Dispatched 2 mins ago';
        req.tempCelsius = 3.9;
      } else if (req.status === 'IN_TRANSIT') {
        req.dispatchedTime = 'In Transit (En Route)';
        req.tempCelsius = 4.0;
        req.etaMinutes = 8;
      } else if (req.status === 'DELIVERED') {
        req.dispatchedTime = 'Delivered & Stored in Blood Bank';
        req.etaMinutes = 0;
      }
      this.save();
      this.showToast('Logistics Update', `Requisition ${req.requisitionId} updated to ${req.status.replace(/_/g, ' ')}.`, 'info');
    }
  }
}

export const store = new Store();
