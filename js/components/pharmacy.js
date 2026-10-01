/**
 * PulsePoint Pharmacy Finder Component
 * Real-time medicine search, chemist comparative pricing, and live stock status
 */

import { store } from '../store.js';

let currentSearchQuery = '';
let currentCategory = 'ALL';
let showInStockOnly = false;

export function renderPharmacyModule(container) {
  const medicines = store.searchMedicines(currentSearchQuery, currentCategory, showInStockOnly);

  container.innerHTML = `
    <!-- Module Header -->
    <div class="section-header-block">
      <div>
        <h2 class="section-header-title">Prescription & Chemist Stock Finder</h2>
        <p class="section-header-subtitle">
          Search regional pharmacy stocks in real-time. Compare prices across certified chemists and reserve medications instantly.
        </p>
      </div>
      <button class="btn-outline btn-sm" id="comparePricesBtn">
        ⚖️ Compare Chemist Prices
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="search-filter-card">
      <div class="search-input-wrapper">
        <svg class="search-icon-svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input 
          type="text" 
          id="medicineSearchInput" 
          class="search-input-field" 
          placeholder="Search by brand name, generic molecule (e.g. Amoxicillin, Metformin, Lipitor, Ventolin)..." 
          value="${currentSearchQuery}"
        />
      </div>

      <div class="filter-chips-row">
        <div class="chips-group" id="categoryChips">
          <button class="filter-chip-btn ${currentCategory === 'ALL' ? 'active' : ''}" data-cat="ALL">All Categories</button>
          <button class="filter-chip-btn ${currentCategory === 'Antibiotic' ? 'active' : ''}" data-cat="Antibiotic">Antibiotics</button>
          <button class="filter-chip-btn ${currentCategory === 'Antidiabetic' ? 'active' : ''}" data-cat="Antidiabetic">Antidiabetic</button>
          <button class="filter-chip-btn ${currentCategory === 'Cardiovascular' ? 'active' : ''}" data-cat="Cardiovascular">Cardiovascular</button>
          <button class="filter-chip-btn ${currentCategory === 'Respiratory' ? 'active' : ''}" data-cat="Respiratory">Respiratory</button>
          <button class="filter-chip-btn ${currentCategory === 'Analgesic' ? 'active' : ''}" data-cat="Analgesic">Pain & Fever</button>
        </div>

        <label class="filter-checkbox-label">
          <input type="checkbox" id="stockOnlyCheckbox" ${showInStockOnly ? 'checked' : ''} />
          Show In-Stock Dispensaries Only
        </label>
      </div>
    </div>

    <!-- Medicine Stock Cards Grid -->
    <div class="pharmacy-grid">
      ${medicines.length === 0 ? `
        <div style="grid-column: 1 / -1; background: var(--white); border: 1px dashed var(--slate-300); border-radius: var(--radius-lg); padding: 48px; text-align: center;">
          <svg style="margin: 0 auto 12px; color: var(--slate-400);" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          <h3 style="font-size: 1.1rem; color: var(--slate-800); margin-bottom: 6px;">No Matching Medications Found</h3>
          <p style="font-size: 0.85rem; color: var(--slate-500);">Try searching for "Amoxicillin", "Metformin", "Atorvastatin", or clear filters.</p>
        </div>
      ` : medicines.map(med => {
        let stockBadgeClass = 'badge-success';
        let stockLabel = `In Stock (${med.quantity} Units)`;
        if (med.stockStatus === 'LOW_STOCK') {
          stockBadgeClass = 'badge-warning';
          stockLabel = `Low Stock (${med.quantity} left)`;
        } else if (med.stockStatus === 'OUT_OF_STOCK') {
          stockBadgeClass = 'badge-danger';
          stockLabel = 'Out of Stock';
        }

        return `
          <div class="medicine-card">
            <div>
              <div class="medicine-card-header">
                <div>
                  <h3 class="medicine-name">${med.name}</h3>
                  <span class="generic-molecule-badge">🧬 Generic: ${med.genericName}</span>
                </div>
                <span class="badge ${stockBadgeClass}">${stockLabel}</span>
              </div>

              <div class="medicine-specs">
                <span class="medicine-spec-chip">💊 ${med.dosage}</span>
                <span class="medicine-spec-chip">${med.form}</span>
                <span class="medicine-spec-chip">${med.category}</span>
                ${med.prescriptionRequired ? '<span class="medicine-spec-chip" style="color: var(--primary-700); background: var(--primary-50);">Rx Required</span>' : '<span class="medicine-spec-chip" style="color: var(--success-700); background: var(--success-50);">OTC Available</span>'}
              </div>
            </div>

            <!-- Chemist Location & Price Info -->
            <div class="chemist-info-box">
              <div class="chemist-info-top">
                <span class="chemist-name">📍 ${med.facilityName}</span>
                <span class="chemist-distance">0.8 mi away</span>
              </div>
              <p style="font-size: 0.75rem; color: var(--slate-500);">Batch: ${med.batchNo} &bull; Exp: ${med.expiryDate}</p>

              <div class="medicine-pricing-row">
                <div class="price-tag">
                  $${med.price.toFixed(2)}
                  <small>/ pack</small>
                </div>
                <button 
                  class="btn-primary btn-sm reserve-med-btn" 
                  data-med-id="${med.id}"
                  ${med.stockStatus === 'OUT_OF_STOCK' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                >
                  ${med.stockStatus === 'OUT_OF_STOCK' ? 'Unavailable' : 'Hold / Reserve'}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Medicine Reservation Modal -->
    <dialog id="reserveModal">
      <div class="modal-header">
        <h3>Reserve Medicine for Pickup</h3>
        <button class="modal-close-btn" id="closeReserveModalBtn">&times;</button>
      </div>
      <div class="modal-body" id="reserveModalBody">
        <!-- Rendered dynamically -->
      </div>
      <div class="modal-footer">
        <button class="btn-outline btn-sm" id="cancelReserveModalBtn">Cancel</button>
        <button class="btn-primary btn-sm" id="confirmReserveModalBtn">Confirm 4-Hour Hold</button>
      </div>
    </dialog>

    <!-- Price Comparison Modal -->
    <dialog id="compareModal" style="max-width: 680px;">
      <div class="modal-header">
        <h3>Chemist Comparative Pricing Overview</h3>
        <button class="modal-close-btn" id="closeCompareModalBtn">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.85rem; color: var(--slate-600); margin-bottom: 16px;">
          Comparing verified retail prices across participating licensed dispensaries:
        </p>
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Generic</th>
              <th>Chemist</th>
              <th>Stock Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${store.state.medicines.slice(0, 8).map(m => `
              <tr>
                <td><strong>${m.name}</strong></td>
                <td><small>${m.genericName}</small></td>
                <td>${m.facilityName}</td>
                <td><span class="badge ${m.stockStatus === 'IN_STOCK' ? 'badge-success' : (m.stockStatus === 'LOW_STOCK' ? 'badge-warning' : 'badge-danger')}">${m.stockStatus.replace('_', ' ')}</span></td>
                <td style="font-weight: 700; color: var(--primary-900);">$${m.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn-primary btn-sm" id="closeCompareOkBtn">Done</button>
      </div>
    </dialog>
  `;

  setupPharmacyEvents(container);
}

function setupPharmacyEvents(container) {
  const searchInput = container.querySelector('#medicineSearchInput');
  const catChips = container.querySelectorAll('.filter-chip-btn');
  const stockCheckbox = container.querySelector('#stockOnlyCheckbox');
  const reserveBtns = container.querySelectorAll('.reserve-med-btn');
  const reserveModal = container.querySelector('#reserveModal');
  const reserveModalBody = container.querySelector('#reserveModalBody');
  const confirmReserveModalBtn = container.querySelector('#confirmReserveModalBtn');
  const closeReserveModalBtn = container.querySelector('#closeReserveModalBtn');
  const cancelReserveModalBtn = container.querySelector('#cancelReserveModalBtn');

  const comparePricesBtn = container.querySelector('#comparePricesBtn');
  const compareModal = container.querySelector('#compareModal');
  const closeCompareModalBtn = container.querySelector('#closeCompareModalBtn');
  const closeCompareOkBtn = container.querySelector('#closeCompareOkBtn');

  let activeMedToReserve = null;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderPharmacyModule(container);
    });
  }

  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      currentCategory = chip.dataset.cat;
      renderPharmacyModule(container);
    });
  });

  if (stockCheckbox) {
    stockCheckbox.addEventListener('change', (e) => {
      showInStockOnly = e.target.checked;
      renderPharmacyModule(container);
    });
  }

  reserveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const medId = btn.dataset.medId;
      activeMedToReserve = store.state.medicines.find(m => m.id === medId);
      if (!activeMedToReserve) return;

      reserveModalBody.innerHTML = `
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); padding: 14px; border-radius: var(--radius-md); margin-bottom: 16px;">
          <h4 style="font-size: 1rem; color: var(--slate-900); font-weight: 700;">${activeMedToReserve.name} (${activeMedToReserve.dosage})</h4>
          <p style="font-size: 0.825rem; color: var(--slate-600); margin-top: 4px;">Dispensary: <strong>${activeMedToReserve.facilityName}</strong></p>
          <p style="font-size: 0.825rem; color: var(--slate-600);">Price: <strong>$${activeMedToReserve.price.toFixed(2)}</strong></p>
        </div>

        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" for="resPatientName">Patient Full Name</label>
          <input type="text" id="resPatientName" class="form-input" placeholder="e.g. Jane Doe" value="Jane Doe" required />
        </div>

        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" for="resPatientPhone">Mobile Phone for SMS Confirmation</label>
          <input type="tel" id="resPatientPhone" class="form-input" placeholder="+1 (555) 000-0000" value="+1 (555) 019-8833" required />
        </div>

        <p style="font-size: 0.775rem; color: var(--slate-500);">
          ℹ️ Your reservation places an instant 4-hour hold on the medication. Please bring your prescription (if required) upon pharmacy counter collection.
        </p>
      `;

      reserveModal.showModal();
    });
  });

  if (confirmReserveModalBtn) {
    confirmReserveModalBtn.addEventListener('click', () => {
      if (activeMedToReserve) {
        store.reserveMedicine(activeMedToReserve.id, {});
        reserveModal.close();
        renderPharmacyModule(container);
      }
    });
  }

  const closeReserve = () => { if (reserveModal.open) reserveModal.close(); };
  if (closeReserveModalBtn) closeReserveModalBtn.addEventListener('click', closeReserve);
  if (cancelReserveModalBtn) cancelReserveModalBtn.addEventListener('click', closeReserve);

  if (comparePricesBtn && compareModal) {
    comparePricesBtn.addEventListener('click', () => compareModal.showModal());
  }

  const closeCompare = () => { if (compareModal.open) compareModal.close(); };
  if (closeCompareModalBtn) closeCompareModalBtn.addEventListener('click', closeCompare);
  if (closeCompareOkBtn) closeCompareOkBtn.addEventListener('click', closeCompare);
}
