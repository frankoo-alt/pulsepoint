/**
 * PulsePoint Navbar Component
 * Navigation tabs, role switcher, emergency ticker, and verified admin modal
 */

import { store, ADMIN_PASSKEY } from '../store.js';

export function renderNavbar(container) {
  const state = store.state;
  const activeAlert = state.emergencyAlerts.find(a => a.active) || state.emergencyAlerts[0];

  container.innerHTML = `
    <!-- Top Emergency Broadcast Marquee -->
    <aside class="emergency-ticker-bar" aria-label="Urgent Emergency Broadcast">
      <div class="ticker-content">
        <span class="ticker-badge">
          <span class="pulsing-alert-dot"></span>
          URGENT BLOOD NEED
        </span>
        <span id="tickerMessage">
          <strong>${activeAlert ? activeAlert.hospitalName : 'Regional Trauma Center'}</strong>: 
          Immediate need for <strong>${activeAlert ? activeAlert.unitsNeeded : '2'} Units of ${activeAlert ? activeAlert.bloodGroup : 'O-'}</strong> (${activeAlert ? activeAlert.title : 'Critical Trauma Intake'})
        </span>
      </div>
      <button class="ticker-action-btn" id="tickerRespondBtn">
        I Can Donate Now &rarr;
      </button>
    </aside>

    <!-- Main Navigation Header -->
    <header class="site-header">
      <div class="nav-container">
        <!-- Brand Identity -->
        <a href="#home" class="brand-link" id="brandLogoBtn">
          <img src="assets/logo.png" alt="PulsePoint Emblem" class="brand-logo-img" />
          <div class="brand-text">
            <h1>Pulse<span>Point</span></h1>
            <span class="brand-tagline">Healthcare, Pharmacy & Blood Logistics Hub</span>
          </div>
        </a>

        <!-- Portal Navigation Tabs -->
        <nav class="nav-tabs" aria-label="Portal Modules">
          <button class="nav-tab-btn ${state.activeTab === 'pharmacy' ? 'active' : ''}" data-tab="pharmacy">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            Pharmacy Finder
          </button>

          <button class="nav-tab-btn ${state.activeTab === 'diagnostics' ? 'active' : ''}" data-tab="diagnostics">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Diagnostic Lab Booking
          </button>

          <button class="nav-tab-btn ${state.activeTab === 'blood-public' ? 'active' : ''}" data-tab="blood-public">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
            Blood Availability
          </button>

          <button class="nav-tab-btn ${state.activeTab === 'donor-portal' ? 'active' : ''}" data-tab="donor-portal">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
            Voluntary Donor Hub
          </button>

          <button class="nav-tab-btn tab-pharm-admin ${state.activeTab === 'pharmacy-admin' ? 'active' : ''}" data-tab="pharmacy-admin">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            Medical Shop Admin
          </button>

          <button class="nav-tab-btn tab-restricted ${state.activeTab === 'hospital-admin' ? 'active' : ''}" data-tab="hospital-admin">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Hospital Admin (Restricted)
          </button>
        </nav>

        <!-- Role Control & Access -->
        <div class="role-control-group">
          <div class="role-badge-pill" title="Active Security Scope">
            <span>Role:</span>
            <select class="role-select-dropdown" id="roleSwitcherSelect" aria-label="Switch User Role">
              <option value="PATIENT" ${state.currentRole === 'PATIENT' ? 'selected' : ''}>👤 Public Patient</option>
              <option value="DONOR" ${state.currentRole === 'DONOR' ? 'selected' : ''}>🩸 Voluntary Donor</option>
              <option value="PHARMACY_ADMIN" ${state.currentRole === 'PHARMACY_ADMIN' ? 'selected' : ''}>💊 Medical Shop Admin</option>
              <option value="HOSPITAL_ADMIN" ${state.currentRole === 'HOSPITAL_ADMIN' ? 'selected' : ''}>🏥 Verified Hospital Admin</option>
            </select>
          </div>

          <button class="btn-demo-reset" id="resetDemoBtn" title="Reset dataset to default seed">
            ↻ Reset Demo
          </button>
        </div>
      </div>
    </header>

    <!-- Admin Authentication Security Modal -->
    <dialog id="adminAuthModal">
      <div class="modal-header">
        <h3>🔒 Verified Hospital Security Clearance</h3>
        <button class="modal-close-btn" id="closeAuthModalBtn">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.875rem; color: var(--slate-600); margin-bottom: 16px;">
          This restricted environment provides access to cold-chain blood inventories, private storage racks, and inter-facility emergency requisitions.
        </p>
        
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" for="hospitalKeyInput">Medical Passkey / Staff Token</label>
          <input type="password" id="hospitalKeyInput" class="form-input" placeholder="Enter passkey e.g., MED-AUTH-9082" />
        </div>

        <div class="demo-passkey-hint">
          <strong>Hackathon Testing Key:</strong>
          <button type="button" class="demo-passkey-btn" id="autofillPasskeyBtn">Autofill: ${ADMIN_PASSKEY}</button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline btn-sm" id="cancelAuthModalBtn">Cancel</button>
        <button class="btn-primary btn-sm" id="verifyAuthModalBtn">Unlock Restricted Portal</button>
      </div>
    </dialog>
  `;

  // Attach event handlers
  setupNavbarEvents();
}

