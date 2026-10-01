/**
 * PulsePoint Public Blood Availability Overview Component
 * Public-facing aggregated dashboard with strict HIPAA data privacy masking
 */

import { store } from '../store.js';

export function renderBloodPublicModule(container) {
  const aggregated = store.getAggregatedBloodSupply();
  const groups = Object.values(aggregated);

  const totalUnits = groups.reduce((acc, g) => acc + g.units, 0);
  const criticalCount = groups.filter(g => g.status === 'CRITICAL LOW').length;
  const optimalCount = groups.filter(g => g.status === 'OPTIMAL').length;

  container.innerHTML = `
    <!-- Module Header -->
    <div class="section-header-block">
      <div>
        <h2 class="section-header-title">Regional Blood Supply & Availability Overview</h2>
        <p class="section-header-subtitle">
          Real-time aggregated blood bank inventories across certified regional trauma centers and community blood banks.
        </p>
      </div>
      <button class="btn-danger btn-sm" id="jumpToDonorPortalBtn">
        ❤️ Register as Voluntary Donor
      </button>
    </div>

    <!-- Strict Data Privacy Notice Banner -->
    <div class="privacy-shield-banner">
      <div class="privacy-shield-left">
        <div class="privacy-icon-box">🛡️</div>
        <div class="privacy-shield-text">
          <h4>Public Data Privacy & Security Shield Active</h4>
          <p>
            Public data is strictly aggregated across regional health centers. Storage facility coordinates, cold-chain batch IDs, and private donor logs are cryptographically sealed and accessible only by verified hospital admins.
          </p>
        </div>
      </div>
      <span class="badge-hipaa">🔒 HIPAA / GDPR Compliant</span>
    </div>

    <!-- Aggregate Regional Supply Metrics -->
    <div class="blood-stats-row">
      <div class="blood-stat-card">
        <div class="blood-stat-icon" style="background: var(--primary-50); color: var(--primary-600);">🩸</div>
        <div class="blood-stat-info">
          <strong>${totalUnits} Units</strong>
          <span>Total Regional Reserve</span>
        </div>
      </div>

      <div class="blood-stat-card">
        <div class="blood-stat-icon" style="background: var(--blood-50); color: var(--blood-600);">⚠️</div>
        <div class="blood-stat-info">
          <strong style="color: var(--blood-600);">${criticalCount} Groups</strong>
          <span>Critical Shortage Levels</span>
        </div>
      </div>

      <div class="blood-stat-card">
        <div class="blood-stat-icon" style="background: var(--success-50); color: var(--success-600);">✅</div>
        <div class="blood-stat-info">
          <strong style="color: var(--success-600);">${optimalCount} Groups</strong>
          <span>Sufficient Inventory Level</span>
        </div>
      </div>

      <div class="blood-stat-card">
        <div class="blood-stat-icon" style="background: var(--teal-50); color: var(--teal-600);">❄️</div>
        <div class="blood-stat-info">
          <strong style="color: var(--teal-600);">3.9 &deg;C Avg</strong>
          <span>Monitored Cold-Chain Temp</span>
        </div>
      </div>
    </div>

    <!-- 8 Blood Group Cards Grid -->
    <div class="blood-groups-grid">
      ${groups.map(grp => {
        const isCritical = grp.status === 'CRITICAL LOW';
        let fillWidth = Math.min(100, Math.max(12, (grp.units / 45) * 100));
        let fillClass = 'fill-optimal';
        if (grp.status === 'CRITICAL LOW') fillClass = 'fill-critical';
        else if (grp.status === 'LOW SUPPLY') fillClass = 'fill-low';
        else if (grp.status === 'MODERATE') fillClass = 'fill-moderate';

        const isUniversalDonor = grp.group === 'O-';
        const isUniversalRecipient = grp.group === 'AB+';

        return `
          <div class="blood-group-card ${isCritical ? 'critical-stock' : ''}">
            <div class="blood-card-top">
              <span class="blood-group-symbol">${grp.group}</span>
              <span class="badge ${grp.badgeClass}">${grp.status}</span>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                <span style="font-size: 0.85rem; color: var(--slate-600); font-weight: 600;">Regional Stock</span>
                <strong style="font-size: 1.15rem; color: var(--slate-900);">${grp.units} Units</strong>
              </div>
              <div class="blood-supply-gauge">
                <div class="blood-supply-fill ${fillClass}" style="width: ${fillWidth}%;"></div>
              </div>
            </div>

            <div class="blood-card-details">
              ${isUniversalDonor ? '<span style="color: var(--blood-700); font-weight: 700;">🌟 Universal RBC Donor</span>' : ''}
              ${isUniversalRecipient ? '<span style="color: var(--primary-700); font-weight: 700;">🌟 Universal RBC Recipient</span>' : ''}
              <span>Can donate to: <strong>${grp.compatibility.canDonateTo.slice(0, 4).join(', ')}${grp.compatibility.canDonateTo.length > 4 ? '...' : ''}</strong></span>
              <span>Can receive from: <strong>${grp.compatibility.canReceiveFrom.join(', ')}</strong></span>
            </div>

            <button 
              class="btn-outline btn-sm volunteer-group-btn" 
              data-group="${grp.group}"
              style="margin-top: auto; width: 100%; border-color: ${isCritical ? 'var(--blood-300)' : 'var(--slate-300)'}; color: ${isCritical ? 'var(--blood-700)' : 'var(--slate-700)'};"
            >
              Volunteer as ${grp.group} Donor &rarr;
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Clinical Compatibility Matrix -->
    <div class="compatibility-container">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--slate-900);">
            🩸 Clinical Blood Group Compatibility Matrix
          </h3>
          <p style="font-size: 0.825rem; color: var(--slate-500); margin-top: 2px;">
            Standard emergency red blood cell crossmatching criteria for patient transfusions.
          </p>
        </div>
        <span class="badge badge-info">Emergency Reference</span>
      </div>

      <div style="overflow-x: auto;">
        <table class="compat-table">
          <thead>
            <tr>
              <th>Blood Type</th>
              <th>Can Safely Donate RBCs To</th>
              <th>Can Safely Receive RBCs From</th>
              <th>Special Clinical Classification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color: var(--blood-700); font-size: 1.1rem;">O-</strong></td>
              <td><span class="compat-pill">O-</span><span class="compat-pill">O+</span><span class="compat-pill">A-</span><span class="compat-pill">A+</span><span class="compat-pill">B-</span><span class="compat-pill">B+</span><span class="compat-pill">AB-</span><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">O-</span></td>
              <td><strong style="color: var(--blood-600);">Universal Red Cell Donor</strong> (Emergency Trauma Resuscitation)</td>
            </tr>
            <tr>
              <td><strong style="color: var(--slate-800); font-size: 1.1rem;">O+</strong></td>
              <td><span class="compat-pill">O+</span><span class="compat-pill">A+</span><span class="compat-pill">B+</span><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">O+</span><span class="compat-pill">O-</span></td>
              <td>Most common blood type in emergency surgery intake</td>
            </tr>
            <tr>
              <td><strong style="color: var(--slate-800); font-size: 1.1rem;">A-</strong></td>
              <td><span class="compat-pill">A-</span><span class="compat-pill">A+</span><span class="compat-pill">AB-</span><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">A-</span><span class="compat-pill">O-</span></td>
              <td>Rare negative Rh-factor patient match</td>
            </tr>
            <tr>
              <td><strong style="color: var(--slate-800); font-size: 1.1rem;">A+</strong></td>
              <td><span class="compat-pill">A+</span><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">A+</span><span class="compat-pill">A-</span><span class="compat-pill">O+</span><span class="compat-pill">O-</span></td>
              <td>High clinical surgical utilization</td>
            </tr>
            <tr>
              <td><strong style="color: var(--slate-800); font-size: 1.1rem;">B-</strong></td>
              <td><span class="compat-pill">B-</span><span class="compat-pill">B+</span><span class="compat-pill">AB-</span><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">B-</span><span class="compat-pill">O-</span></td>
              <td>High scarcity; rapid emergency response required</td>
            </tr>
            <tr>
              <td><strong style="color: var(--slate-800); font-size: 1.1rem;">B+</strong></td>
              <td><span class="compat-pill">B+</span><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">B+</span><span class="compat-pill">B-</span><span class="compat-pill">O+</span><span class="compat-pill">O-</span></td>
              <td>Cardiac & oncology surgical support</td>
            </tr>
            <tr>
              <td><strong style="color: var(--slate-800); font-size: 1.1rem;">AB-</strong></td>
              <td><span class="compat-pill">AB-</span><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">AB-</span><span class="compat-pill">A-</span><span class="compat-pill">B-</span><span class="compat-pill">O-</span></td>
              <td>Rarest blood phenotype; universal plasma donor</td>
            </tr>
            <tr>
              <td><strong style="color: var(--primary-700); font-size: 1.1rem;">AB+</strong></td>
              <td><span class="compat-pill">AB+</span></td>
              <td><span class="compat-pill">All Blood Types</span></td>
              <td><strong style="color: var(--primary-700);">Universal Red Cell Recipient</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupBloodPublicEvents(container);
}

function setupBloodPublicEvents(container) {
  const jumpBtn = container.querySelector('#jumpToDonorPortalBtn');
  const volunteerBtns = container.querySelectorAll('.volunteer-group-btn');

  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      store.setActiveTab('donor-portal');
    });
  }

  volunteerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      store.setActiveTab('donor-portal');
      // pre-select blood group in donor registration form if available
      setTimeout(() => {
        const bgSelect = document.querySelector('#donorBloodGroupSelect');
        if (bgSelect) {
          bgSelect.value = group;
        }
      }, 50);
    });
  });
}
