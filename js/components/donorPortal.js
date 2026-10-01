/**
 * PulsePoint Voluntary Donor Portal Component
 * Voluntary donor registration, eligibility calculator, digital donor card, and simulated emergency blood alert dispatch
 */

import { store } from '../store.js';

export function renderDonorPortalModule(container) {
  const state = store.state;
  const currentDonor = state.currentDonorProfile;
  const alerts = state.emergencyAlerts;

  container.innerHTML = `
    <!-- Module Header -->
    <div class="section-header-block">
      <div>
        <h2 class="section-header-title">Voluntary Donor Network & Emergency Standby</h2>
        <p class="section-header-subtitle">
          Join the rapid-response voluntary blood donor registry. Receive immediate notifications during local trauma emergencies.
        </p>
      </div>
      <span class="badge badge-danger">🚨 3 Urgent Trauma Alerts Active</span>
    </div>

    <!-- Two-Column Layout: Registration & Digital ID / Alerts -->
    <div class="donor-layout-grid">
      <!-- Left Column: Registration & Eligibility Form -->
      <div class="donor-registration-card">
        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--slate-900); margin-bottom: 6px;">
          ${currentDonor ? 'Update Your Voluntary Donor Profile' : 'Register as a Life-Saving Donor'}
        </h3>
        <p style="font-size: 0.825rem; color: var(--slate-600); margin-bottom: 20px;">
          Safe, confidential, and life-saving. Your contact details remain encrypted and will only be contacted when matching emergency units are needed.
        </p>

        <form id="donorRegistrationForm" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label" for="donorFullName">Full Name</label>
            <input 
              type="text" 
              id="donorFullName" 
              class="form-input" 
              placeholder="e.g. Jordan Miller" 
              value="${currentDonor ? currentDonor.fullName : 'Jordan Miller'}" 
              required 
            />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="donorBloodGroupSelect">Blood Group</label>
              <select id="donorBloodGroupSelect" class="form-select" required>
                <option value="O-" ${currentDonor && currentDonor.bloodGroup === 'O-' ? 'selected' : ''}>O- (Universal Donor)</option>
                <option value="O+" ${currentDonor && currentDonor.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                <option value="A-" ${currentDonor && currentDonor.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                <option value="A+" ${currentDonor && currentDonor.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                <option value="B-" ${currentDonor && currentDonor.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                <option value="B+" ${currentDonor && currentDonor.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                <option value="AB-" ${currentDonor && currentDonor.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                <option value="AB+" ${currentDonor && currentDonor.bloodGroup === 'AB+' ? 'selected' : ''}>AB+ (Universal Recipient)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="donorDistrict">District / City Zone</label>
              <input 
                type="text" 
                id="donorDistrict" 
                class="form-input" 
                placeholder="e.g. Downtown Metro" 
                value="${currentDonor ? currentDonor.district : 'Downtown Metro'}" 
                required 
              />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="donorAge">Age (18 - 65 yrs)</label>
              <input 
                type="number" 
                id="donorAge" 
                class="form-input" 
                min="18" 
                max="65" 
                value="${currentDonor ? currentDonor.age : 28}" 
                required 
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="donorWeight">Weight (min 50 kg)</label>
              <input 
                type="number" 
                id="donorWeight" 
                class="form-input" 
                min="50" 
                step="0.5" 
                value="${currentDonor ? currentDonor.weightKg : 68}" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="donorPhone">Mobile Phone (Protected Contact)</label>
            <input 
              type="tel" 
              id="donorPhone" 
              class="form-input" 
              placeholder="+1 (555) 000-0000" 
              value="${currentDonor && currentDonor.phone ? currentDonor.phone : '+1 (555) 019-9482'}" 
              required 
            />
            <small style="font-size: 0.725rem; color: var(--slate-500); margin-top: 2px;">
              🛡️ Your phone is masked (e.g. 98451*****) and never shared with commercial entities.
            </small>
          </div>

          <label class="filter-checkbox-label" style="margin-top: 4px;">
            <input type="checkbox" id="emergencyStandbyToggle" ${!currentDonor || currentDonor.emergencyStandby ? 'checked' : ''} />
            <strong>Enable Emergency Standby SMS Broadcasts</strong>
          </label>

          <button type="submit" class="btn-primary" style="margin-top: 10px;">
            ${currentDonor ? 'Update Donor Pass & Availability' : 'Submit Registration & Generate Pass'}
          </button>
        </form>
      </div>

      <!-- Right Column: Digital Donor Card & Simulated Emergency Alerts -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Digital Donor Pass Hologram Card -->
        ${currentDonor ? `
          <div class="digital-donor-badge-card" id="digitalDonorCard">
            <div class="donor-badge-header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">🩸</span>
                <span style="font-weight: 800; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                  PulsePoint Voluntary Donor Pass
                </span>
              </div>
              <span class="donor-id-code">${currentDonor.donorCardId || 'DONOR-US-99120'}</span>
            </div>

            <div class="donor-badge-main">
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.75;">Registered Voluntary Donor</span>
                <h3 class="donor-name-large">${currentDonor.fullName}</h3>
                <p style="font-size: 0.8rem; opacity: 0.85; margin-top: 4px;">
                  📍 ${currentDonor.district} &bull; Age ${currentDonor.age} &bull; ${currentDonor.weightKg} kg
                </p>
              </div>

              <div style="text-align: center;">
                <div class="donor-blood-callout">${currentDonor.bloodGroup}</div>
                <span style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 4px;">Verified Group</span>
              </div>
            </div>

            <div class="donor-badge-footer">
              <div>
                <span>Emergency Standby: </span>
                <strong style="color: #4ade80;">${currentDonor.emergencyStandby ? 'ACTIVE ON-CALL' : 'STANDBY'}</strong>
              </div>
              <div style="font-family: monospace; font-size: 0.75rem;">
                QR VALID: [SECURE-PASS]
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Simulated Emergency Blood Alerts Feed -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--slate-900); display: flex; align-items: center; gap: 8px;">
              <span class="pulsing-alert-dot" style="background: var(--blood-600);"></span>
              Live Trauma Emergency Alerts
            </h3>
            <span class="badge badge-danger">Live Broadcast</span>
          </div>

          <div class="emergency-alerts-list">
            ${alerts.map(alert => `
              <div class="emergency-alert-card">
                <div class="alert-card-top">
                  <div>
                    <span class="badge ${alert.urgency === 'CODE_RED_CRITICAL' ? 'badge-danger pulse-dot' : 'badge-warning'}">
                      ${alert.urgency === 'CODE_RED_CRITICAL' ? 'CODE RED: LEVEL 1 TRAUMA' : 'HIGH PRIORITY SURGERY'}
                    </span>
                    <h4 class="alert-hospital-title" style="margin-top: 6px;">${alert.hospitalName}</h4>
                  </div>
                  <div style="text-align: right;">
                    <strong style="font-size: 1.6rem; color: var(--blood-600); line-height: 1;">${alert.bloodGroup}</strong>
                    <span style="display: block; font-size: 0.75rem; color: var(--slate-500);">${alert.unitsNeeded} Units Needed</span>
                  </div>
                </div>

                <p style="font-size: 0.85rem; color: var(--slate-700); line-height: 1.4;">
                  ${alert.summary}
                </p>

                <div style="font-size: 0.75rem; color: var(--slate-500);">
                  📍 Facility: <strong>${alert.location}</strong> &bull; Broadcast: ${alert.postedAgo}
                </div>

                <div class="alert-actions-row">
                  <span style="font-size: 0.75rem; color: var(--success-700); font-weight: 600;">
                    🛡️ Fast-Track Donor Triage Ready
                  </span>
                  <button class="btn-danger btn-sm respond-alert-btn" data-alert-id="${alert.id}">
                    ❤️ I Can Donate Now
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Response Confirmation Modal -->
    <dialog id="alertResponseModal">
      <div class="modal-header">
        <h3>🚨 Emergency Response Acknowledgement</h3>
        <button class="modal-close-btn" id="closeResponseModalBtn">&times;</button>
      </div>
      <div class="modal-body" id="alertResponseModalBody">
        <!-- Rendered dynamically -->
      </div>
      <div class="modal-footer">
        <button class="btn-primary btn-sm" id="closeResponseOkBtn">Understood & Ready</button>
      </div>
    </dialog>
  `;

  setupDonorEvents(container);
}

function setupDonorEvents(container) {
  const form = container.querySelector('#donorRegistrationForm');
  const alertBtns = container.querySelectorAll('.respond-alert-btn');
  const responseModal = container.querySelector('#alertResponseModal');
  const responseModalBody = container.querySelector('#alertResponseModalBody');
  const closeResponseModalBtn = container.querySelector('#closeResponseModalBtn');
  const closeResponseOkBtn = container.querySelector('#closeResponseOkBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = container.querySelector('#donorFullName').value.trim();
      const bloodGroup = container.querySelector('#donorBloodGroupSelect').value;
      const district = container.querySelector('#donorDistrict').value.trim();
      const age = container.querySelector('#donorAge').value;
      const weightKg = container.querySelector('#donorWeight').value;
      const phone = container.querySelector('#donorPhone').value.trim();
      const emergencyStandby = container.querySelector('#emergencyStandbyToggle').checked;

      const profile = store.registerDonor({
        fullName,
        bloodGroup,
        district,
        age,
        weightKg,
        phone,
        emergencyStandby
      });

      if (profile) {
        renderDonorPortalModule(container);
      }
    });
  }

  alertBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const alertId = btn.dataset.alertId;
      const alert = store.state.emergencyAlerts.find(a => a.id === alertId);
      if (!alert) return;

      store.respondToEmergencyAlert(alertId);

      responseModalBody.innerHTML = `
        <div style="background: var(--blood-50); border: 1px solid var(--blood-100); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
          <h4 style="color: var(--blood-700); font-size: 1.05rem; font-weight: 800;">Emergency Transfusion Center Alerted</h4>
          <p style="font-size: 0.85rem; color: var(--slate-700); margin-top: 6px;">
            You have responded to the urgent blood alert for <strong>${alert.bloodGroup} (${alert.unitsNeeded} units)</strong> at <strong>${alert.hospitalName}</strong>.
          </p>
        </div>

        <div style="font-size: 0.85rem; color: var(--slate-700); display: flex; flex-direction: column; gap: 8px;">
          <div>📍 <strong>Address:</strong> ${alert.location}</div>
          <div>⏱️ <strong>Fast-Track Desk:</strong> Report to Emergency Triage Bay 1 (Show your Digital Donor Pass)</div>
          <div>📞 <strong>Coordinator Line:</strong> +1 (555) 019-9111</div>
          <p style="font-size: 0.775rem; color: var(--slate-500); margin-top: 6px;">
            Thank you for being a voluntary donor. A clinical nurse has been notified and is preparing the collection station.
          </p>
        </div>
      `;

      responseModal.showModal();
    });
  });

  const closeResp = () => { if (responseModal.open) responseModal.close(); };
  if (closeResponseModalBtn) closeResponseModalBtn.addEventListener('click', closeResp);
  if (closeResponseOkBtn) closeResponseOkBtn.addEventListener('click', closeResp);
}