function setupNavbarEvents() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  const roleSelect = document.getElementById('roleSwitcherSelect');
  const authModal = document.getElementById('adminAuthModal');
  const hospitalKeyInput = document.getElementById('hospitalKeyInput');
  const autofillPasskeyBtn = document.getElementById('autofillPasskeyBtn');
  const verifyAuthModalBtn = document.getElementById('verifyAuthModalBtn');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
  const cancelAuthModalBtn = document.getElementById('cancelAuthModalBtn');
  const tickerRespondBtn = document.getElementById('tickerRespondBtn');
  const resetDemoBtn = document.getElementById('resetDemoBtn');
  const brandLogoBtn = document.getElementById('brandLogoBtn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (target === 'hospital-admin' && store.state.currentRole !== 'HOSPITAL_ADMIN') {
        authModal.showModal();
        return;
      }
      if (target === 'pharmacy-admin' && store.state.currentRole !== 'PHARMACY_ADMIN') {
        store.setRole('PHARMACY_ADMIN');
        return;
      }
      store.setActiveTab(target);
    });
  });

  if (brandLogoBtn) {
    brandLogoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      store.setActiveTab('pharmacy');
    });
  }

  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const role = e.target.value;
      if (role === 'HOSPITAL_ADMIN' && !store.state.adminSession.isAuthenticated) {
        authModal.showModal();
      } else {
        store.setRole(role);
      }
    });
  }

  if (autofillPasskeyBtn && hospitalKeyInput) {
    autofillPasskeyBtn.addEventListener('click', () => {
      hospitalKeyInput.value = ADMIN_PASSKEY;
    });
  }

  if (verifyAuthModalBtn && hospitalKeyInput) {
    verifyAuthModalBtn.addEventListener('click', () => {
      const success = store.setRole('HOSPITAL_ADMIN', hospitalKeyInput.value.trim());
      if (success) {
        authModal.close();
      }
    });
  }

  const closeDialog = () => {
    if (authModal.open) authModal.close();
    // revert dropdown if cancelled
    if (roleSelect && store.state.currentRole !== 'HOSPITAL_ADMIN') {
      roleSelect.value = store.state.currentRole;
    }
  };

  if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeDialog);
  if (cancelAuthModalBtn) cancelAuthModalBtn.addEventListener('click', closeDialog);

  if (tickerRespondBtn) {
    tickerRespondBtn.addEventListener('click', () => {
      store.setActiveTab('donor-portal');
    });
  }

  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      if (confirm('Reset PulsePoint demo database to initial state?')) {
        store.resetAllData();
      }
    });
  }
}
