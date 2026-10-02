/**
 * PulsePoint Medical Shop Admin & Chemist Management Portal
 * Allows licensed pharmacy admins to manage store profiles, drug licenses,
 * live medicine inventory, retail pricing in Rupees (₹), and incoming 4-hour patient hold reservations.
 */

import { store } from '../store.js';

let activeAdminSubtab = 'holds'; // 'holds' | 'inventory' | 'profile'
let inventorySearchQuery = '';
let inventoryCategoryFilter = 'ALL';
let reservationStatusFilter = 'ALL';

export function renderPharmacyAdminModule(container) {
  const state = store.state;
  const activePharmacyId = state.pharmacyAdminSession.activePharmacyId || 'fac-pharm-01';
  
  // Find current pharmacy facility
  const currentPharmacy = state.facilities.find(f => f.id === activePharmacyId) || state.facilities.find(f => f.type === 'PHARMACY');
  const allPharmacies = state.facilities.filter(f => f.type === 'PHARMACY');

  // Filter medicines belonging to this dispensary
  const shopMedicines = state.medicines.filter(m => m.facilityId === currentPharmacy.id);

  // Filter reservations for this dispensary
  const allReservations = (state.reservations || []).filter(r => r.facilityId === currentPharmacy.id);
  const activeHoldsCount = allReservations.filter(r => r.status === 'ACTIVE_HOLD').length;
  const lowStockCount = shopMedicines.filter(m => m.stockStatus === 'LOW_STOCK' || m.stockStatus === 'OUT_OF_STOCK').length;
  const totalStockUnits = shopMedicines.reduce((acc, m) => acc + (m.quantity || 0), 0);
  const totalStockValueRupees = shopMedicines.reduce((acc, m) => acc + ((m.quantity || 0) * (m.price || 0)), 0);

  // Filtered reservations for display
  const displayedReservations = allReservations.filter(r => {
    if (reservationStatusFilter === 'ALL') return true;
    return r.status === reservationStatusFilter;
  });

  // Filtered inventory for display
  const displayedInventory = shopMedicines.filter(m => {
    const q = inventorySearchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.batchNo.toLowerCase().includes(q);
    const matchesCategory = inventoryCategoryFilter === 'ALL' || m.category.toLowerCase() === inventoryCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  container.innerHTML = `
    <div class="pharm-admin-wrapper">
      
      <!-- Top Medical Shop Profile & Switcher Banner -->
      <div class="admin-top-banner">
        <div class="admin-banner-left">
          <div class="admin-shop-avatar">💊</div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="badge badge-success">Accredited Medical Dispensary</span>
              ${currentPharmacy.emergencyDelivery ? '<span class="badge badge-info">⚡ 24/7 Emergency Delivery</span>' : ''}
              ${currentPharmacy.isColdChainCertified ? '<span class="badge badge-primary">❄️ 2°C - 8°C Cold Storage</span>' : ''}
            </div>
            <h2 class="admin-shop-title">${currentPharmacy.name}</h2>
            <p class="admin-shop-meta">
              <span>👤 Pharmacist: <strong>${currentPharmacy.pharmacistInCharge || 'Registered Pharmacist'}</strong> (${currentPharmacy.regNumber || 'REG-PHARM-2026'})</span>
              <span>&bull;</span>
              <span>📜 License: <strong>${currentPharmacy.license}</strong></span>
              <span>&bull;</span>
              <span>📍 ${currentPharmacy.address}</span>
            </p>
          </div>
        </div>

        <!-- Shop Profile Switcher & Actions -->
        <div class="admin-banner-actions">
          <div class="shop-select-box">
            <label for="pharmacyShopSelect" style="font-size: 0.725rem; font-weight: 700; color: var(--slate-600); text-transform: uppercase;">
              Switch Chemist Profile:
            </label>
            <select id="pharmacyShopSelect" class="form-select" style="font-size: 0.85rem; padding: 6px 12px; font-weight: 600;">
              ${allPharmacies.map(p => `
                <option value="${p.id}" ${p.id === currentPharmacy.id ? 'selected' : ''}>
                  ${p.name} (${p.district})
                </option>
              `).join('')}
            </select>
          </div>

          <button class="btn-outline btn-sm" id="openEditProfileBtn" title="Update dispensary credentials & license">
            ✏️ Edit Shop Profile
          </button>
        </div>
      </div>

      <!-- KPI Statistics Strip (Rupee-denominated) -->
      <div class="admin-kpi-grid">
        <div class="kpi-metric-card">
          <div class="kpi-icon-circle" style="background: rgba(2, 132, 199, 0.1); color: var(--primary-700);">
            ₹
          </div>
          <div>
            <span class="kpi-label">Dispensary Stock Valuation</span>
            <h3 class="kpi-value">₹${totalStockValueRupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span class="kpi-subtext">${shopMedicines.length} Listed Drug Formulations</span>
          </div>
        </div>

        <div class="kpi-metric-card">
          <div class="kpi-icon-circle" style="background: rgba(16, 185, 129, 0.1); color: var(--success-700);">
            📦
          </div>
          <div>
            <span class="kpi-label">Total Shelf Units</span>
            <h3 class="kpi-value">${totalStockUnits.toLocaleString()}</h3>
            <span class="kpi-subtext">Across All Sealed Batches</span>
          </div>
        </div>

        <div class="kpi-metric-card">
          <div class="kpi-icon-circle" style="background: rgba(245, 158, 11, 0.1); color: var(--warning-700);">
            ⏳
          </div>
          <div>
            <span class="kpi-label">Active 4-Hr Customer Holds</span>
            <h3 class="kpi-value">${activeHoldsCount}</h3>
            <span class="kpi-subtext">Awaiting Counter Collection</span>
          </div>
        </div>

        <div class="kpi-metric-card">
          <div class="kpi-icon-circle" style="background: rgba(239, 68, 68, 0.1); color: var(--danger-600);">
            ⚠️
          </div>
          <div>
            <span class="kpi-label">Depleted / Low Stock</span>
            <h3 class="kpi-value">${lowStockCount}</h3>
            <span class="kpi-subtext">Requires Vendor Reorder</span>
          </div>
        </div>
      </div>

      <!-- Module Navigation Subtabs -->
      <div class="admin-nav-subtabs">
        <button class="admin-subtab-btn ${activeAdminSubtab === 'holds' ? 'active' : ''}" data-subtab="holds">
          ⏳ Customer 4-Hour Holds (${activeHoldsCount})
        </button>
        <button class="admin-subtab-btn ${activeAdminSubtab === 'inventory' ? 'active' : ''}" data-subtab="inventory">
          📦 Medicine Stock & Pricing in ₹ (${shopMedicines.length})
        </button>
        <button class="admin-subtab-btn ${activeAdminSubtab === 'profile' ? 'active' : ''}" data-subtab="profile">
          🏥 Chemist License & Shop Credentials
        </button>
      </div>

      <!-- SUBTAB 1: CUSTOMER 4-HOUR HOLDS -->
      ${activeAdminSubtab === 'holds' ? `
        <div class="admin-section-box">
          <div class="section-box-header">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--slate-900);">
                Active Customer Pickup Queue & 4-Hour Holds
              </h3>
              <p style="font-size: 0.825rem; color: var(--slate-500); margin-top: 2px;">
                Incoming patient reservations placed via PulsePoint. Verify prescription upon collection and dispense or release hold.
              </p>
            </div>

            <!-- Status Filter Chips -->
            <div class="chips-group">
              <button class="filter-chip-btn ${reservationStatusFilter === 'ALL' ? 'active' : ''}" data-res-filter="ALL">All Orders (${allReservations.length})</button>
              <button class="filter-chip-btn ${reservationStatusFilter === 'ACTIVE_HOLD' ? 'active' : ''}" data-res-filter="ACTIVE_HOLD">Active Holds (${activeHoldsCount})</button>
              <button class="filter-chip-btn ${reservationStatusFilter === 'DISPENSED' ? 'active' : ''}" data-res-filter="DISPENSED">Dispensed</button>
            </div>
          </div>

          ${displayedReservations.length === 0 ? `
            <div class="empty-state-card" style="padding: 40px; text-align: center;">
              <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">📋</span>
              <h4 style="font-size: 1.1rem; color: var(--slate-800); font-weight: 700;">No reservations match the selected filter</h4>
              <p style="font-size: 0.85rem; color: var(--slate-500); max-width: 440px; margin: 6px auto 0;">
                Patient medicine reservations will automatically appear here in real time with unique pickup tokens and 4-hour countdowns.
              </p>
            </div>
          ` : `
            <div style="overflow-x: auto;">
              <table class="inventory-table">
                <thead>
                  <tr>
                    <th>Hold Token / Ref</th>
                    <th>Customer Name & Contact</th>
                    <th>Reserved Medication</th>
                    <th>Price</th>
                    <th>Hold Status</th>
                    <th>Reservation Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${displayedReservations.map(res => {
                    let statusBadgeClass = 'badge-success';
                    let statusLabel = '🟢 Active Hold';
                    if (res.status === 'DISPENSED') {
                      statusBadgeClass = 'badge-info';
                      statusLabel = '✅ Dispensed';
                    } else if (res.status === 'CANCELLED') {
                      statusBadgeClass = 'badge-danger';
                      statusLabel = '⚪ Released / Restocked';
                    }

                    return `
                      <tr>
                        <td>
                          <span style="font-family: monospace; font-weight: 800; color: var(--primary-700); background: var(--primary-50); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">
                            ${res.reservationRef}
                          </span>
                        </td>
                        <td>
                          <strong>${res.patientName}</strong>
                          <small style="display: block; color: var(--slate-500); font-family: monospace;">${res.patientPhone}</small>
                        </td>
                        <td>
                          <strong>${res.medicineName}</strong>
                          <span style="display: block; font-size: 0.75rem; color: var(--slate-500);">${res.dosage} &bull; ${res.form}</span>
                        </td>
                        <td>
                          <strong style="color: var(--primary-900); font-size: 0.95rem;">₹${Number(res.price).toFixed(2)}</strong>
                        </td>
                        <td>
                          <span class="badge ${statusBadgeClass}">${statusLabel}</span>
                          <small style="display: block; font-size: 0.7rem; color: var(--slate-500); margin-top: 2px;">${res.expiresAt}</small>
                        </td>
                        <td>
                          <span style="font-size: 0.8rem; color: var(--slate-600);">${res.reservedAt}</span>
                        </td>
                        <td>
                          ${res.status === 'ACTIVE_HOLD' ? `
                            <div style="display: flex; gap: 6px;">
                              <button class="btn-primary btn-sm dispense-hold-btn" data-res-id="${res.id}" title="Mark medicine as picked up and dispensed">
                                ✅ Dispense
                              </button>
                              <button class="btn-outline btn-sm release-hold-btn" data-res-id="${res.id}" title="Release hold and restock into inventory" style="color: var(--danger-600); border-color: var(--danger-600);">
                                ✕ Release
                              </button>
                            </div>
                          ` : `
                            <span style="font-size: 0.775rem; color: var(--slate-400); font-style: italic;">Completed</span>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      ` : ''}

      <!-- SUBTAB 2: MEDICINE STOCK & PRICING IN RUPEES -->
      ${activeAdminSubtab === 'inventory' ? `
        <div class="admin-section-box">
          <div class="section-box-header">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--slate-900);">
                Dispensary Medicine Inventory & Price Management
              </h3>
              <p style="font-size: 0.825rem; color: var(--slate-500); margin-top: 2px;">
                Adjust live stock quantities, update retail prices in Rupees (₹), and add new pharmaceutical batches.
              </p>
            </div>

            <button class="btn-primary btn-sm" id="openAddMedicineModalBtn">
              + Add New Medicine Batch
            </button>
          </div>

          <!-- Inventory Controls -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
            <div style="position: relative; flex: 1; max-width: 360px;">
              <input 
                type="text" 
                id="inventorySearchInput" 
                class="form-input" 
                placeholder="Search stock by brand, generic, or batch..." 
                value="${inventorySearchQuery}"
                style="padding-left: 36px;"
              />
              <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--slate-400);">🔍</span>
            </div>

            <div class="chips-group">
              <button class="filter-chip-btn ${inventoryCategoryFilter === 'ALL' ? 'active' : ''}" data-cat-filter="ALL">All Categories</button>
              <button class="filter-chip-btn ${inventoryCategoryFilter === 'Antibiotic' ? 'active' : ''}" data-cat-filter="Antibiotic">Antibiotics</button>
              <button class="filter-chip-btn ${inventoryCategoryFilter === 'Antidiabetic' ? 'active' : ''}" data-cat-filter="Antidiabetic">Antidiabetic</button>
              <button class="filter-chip-btn ${inventoryCategoryFilter === 'Cardiovascular' ? 'active' : ''}" data-cat-filter="Cardiovascular">Cardio</button>
              <button class="filter-chip-btn ${inventoryCategoryFilter === 'Respiratory' ? 'active' : ''}" data-cat-filter="Respiratory">Respiratory</button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="inventory-table">
              <thead>
                <tr>
                  <th>Drug Formulation</th>
                  <th>Generic Molecule</th>
                  <th>Category</th>
                  <th>Quantity on Shelf</th>
                  <th>Stock Status</th>
                  <th>Retail Price (₹)</th>
                  <th>Quick Stock Actions</th>
                </tr>
              </thead>
              <tbody>
                ${displayedInventory.map(med => `
                  <tr>
                    <td>
                      <strong>${med.name}</strong>
                      <span style="display: block; font-size: 0.75rem; color: var(--slate-500);">${med.dosage} &bull; ${med.form}</span>
                    </td>
                    <td>
                      <span>${med.genericName}</span>
                      <small style="display: block; color: var(--slate-400); font-family: monospace;">Batch: ${med.batchNo}</small>
                    </td>
                    <td>
                      <span class="badge badge-info">${med.category}</span>
                    </td>
                    <td>
                      <strong style="font-size: 0.95rem;">${med.quantity}</strong> units
                    </td>
                    <td>
                      <select class="form-select med-stock-status-select" data-med-id="${med.id}" style="padding: 4px 8px; font-size: 0.8rem; width: auto;">
                        <option value="IN_STOCK" ${med.stockStatus === 'IN_STOCK' ? 'selected' : ''}>🟢 In Stock</option>
                        <option value="LOW_STOCK" ${med.stockStatus === 'LOW_STOCK' ? 'selected' : ''}>🟡 Low Stock</option>
                        <option value="OUT_OF_STOCK" ${med.stockStatus === 'OUT_OF_STOCK' ? 'selected' : ''}>🔴 Out of Stock</option>
                      </select>
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-weight: 700; color: var(--slate-600);">₹</span>
                        <input 
                          type="number" 
                          step="1" 
                          class="form-input med-price-inr-input" 
                          data-med-id="${med.id}" 
                          value="${Number(med.price).toFixed(2)}" 
                          style="width: 85px; padding: 4px 8px; font-size: 0.85rem; font-weight: 700; color: var(--primary-900);" 
                        />
                      </div>
                    </td>
                    <td>
                      <div style="display: flex; gap: 4px;">
                        <button class="btn-outline btn-sm quick-add-stock-btn" data-med-id="${med.id}" data-delta="10" title="Add 10 units">
                          +10
                        </button>
                        <button class="btn-outline btn-sm quick-add-stock-btn" data-med-id="${med.id}" data-delta="25" title="Add 25 units">
                          +25
                        </button>
                        <button class="btn-outline btn-sm quick-add-stock-btn" data-med-id="${med.id}" data-delta="-1" title="Deduct 1 unit" style="color: var(--danger-600);">
                          -1
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- SUBTAB 3: CHEMIST LICENSE & SHOP CREDENTIALS -->
      ${activeAdminSubtab === 'profile' ? `
        <div class="admin-section-box">
          <div class="section-box-header">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--slate-900);">
                Dispensary Accreditation & Regulatory Credentials
              </h3>
              <p style="font-size: 0.825rem; color: var(--slate-500); margin-top: 2px;">
                Verified statutory licenses issued under State Pharmacy Council and Central Drugs Standard Control Organization (CDSCO).
              </p>
            </div>

            <button class="btn-primary btn-sm" id="editProfileDirectBtn">
              ✏️ Modify Credentials
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 8px;">
            
            <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 18px;">
              <span style="font-size: 0.725rem; font-weight: 700; color: var(--primary-700); text-transform: uppercase;">Legal Enterprise Info</span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--slate-900); margin-top: 4px;">${currentPharmacy.name}</h4>
              <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 0.825rem;">
                <div><span style="color: var(--slate-500);">Drug License:</span> <strong>${currentPharmacy.license}</strong></div>
                <div><span style="color: var(--slate-500);">GSTIN:</span> <strong>${currentPharmacy.gstin || '29AABCU9603R1ZM'}</strong></div>
                <div><span style="color: var(--slate-500);">Address:</span> <span>${currentPharmacy.address}</span></div>
                <div><span style="color: var(--slate-500);">Zone / District:</span> <span>${currentPharmacy.district}</span></div>
              </div>
            </div>

            <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 18px;">
              <span style="font-size: 0.725rem; font-weight: 700; color: var(--success-700); text-transform: uppercase;">Registered Pharmacist-in-Charge</span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--slate-900); margin-top: 4px;">${currentPharmacy.pharmacistInCharge || 'R. Sharma, B.Pharm'}</h4>
              <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 0.825rem;">
                <div><span style="color: var(--slate-500);">Pharmacy Council Reg:</span> <strong>${currentPharmacy.regNumber || 'KA-PHARM-44102'}</strong></div>
                <div><span style="color: var(--slate-500);">Hotline:</span> <strong>${currentPharmacy.phone}</strong></div>
                <div><span style="color: var(--slate-500);">Emergency Hotline:</span> <strong>${currentPharmacy.emergencyPhone || '+91 98451 99999'}</strong></div>
                <div><span style="color: var(--slate-500);">Timings:</span> <span>${currentPharmacy.operatingHours}</span></div>
              </div>
            </div>

            <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 18px;">
              <span style="font-size: 0.725rem; font-weight: 700; color: var(--warning-700); text-transform: uppercase;">Special Accreditations</span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--slate-900); margin-top: 4px;">Logistics & Storage Compliance</h4>
              <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 0.825rem;">
                <div>
                  <span style="color: var(--slate-500);">Cold Storage Unit (2°C - 8°C):</span> 
                  <strong>${currentPharmacy.isColdChainCertified ? '✅ Verified Compliant' : '⚪ Standard Ambient Only'}</strong>
                </div>
                <div>
                  <span style="color: var(--slate-500);">Home Emergency Delivery:</span> 
                  <strong>${currentPharmacy.emergencyDelivery ? '✅ Active 24x7 Dispatch' : '⚪ Counter Pickup Only'}</strong>
                </div>
                <div>
                  <span style="color: var(--slate-500);">Digital Hold Reservation API:</span> 
                  <strong style="color: var(--success-700);">✅ Active & Connected</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      ` : ''}

    </div>

    <!-- Edit Profile Modal -->
    <dialog id="editShopProfileModal" style="max-width: 540px;">
      <div class="modal-header">
        <h3>Edit Medical Shop Profile & License</h3>
        <button class="modal-close-btn" id="closeEditProfileModalBtn">&times;</button>
      </div>
      <div class="modal-body">
        <form id="editShopProfileForm" style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="editShopName">Dispensary Trade Name</label>
            <input type="text" id="editShopName" class="form-input" value="${currentPharmacy.name}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="editPharmacistName">Pharmacist-in-Charge</label>
              <input type="text" id="editPharmacistName" class="form-input" value="${currentPharmacy.pharmacistInCharge || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="editRegNumber">Pharmacy Council Reg #</label>
              <input type="text" id="editRegNumber" class="form-input" value="${currentPharmacy.regNumber || ''}" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="editLicense">Drug License Number</label>
              <input type="text" id="editLicense" class="form-input" value="${currentPharmacy.license}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="editPhone">Contact Helpline</label>
              <input type="text" id="editPhone" class="form-input" value="${currentPharmacy.phone}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="editAddress">Physical Store Address</label>
            <input type="text" id="editAddress" class="form-input" value="${currentPharmacy.address}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="editHours">Operating Hours</label>
            <input type="text" id="editHours" class="form-input" value="${currentPharmacy.operatingHours}" required />
          </div>

          <div style="display: flex; gap: 20px; margin-top: 4px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.825rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="editDeliveryCheck" ${currentPharmacy.emergencyDelivery ? 'checked' : ''} />
              Enable 24x7 Home Emergency Delivery
            </label>

            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.825rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="editColdCheck" ${currentPharmacy.isColdChainCertified ? 'checked' : ''} />
              2°C - 8°C Cold Chain Refrigerator Certified
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px;">
            <button type="button" class="btn-outline btn-sm" id="cancelEditProfileModalBtn">Cancel</button>
            <button type="submit" class="btn-primary btn-sm">Save Profile Changes</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Add Medicine Batch Modal -->
    <dialog id="adminAddMedModal" style="max-width: 520px;">
      <div class="modal-header">
        <h3>Add Medicine Batch to ${currentPharmacy.name}</h3>
        <button class="modal-close-btn" id="closeAdminAddMedModalBtn">&times;</button>
      </div>
      <div class="modal-body">
        <form id="adminAddMedForm" style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="addMedBrand">Medicine / Brand Name</label>
            <input type="text" id="addMedBrand" class="form-input" placeholder="e.g. Dolo 650 Fast Action" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="addMedMolecule">Generic Molecule</label>
            <input type="text" id="addMedMolecule" class="form-input" placeholder="e.g. Paracetamol / Acetaminophen" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="addMedDosage">Dosage</label>
              <input type="text" id="addMedDosage" class="form-input" placeholder="e.g. 650mg" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="addMedForm">Formulation</label>
              <select id="addMedForm" class="form-select">
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Inhaler">Inhaler</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="addMedCategory">Category</label>
              <select id="addMedCategory" class="form-select">
                <option value="Analgesic">Analgesic / Antipyretic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Respiratory">Respiratory</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="addMedPrice">Retail Price in Rupees (₹)</label>
              <input type="number" id="addMedPrice" class="form-input" step="1" value="65.00" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="addMedQty">Stock Quantity</label>
              <input type="number" id="addMedQty" class="form-input" value="100" min="0" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="addMedBatch">Batch Number</label>
              <input type="text" id="addMedBatch" class="form-input" placeholder="e.g. BAT-2026-IND" value="IND-2026-B1" required />
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            <input type="checkbox" id="addMedRxCheck" checked />
            <label for="addMedRxCheck" style="font-size: 0.825rem; font-weight: 600; cursor: pointer;">Prescription Required (Schedule H / H1)</label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px;">
            <button type="button" class="btn-outline btn-sm" id="cancelAdminAddMedModalBtn">Cancel</button>
            <button type="submit" class="btn-primary btn-sm">Add to Dispensary Inventory</button>
          </div>
        </form>
      </div>
    </dialog>
  `;

  // Attach Event Listeners
  setupPharmacyAdminEvents(container, currentPharmacy);
}

function setupPharmacyAdminEvents(container, currentPharmacy) {
  // 1. Shop profile switcher dropdown
  const shopSelect = container.querySelector('#pharmacyShopSelect');
  if (shopSelect) {
    shopSelect.addEventListener('change', (e) => {
      store.setActivePharmacyAdminShop(e.target.value);
    });
  }

  // 2. Subtab switching
  const subtabBtns = container.querySelectorAll('.admin-subtab-btn');
  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeAdminSubtab = btn.dataset.subtab;
      renderPharmacyAdminModule(container);
    });
  });

  // 3. Reservation filter chips
  const resFilterChips = container.querySelectorAll('[data-res-filter]');
  resFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      reservationStatusFilter = chip.dataset.resFilter;
      renderPharmacyAdminModule(container);
    });
  });

  // 4. Dispense hold action
  const dispenseBtns = container.querySelectorAll('.dispense-hold-btn');
  dispenseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const resId = btn.dataset.resId;
      store.updateReservationStatus(resId, 'DISPENSED');
    });
  });

  // 5. Release hold action
  const releaseBtns = container.querySelectorAll('.release-hold-btn');
  releaseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const resId = btn.dataset.resId;
      store.updateReservationStatus(resId, 'CANCELLED');
    });
  });

  // 6. Inventory search & category filters
  const invSearch = container.querySelector('#inventorySearchInput');
  if (invSearch) {
    invSearch.addEventListener('input', (e) => {
      inventorySearchQuery = e.target.value;
      renderPharmacyAdminModule(container);
    });
  }

  const catFilterChips = container.querySelectorAll('[data-cat-filter]');
  catFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      inventoryCategoryFilter = chip.dataset.catFilter;
      renderPharmacyAdminModule(container);
    });
  });

  // 7. Stock status toggle
  const statusSelects = container.querySelectorAll('.med-stock-status-select');
  statusSelects.forEach(sel => {
    sel.addEventListener('change', () => {
      const medId = sel.dataset.medId;
      store.updateMedicineStock(medId, 0, sel.value);
    });
  });

  // 8. Price update in Rupees
  const priceInputs = container.querySelectorAll('.med-price-inr-input');
  priceInputs.forEach(input => {
    input.addEventListener('change', () => {
      const medId = input.dataset.medId;
      const newPrice = parseFloat(input.value);
      if (!isNaN(newPrice) && newPrice >= 0) {
        store.updateMedicineStock(medId, 0, null, newPrice);
      }
    });
  });

  // 9. Quick stock add buttons (+10, +25, -1)
  const quickStockBtns = container.querySelectorAll('.quick-add-stock-btn');
  quickStockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const medId = btn.dataset.medId;
      const delta = parseInt(btn.dataset.delta, 10);
      store.updateMedicineStock(medId, delta);
    });
  });

  // 10. Edit Shop Profile Modal
  const editProfileModal = container.querySelector('#editShopProfileModal');
  const openEditProfileBtn = container.querySelector('#openEditProfileBtn');
  const editProfileDirectBtn = container.querySelector('#editProfileDirectBtn');
  const closeEditProfileModalBtn = container.querySelector('#closeEditProfileModalBtn');
  const cancelEditProfileModalBtn = container.querySelector('#cancelEditProfileModalBtn');
  const editShopProfileForm = container.querySelector('#editShopProfileForm');

  const openProfileModal = () => { if (editProfileModal) editProfileModal.showModal(); };
  const closeProfileModal = () => { if (editProfileModal && editProfileModal.open) editProfileModal.close(); };

  if (openEditProfileBtn) openEditProfileBtn.addEventListener('click', openProfileModal);
  if (editProfileDirectBtn) editProfileDirectBtn.addEventListener('click', openProfileModal);
  if (closeEditProfileModalBtn) closeEditProfileModalBtn.addEventListener('click', closeProfileModal);
  if (cancelEditProfileModalBtn) cancelEditProfileModalBtn.addEventListener('click', closeProfileModal);

  if (editShopProfileForm) {
    editShopProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedProfile = {
        name: container.querySelector('#editShopName').value.trim(),
        pharmacistInCharge: container.querySelector('#editPharmacistName').value.trim(),
        regNumber: container.querySelector('#editRegNumber').value.trim(),
        license: container.querySelector('#editLicense').value.trim(),
        phone: container.querySelector('#editPhone').value.trim(),
        address: container.querySelector('#editAddress').value.trim(),
        operatingHours: container.querySelector('#editHours').value.trim(),
        emergencyDelivery: container.querySelector('#editDeliveryCheck').checked,
        isColdChainCertified: container.querySelector('#editColdCheck').checked
      };

      store.updatePharmacyProfile(currentPharmacy.id, updatedProfile);
      closeProfileModal();
      renderPharmacyAdminModule(container);
    });
  }

  // 11. Add Medicine Modal
  const addMedModal = container.querySelector('#adminAddMedModal');
  const openAddMedBtn = container.querySelector('#openAddMedicineModalBtn');
  const closeAddMedBtn = container.querySelector('#closeAdminAddMedModalBtn');
  const cancelAddMedBtn = container.querySelector('#cancelAdminAddMedModalBtn');
  const addMedForm = container.querySelector('#adminAddMedForm');

  const openAddModal = () => { if (addMedModal) addMedModal.showModal(); };
  const closeAddModal = () => { if (addMedModal && addMedModal.open) addMedModal.close(); };

  if (openAddMedBtn) openAddMedBtn.addEventListener('click', openAddModal);
  if (closeAddMedBtn) closeAddMedBtn.addEventListener('click', closeAddModal);
  if (cancelAddMedBtn) cancelAddMedBtn.addEventListener('click', closeAddModal);

  if (addMedForm) {
    addMedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const brand = container.querySelector('#addMedBrand').value.trim();
      const molecule = container.querySelector('#addMedMolecule').value.trim();
      const dosage = container.querySelector('#addMedDosage').value.trim();
      const form = container.querySelector('#addMedForm').value;
      const category = container.querySelector('#addMedCategory').value;
      const price = parseFloat(container.querySelector('#addMedPrice').value);
      const quantity = parseInt(container.querySelector('#addMedQty').value, 10);
      const batchNo = container.querySelector('#addMedBatch').value.trim();
      const prescriptionRequired = container.querySelector('#addMedRxCheck').checked;

      store.addNewMedicine({
        name: brand,
        genericName: molecule,
        dosage,
        form,
        category,
        price,
        quantity,
        batchNo,
        prescriptionRequired
      }, currentPharmacy.id);

      closeAddModal();
      renderPharmacyAdminModule(container);
    });
  }
}
