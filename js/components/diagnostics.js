/**
 * PulsePoint Diagnostic Lab Booking Component
 * Diagnostic test catalog, interactive 7-day calendar, morning/afternoon/evening slots, and digital booking pass
 */

import { store } from '../store.js';

let selectedTestId = 'test-01';
let selectedDateIndex = 0; // Today + offset
let selectedSlotTime = '08:00 AM - 09:00 AM';

export function renderDiagnosticsModule(container) {
  const tests = store.state.tests;
  const selectedTest = tests.find(t => t.id === selectedTestId) || tests[0];

  // Generate next 7 dates
  const dateOptions = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dateOptions.push({
      index: i,
      dayStr: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      numStr: d.getDate(),
      monthStr: d.toLocaleDateString('en-US', { month: 'short' }),
      isoDate: d.toISOString().split('T')[0]
    });
  }

  const currentDateObj = dateOptions[selectedDateIndex];

  container.innerHTML = `
    <!-- Module Header -->
    <div class="section-header-block">
      <div>
        <h2 class="section-header-title">Diagnostic Lab & Pathology Appointment Hub</h2>
        <p class="section-header-subtitle">
          Schedule clinical laboratory screenings and radiology scans with fast digital results delivery.
        </p>
      </div>
      <button class="btn-outline btn-sm" id="viewBookingsBtn">
        📋 My Appointments (${store.state.bookings.length})
      </button>
    </div>

    <!-- Diagnostic Two-Column Booking Layout -->
    <div class="diagnostic-layout-grid">
      <!-- Left Column: Test Catalog -->
      <div class="test-catalog-list">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--slate-900); margin-bottom: 4px;">
          Available Diagnostic Panels & Scans
        </h3>
        <p style="font-size: 0.825rem; color: var(--slate-500); margin-bottom: 12px;">
          Select a test to configure appointment time and patient pre-test guidelines.
        </p>

        ${tests.map(test => {
          const isSelected = test.id === selectedTest.id;
          return `
            <div class="test-item-card ${isSelected ? 'selected' : ''}" data-test-id="${test.id}">
              <div class="test-item-header">
                <div>
                  <h4 class="test-title">${test.name}</h4>
                  <span class="test-code-badge">${test.category} &bull; Code: ${test.code}</span>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">$${test.price.toFixed(2)}</span>
                  <span style="display: block; font-size: 0.725rem; color: var(--slate-500);">Digital Report</span>
                </div>
              </div>

              <p class="test-desc">${test.description}</p>

              <div class="test-meta-row">
                <span class="test-meta-item">
                  ⏱️ Turnaround: <strong>${test.turnaround}</strong>
                </span>
                <span class="test-meta-item">
                  🧪 Sample: <strong>${test.sampleType}</strong>
                </span>
                <span class="test-meta-item" style="color: ${test.fastingHours > 0 ? 'var(--warning-700)' : 'var(--success-700)'};">
                  ${test.fastingHours > 0 ? `⚠️ ${test.fastingHours}h Fasting Required` : '✅ No Fasting Needed'}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Right Column: Interactive Slot Selector & Patient Form -->
      <div class="booking-panel-card">
        <h3 class="booking-panel-title">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Select Date & Slot
        </h3>

        <!-- Selected Test Pill -->
        <div class="selected-test-summary-box">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-700); text-transform: uppercase;">Configuring Appointment</span>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--slate-900);">${selectedTest.name}</h4>
              <p style="font-size: 0.775rem; color: var(--slate-600); margin-top: 4px;">
                Preparation: ${selectedTest.preparation}
              </p>
            </div>
            <strong style="font-size: 1.1rem; color: var(--primary-900);">$${selectedTest.price.toFixed(2)}</strong>
          </div>
        </div>

        <!-- 7-Day Date Picker Chips -->
        <div>
          <label class="form-label" style="margin-bottom: 8px; display: block;">Appointment Date</label>
          <div class="calendar-chips-bar" id="dateChipsBar">
            ${dateOptions.map(opt => `
              <div class="date-chip ${opt.index === selectedDateIndex ? 'active' : ''}" data-date-idx="${opt.index}">
                <div class="date-chip-day">${opt.dayStr}</div>
                <div class="date-chip-num">${opt.numStr}</div>
                <div style="font-size: 0.65rem; opacity: 0.8;">${opt.monthStr}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Slot Picker Chips -->
        <div class="slot-section-group">
          <span class="slot-period-label">Morning Slots (Fasting Optimized)</span>
          <div class="slot-chips-grid">
            <button type="button" class="time-slot-btn ${selectedSlotTime === '08:00 AM - 09:00 AM' ? 'active' : ''}" data-slot="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</button>
            <button type="button" class="time-slot-btn ${selectedSlotTime === '09:30 AM - 10:30 AM' ? 'active' : ''}" data-slot="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM</button>
            <button type="button" class="time-slot-btn ${selectedSlotTime === '11:00 AM - 12:00 PM' ? 'active' : ''}" data-slot="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</button>
          </div>

          <span class="slot-period-label" style="margin-top: 8px;">Afternoon & Evening Slots</span>
          <div class="slot-chips-grid">
            <button type="button" class="time-slot-btn ${selectedSlotTime === '01:30 PM - 02:30 PM' ? 'active' : ''}" data-slot="01:30 PM - 02:30 PM">01:30 PM - 02:30 PM</button>
            <button type="button" class="time-slot-btn ${selectedSlotTime === '03:30 PM - 04:30 PM' ? 'active' : ''}" data-slot="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM</button>
            <button type="button" class="time-slot-btn ${selectedSlotTime === '05:30 PM - 06:30 PM' ? 'active' : ''}" data-slot="05:30 PM - 06:30 PM">05:30 PM - 06:30 PM</button>
          </div>
        </div>

        <!-- Patient Contact Form -->
        <form id="labBookingForm" style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="bookingPatientName">Patient Full Name</label>
            <input type="text" id="bookingPatientName" class="form-input" placeholder="e.g. Rachel Adams" value="Rachel Adams" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="bookingPatientPhone">Phone Number</label>
              <input type="tel" id="bookingPatientPhone" class="form-input" placeholder="+1 (555) 000-0000" value="+1 (555) 019-7722" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="bookingPatientEmail">Email Address</label>
              <input type="email" id="bookingPatientEmail" class="form-input" placeholder="rachel@example.com" value="rachel.adams@example.com" required />
            </div>
          </div>

          <button type="submit" class="btn-primary" style="margin-top: 8px; width: 100%;">
            Confirm Appointment ($${selectedTest.price.toFixed(2)})
          </button>
        </form>
      </div>
    </div>

    <!-- Booking Confirmation Receipt Modal -->
    <dialog id="bookingSuccessModal" style="max-width: 500px;">
      <div class="modal-header">
        <h3>🎉 Appointment Confirmed!</h3>
        <button class="modal-close-btn" id="closeSuccessModalBtn">&times;</button>
      </div>
      <div class="modal-body" id="bookingSuccessModalBody">
        <!-- Rendered dynamically -->
      </div>
      <div class="modal-footer">
        <button class="btn-outline btn-sm" id="printReceiptBtn">🖨️ Print Digital Pass</button>
        <button class="btn-primary btn-sm" id="doneSuccessModalBtn">Done</button>
      </div>
    </dialog>

    <!-- My Appointments History Modal -->
    <dialog id="historyModal" style="max-width: 640px;">
      <div class="modal-header">
        <h3>My Diagnostic Lab Appointments</h3>
        <button class="modal-close-btn" id="closeHistoryModalBtn">&times;</button>
      </div>
      <div class="modal-body">
        ${store.state.bookings.length === 0 ? `
          <p style="text-align: center; color: var(--slate-500); padding: 24px;">No appointment bookings on record yet.</p>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${store.state.bookings.map(b => `
              <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: var(--primary-800);">${b.testName}</strong>
                  <span class="badge badge-success">${b.status}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.8rem; color: var(--slate-600);">
                  <span>📅 ${b.slotDate} at ${b.slotTime}</span>
                  <span style="font-family: monospace; font-weight: 700;">Ref: ${b.bookingRef}</span>
                </div>
                <div style="font-size: 0.775rem; color: var(--slate-500); margin-top: 4px;">
                  Patient: ${b.patientName} &bull; ${b.fastingRequired}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
      <div class="modal-footer">
        <button class="btn-primary btn-sm" id="closeHistoryOkBtn">Close</button>
      </div>
    </dialog>
  `;

  setupDiagnosticsEvents(container, dateOptions);
}

function setupDiagnosticsEvents(container, dateOptions) {
  const testCards = container.querySelectorAll('.test-item-card');
  const dateChips = container.querySelectorAll('.date-chip');
  const slotBtns = container.querySelectorAll('.time-slot-btn');
  const bookingForm = container.querySelector('#labBookingForm');

  const successModal = container.querySelector('#bookingSuccessModal');
  const successModalBody = container.querySelector('#bookingSuccessModalBody');
  const closeSuccessModalBtn = container.querySelector('#closeSuccessModalBtn');
  const doneSuccessModalBtn = container.querySelector('#doneSuccessModalBtn');
  const printReceiptBtn = container.querySelector('#printReceiptBtn');

  const viewBookingsBtn = container.querySelector('#viewBookingsBtn');
  const historyModal = container.querySelector('#historyModal');
  const closeHistoryModalBtn = container.querySelector('#closeHistoryModalBtn');
  const closeHistoryOkBtn = container.querySelector('#closeHistoryOkBtn');

  testCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedTestId = card.dataset.testId;
      renderDiagnosticsModule(container);
    });
  });

  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      selectedDateIndex = Number(chip.dataset.dateIdx);
      renderDiagnosticsModule(container);
    });
  });

  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSlotTime = btn.dataset.slot;
      renderDiagnosticsModule(container);
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = container.querySelector('#bookingPatientName').value.trim();
      const patientPhone = container.querySelector('#bookingPatientPhone').value.trim();
      const patientEmail = container.querySelector('#bookingPatientEmail').value.trim();
      const targetDate = dateOptions[selectedDateIndex].isoDate;

      const newBooking = store.bookLabSlot({
        testId: selectedTestId,
        slotDate: targetDate,
        slotTime: selectedSlotTime,
        patientName,
        patientPhone,
        patientEmail
      });

      if (newBooking) {
        successModalBody.innerHTML = `
          <div class="digital-booking-pass">
            <div class="pass-header">
              <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">PulsePoint Medical Pass</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--slate-900);">${newBooking.testName}</h4>
              </div>
              <span class="pass-ref-badge">${newBooking.bookingRef}</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem;">
              <div>
                <span style="color: var(--slate-500);">Patient:</span>
                <strong>${newBooking.patientName}</strong>
              </div>
              <div>
                <span style="color: var(--slate-500);">Date & Time:</span>
                <strong>${newBooking.slotDate}</strong><br />
                <span>${newBooking.slotTime}</span>
              </div>
              <div>
                <span style="color: var(--slate-500);">Facility:</span>
                <span>PulsePoint Diagnostic Center</span>
              </div>
              <div>
                <span style="color: var(--slate-500);">Guideline:</span>
                <span style="color: var(--warning-700); font-weight: 700;">${newBooking.fastingRequired}</span>
              </div>
            </div>

            <div style="background: var(--slate-100); border-radius: var(--radius-sm); padding: 8px; text-align: center; margin-top: 6px;">
              <span style="font-family: monospace; font-size: 0.85rem; letter-spacing: 0.2em; color: var(--slate-700);">
                ||| | ||||| || |||| ||| ||||||| |||
              </span>
              <span style="display: block; font-size: 0.65rem; color: var(--slate-400); margin-top: 2px;">SECURE DIGITAL BARCODE TOKEN</span>
            </div>
          </div>
        `;
        successModal.showModal();
        renderDiagnosticsModule(container);
      }
    });
  }

  const closeSuccess = () => { if (successModal.open) successModal.close(); };
  if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', closeSuccess);
  if (doneSuccessModalBtn) doneSuccessModalBtn.addEventListener('click', closeSuccess);

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (viewBookingsBtn && historyModal) {
    viewBookingsBtn.addEventListener('click', () => historyModal.showModal());
  }

  const closeHistory = () => { if (historyModal.open) historyModal.close(); };
  if (closeHistoryModalBtn) closeHistoryModalBtn.addEventListener('click', closeHistory);
  if (closeHistoryOkBtn) closeHistoryOkBtn.addEventListener('click', closeHistory);
}
