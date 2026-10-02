/**
 * PulsePoint Verified Hospital & Blood Bank Admin Portal (Restricted Private View)
 * Exact cold-chain inventory, medicine stock controls, and secure inter-facility transfer pipeline
 */

import { store, ADMIN_PASSKEY } from '../store.js';

let activeSubtab = 'cold-chain'; // 'cold-chain' | 'medicine-stock' | 'transfer-pipeline'

export function renderHospitalAdminModule(container) {
  const state = store.state;
  const isAuth = state.adminSession.isAuthenticated && state.currentRole === 'HOSPITAL_ADMIN';

  // If not authenticated, render Security Lock Screen
  if (!isAuth) {
    container.innerHTML = `
      <div class="admin-lock-prompt">
        <div class="admin-lock-icon">🔒</div>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--slate-900); margin-bottom: 8px;">
          Restricted Medical Facility Environment
        </h2>
        <p style="font-size: 0.875rem; color: var(--slate-600); line-height: 1.5; margin-bottom: 24px;">
          Access to exact cold-chain storage unit codes, pathogen screening logs, and the Inter-Facility Emergency Blood Transfer Pipeline requires verified hospital credentials.
        </p>

        <form id="adminLockForm" style="display: flex; flex-direction: column; gap: 14px; text-align: left;">
          <div class="form-group">
            <label class="form-label" for="lockKeyInput">Hospital Authorization Passkey</label>
            <input 
              type="password" 
              id="lockKeyInput" 
              class="form-input" 
              placeholder="Enter passkey e.g., MED-AUTH-9082" 
              required 
            />
          </div>

          <div class="demo-passkey-hint" style="text-align: center;">
            <span>Hackathon Demo Key:</span>
            <button type="button" class="demo-passkey-btn" id="lockAutofillBtn">
              Autofill: ${ADMIN_PASSKEY}
            </button>
          </div>

          <button type="submit" class="btn-primary" style="margin-top: 8px;">
            Authenticate Medical Officer &rarr;
          </button>
        </form>
      </div>
    `;

    const lockForm = container.querySelector('#adminLockForm');
    const lockKeyInput = container.querySelector('#lockKeyInput');
    const lockAutofillBtn = container.querySelector('#lockAutofillBtn');

    if (lockAutofillBtn && lockKeyInput) {
      lockAutofillBtn.addEventListener('click', () => {
        lockKeyInput.value = ADMIN_PASSKEY;
      });
    }

    if (lockForm) {
      lockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passkey = lockKeyInput.value.trim();
        const success = store.setRole('HOSPITAL_ADMIN', passkey);
        if (success) {
          renderHospitalAdminModule(container);
        }
      });
    }

    return;
  }

  // Authenticated Hospital Admin View
  const bloodItems = state.bloodInventory;
  const medicines = state.medicines;
  const requests = state.hospitalRequests;

  container.innerHTML = `
    <!-- Verified Header -->
    <div class="section-header-block">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <h2 class="section-header-title">Hospital & Blood Bank Operations Portal</h2>
          <span class="badge badge-success">🛡️ Verified Hospital Officer</span>
        </div>
        <p class="section-header-subtitle">
          Facility: <strong>St. Jude Academic Medical Center & Regional Repository</strong> &bull; Authenticated: <strong>${state.adminSession.officer}</strong>
        </p>
      </div>

      <button class="btn-outline btn-sm" id="logoutAdminBtn">
        🔒 Exit Restricted Session
      </button>
    </div>

    <!-- Admin Subnavigation Tabs -->
    <div class="admin-dashboard-tabs">
      <button class="admin-subtab-btn ${activeSubtab === 'cold-chain' ? 'active' : ''}" data-subtab="cold-chain">
        ❄️ Cold-Chain Blood Bank Racks (${bloodItems.length})
      </button>
      <button class="admin-subtab-btn ${activeSubtab === 'transfer-pipeline' ? 'active' : ''}" data-subtab="transfer-pipeline">
        🚀 Inter-Facility Transfer Pipeline (${requests.length})
      </button>
      <button class="admin-subtab-btn ${activeSubtab === 'medicine-stock' ? 'active' : ''}" data-subtab="medicine-stock">
        💊 Pharmacy Stock & Schedule Manager (${medicines.length})
      </button>
    </div>

    <!-- SUBTAB 1: COLD-CHAIN BLOOD BANK INVENTORY -->
    ${activeSubtab === 'cold-chain' ? `
      <div class="inventory-table-card">
        <div style="padding: 16px 20px; background: var(--slate-50); border-bottom: 1px solid var(--slate-200); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--slate-900);">Exact Cold-Chain Storage Vaults</h3>
            <p style="font-size: 0.8rem; color: var(--slate-500);">Unmasked physical freezer racks, real-time temperature probes, and pathogen clearances.</p>
          </div>
          <span class="badge badge-info">2°C - 6°C Storage Compliance Verified</span>
        </div>

        <div style="overflow-x: auto;">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Blood Type</th>
                <th>Component Specification</th>
                <th>Storage Rack / Tank Code</th>
                <th>Live Sensor Temp</th>
                <th>Pathogen Clearance</th>
                <th>Shelf Life</th>
                <th>Units Available</th>
                <th>Inventory Stepper</th>
              </tr>
            </thead>
            <tbody>
              ${bloodItems.map(item => `
                <tr>
                  <td>
                    <strong style="font-size: 1.2rem; color: var(--blood-600);">${item.bloodGroup}</strong>
                  </td>
                  <td>
                    <span style="font-weight: 600; color: var(--slate-800);">${item.component}</span>
                    <span style="display: block; font-size: 0.725rem; color: var(--slate-500);">${item.facilityName}</span>
                  </td>
                  <td>
                    <span style="font-family: monospace; font-size: 0.8rem; background: var(--slate-100); padding: 2px 6px; border-radius: 4px; font-weight: 700;">
                      ${item.rackCode}
                    </span>
                  </td>
                  <td>
                    <span style="color: var(--teal-600); font-weight: 700;">
                      ❄️ ${item.temperature} &deg;C
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-success">
                      ✓ Cleared (HIV/Hep-B/Syphilis)
                    </span>
                    <small style="display: block; color: var(--slate-400); font-size: 0.7rem; margin-top: 2px;">
                      By ${item.pathologist.split(',')[0]}
                    </small>
                  </td>
                  <td>
                    <span style="font-size: 0.8rem; color: ${item.expiryDaysLeft <= 10 ? 'var(--blood-600)' : 'var(--slate-600)'}; font-weight: ${item.expiryDaysLeft <= 10 ? '700' : '500'};">
                      ${item.expiryDaysLeft} days left
                    </span>
                  </td>
                  <td>
                    <strong style="font-size: 1.1rem; color: var(--slate-900);">${item.unitsAvailable} Units</strong>
                  </td>
                  <td>
                    <div class="stepper-control">
                      <button class="stepper-btn bld-dec-btn" data-bld-id="${item.id}">-</button>
                      <span class="stepper-val">${item.unitsAvailable}</span>
                      <button class="stepper-btn bld-inc-btn" data-bld-id="${item.id}">+</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- SUBTAB 2: SECURE INTER-FACILITY TRANSFER PIPELINE -->
    ${activeSubtab === 'transfer-pipeline' ? `
      <!-- Transfer Requisition Creation Card -->
      <div class="transfer-pipeline-card">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--slate-900); margin-bottom: 6px;">
          Raise Emergency Inter-Facility Blood Requisition
        </h3>
        <p style="font-size: 0.825rem; color: var(--slate-600); margin-bottom: 20px;">
          Initiate verified transfer requests with partner hospital blood banks. Generates cryptographic cold-chain tracking tokens.
        </p>

        <form id="raiseTransferForm" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div class="form-group">
            <label class="form-label" for="reqBloodGroup">Blood Group Required</label>
            <select id="reqBloodGroup" class="form-select" required>
              <option value="O-">O- (Universal Red Cells)</option>
              <option value="O+">O+</option>
              <option value="A-">A-</option>
              <option value="A+">A+</option>
              <option value="B-">B-</option>
              <option value="B+">B+</option>
              <option value="AB-">AB-</option>
              <option value="AB+">AB+</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="reqUnitsCount">Units Requested</label>
            <input type="number" id="reqUnitsCount" class="form-input" min="1" max="10" value="2" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reqPriority">Clinical Urgency Priority</label>
            <select id="reqPriority" class="form-select" required>
              <option value="CODE_RED_CRITICAL">🚨 CODE RED (Immediate Trauma / OR)</option>
              <option value="HIGH">⚠️ HIGH (Urgent Surgical Care)</option>
              <option value="ROUTINE">ℹ️ ROUTINE (Elective Reserve)</option>
            </select>
          </div>

          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label" for="reqRationale">Clinical Rationale & Patient Condition</label>
            <input 
              type="text" 
              id="reqRationale" 
              class="form-input" 
              placeholder="e.g. Acute hemorrhagic shock in Emergency Trauma Bay 2, massive transfusion protocol initiated." 
              value="Acute polytrauma patient with massive internal hemorrhage requiring emergency whole blood transfusion." 
              required 
            />
          </div>

          <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-danger">
              🚀 Dispatch Requisition & Generate Tracking Token
            </button>
          </div>
        </form>
      </div>

      <!-- Active Inter-Facility Transfer Requisitions Ledger -->
      <div class="section-header-block" style="margin-top: 32px;">
        <div>
          <h3 class="section-header-title" style="font-size: 1.3rem;">
            Secure Logistics Ledger & Cold-Chain Tracking
          </h3>
          <p class="section-header-subtitle">
            Cryptographically sealed shipments between verified healthcare facilities with live sensor temperatures.
          </p>
        </div>
      </div>

      <div class="requisitions-ledger-list">
        ${requests.map(req => {
          const isCodeRed = req.priority === 'CODE_RED_CRITICAL';
          const steps = ['PENDING_REVIEW', 'STOCK_MATCHED', 'COURIER_DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];
          const currentIndex = steps.indexOf(req.status);

          return `
            <div class="requisition-item-card">
              <div class="req-header">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <strong style="font-size: 1.05rem; color: var(--slate-900);">${req.requisitionId}</strong>
                    <span class="badge ${isCodeRed ? 'badge-danger pulse-dot' : 'badge-warning'}">
                      ${req.priority.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span style="font-size: 0.8rem; color: var(--slate-600); margin-top: 2px; display: block;">
                    From: <strong>${req.fulfillingFacility}</strong> &rarr; To: <strong>${req.requestingHospital}</strong>
                  </span>
                </div>

                <div style="text-align: right;">
                  <span class="req-tracking-hash">
                    🔒 SHA-TOKEN: ${req.trackingToken}
                  </span>
                  <span style="display: block; font-size: 0.75rem; color: var(--teal-600); font-weight: 700; margin-top: 4px;">
                    🌡️ Cold-Chain Sensor: ${req.tempCelsius} &deg;C &bull; ETA: ${req.etaMinutes} mins
                  </span>
                </div>
              </div>

              <div style="font-size: 0.85rem; color: var(--slate-700); background: var(--white); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--slate-200);">
                <strong>Payload:</strong> ${req.units} Units of <strong style="color: var(--blood-600);">${req.bloodGroup}</strong> (${req.component})<br />
                <strong>Clinical Indication:</strong> ${req.rationale}<br />
                <small style="color: var(--slate-500);">Authorized By: ${req.doctor}</small>
              </div>

              <!-- Multi-Stage Status Stepper -->
              <div class="status-stepper-row">
                <div class="status-stepper-line"></div>
                ${steps.map((st, idx) => {
                  let nodeClass = '';
                  if (idx < currentIndex) nodeClass = 'completed';
                  else if (idx === currentIndex) nodeClass = 'active';

                  return `
                    <div class="status-step-node ${nodeClass}">
                      <div class="step-circle">${idx + 1}</div>
                      <span>${st.replace(/_/g, ' ')}</span>
                    </div>
                  `;
                }).join('')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px dashed var(--slate-200);">
                <span style="font-size: 0.775rem; color: var(--slate-500);">
                  Last Activity: <strong>${req.dispatchedTime}</strong>
                </span>

                ${currentIndex < steps.length - 1 ? `
                  <button class="btn-primary btn-sm advance-req-btn" data-req-id="${req.id}">
                    Advance Logistics Status &rarr;
                  </button>
                ` : `
                  <span class="badge badge-success">✓ Shipment Safely Delivered & Cryo-Stored</span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}

    <!-- SUBTAB 3: PHARMACY MEDICINE STOCK MANAGER -->
    ${activeSubtab === 'medicine-stock' ? `
      <div class="inventory-table-card">
        <div style="padding: 16px 20px; background: var(--slate-50); border-bottom: 1px solid var(--slate-200); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--slate-900);">Medicine Stock & Pricing Editor</h3>
            <p style="font-size: 0.8rem; color: var(--slate-500);">Toggle live chemist availability, adjust retail price, and alter stock quantities.</p>
          </div>
          <button class="btn-primary btn-sm" id="addNewMedBtn">
            + Add New Medicine Batch
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Drug Name</th>
                <th>Generic Molecule</th>
                <th>Category</th>
                <th>Quantity In Stock</th>
                <th>Stock Status Toggle</th>
                <th>Price (₹)</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              ${medicines.map(m => `
                <tr>
                  <td><strong>${m.name}</strong> <small style="display: block; color: var(--slate-500);">${m.dosage}</small></td>
                  <td>${m.genericName}</td>
                  <td><span class="badge badge-info">${m.category}</span></td>
                  <td><strong>${m.quantity}</strong> units</td>
                  <td>
                    <select class="form-select med-status-select" data-med-id="${m.id}" style="padding: 4px 8px; font-size: 0.775rem; width: auto;">
                      <option value="IN_STOCK" ${m.stockStatus === 'IN_STOCK' ? 'selected' : ''}>🟢 In Stock</option>
                      <option value="LOW_STOCK" ${m.stockStatus === 'LOW_STOCK' ? 'selected' : ''}>🟡 Low Stock</option>
                      <option value="OUT_OF_STOCK" ${m.stockStatus === 'OUT_OF_STOCK' ? 'selected' : ''}>🔴 Out of Stock</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="number" 
                      step="0.5" 
                      class="form-input med-price-input" 
                      data-med-id="${m.id}" 
                      value="${m.price.toFixed(2)}" 
                      style="width: 85px; padding: 4px 8px; font-size: 0.825rem;" 
                    />
                  </td>
                  <td>
                    <button class="btn-outline btn-sm med-stock-add-btn" data-med-id="${m.id}" title="Add 10 units">
                      +10 Units
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- Add New Medicine Modal -->
    <dialog id="addMedicineModal" style="max-width: 520px;">
      <div class="modal-header">
        <h3>Add New Medicine Batch</h3>
        <button class="modal-close-btn" id="closeAddMedModalBtn">&times;</button>
      </div>
      <div class="modal-body">
        <form id="addMedForm" style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="newMedName">Brand / Trade Name</label>
            <input type="text" id="newMedName" class="form-input" placeholder="e.g. Augmentin 625 Duo" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="newMedGeneric">Generic Molecule</label>
            <input type="text" id="newMedGeneric" class="form-input" placeholder="e.g. Amoxicillin + Clavulanic Acid" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="newMedDosage">Dosage</label>
              <input type="text" id="newMedDosage" class="form-input" placeholder="e.g. 625mg" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="newMedForm">Form</label>
              <select id="newMedForm" class="form-select">
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
              <label class="form-label" for="newMedCategory">Category</label>
              <select id="newMedCategory" class="form-select">
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Analgesic">Analgesic</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="newMedPrice">Price (₹)</label>
              <input type="number" id="newMedPrice" class="form-input" step="1" value="150.00" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="newMedQuantity">Initial Quantity</label>
            <input type="number" id="newMedQuantity" class="form-input" value="50" min="0" required />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
            <button type="button" class="btn-outline btn-sm" id="cancelAddMedBtn">Cancel</button>
            <button type="submit" class="btn-primary btn-sm">Add to Dispensary</button>
          </div>
        </form>
      </div>
    </dialog>
  `;

  setupHospitalAdminEvents(container);
}

function setupHospitalAdminEvents(container) {
  const logoutBtn = container.querySelector('#logoutAdminBtn');
  const subtabBtns = container.querySelectorAll('.admin-subtab-btn');
  const raiseTransferForm = container.querySelector('#raiseTransferForm');
  const advanceReqBtns = container.querySelectorAll('.advance-req-btn');
  const bldDecBtns = container.querySelectorAll('.bld-dec-btn');
  const bldIncBtns = container.querySelectorAll('.bld-inc-btn');

  const medStatusSelects = container.querySelectorAll('.med-status-select');
  const medPriceInputs = container.querySelectorAll('.med-price-input');
  const medStockAddBtns = container.querySelectorAll('.med-stock-add-btn');

  const addNewMedBtn = container.querySelector('#addNewMedBtn');
  const addMedicineModal = container.querySelector('#addMedicineModal');
  const closeAddMedModalBtn = container.querySelector('#closeAddMedModalBtn');
  const cancelAddMedBtn = container.querySelector('#cancelAddMedBtn');
  const addMedForm = container.querySelector('#addMedForm');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logoutAdmin();
    });
  }

  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeSubtab = btn.dataset.subtab;
      renderHospitalAdminModule(container);
    });
  });

  if (raiseTransferForm) {
    raiseTransferForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bloodGroup = container.querySelector('#reqBloodGroup').value;
      const units = container.querySelector('#reqUnitsCount').value;
      const priority = container.querySelector('#reqPriority').value;
      const rationale = container.querySelector('#reqRationale').value.trim();

      store.createHospitalRequisition({
        requestingHospital: 'St. Jude Academic Medical Center',
        bloodGroup,
        units,
        priority,
        rationale
      });

      renderHospitalAdminModule(container);
    });
  }

  advanceReqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const reqId = btn.dataset.reqId;
      store.advanceRequisitionStatus(reqId);
      renderHospitalAdminModule(container);
    });
  });

  bldDecBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bldId = btn.dataset.bldId;
      store.updateBloodUnitCount(bldId, -1);
      renderHospitalAdminModule(container);
    });
  });

  bldIncBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bldId = btn.dataset.bldId;
      store.updateBloodUnitCount(bldId, +1);
      renderHospitalAdminModule(container);
    });
  });

  medStatusSelects.forEach(sel => {
    sel.addEventListener('change', (e) => {
      const medId = sel.dataset.medId;
      store.updateMedicineStock(medId, 0, e.target.value);
    });
  });

  medPriceInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const medId = input.dataset.medId;
      store.updateMedicineStock(medId, 0, null, e.target.value);
    });
  });

  medStockAddBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const medId = btn.dataset.medId;
      store.updateMedicineStock(medId, 10);
      renderHospitalAdminModule(container);
    });
  });

  if (addNewMedBtn && addMedicineModal) {
    addNewMedBtn.addEventListener('click', () => {
      addMedicineModal.showModal();
    });
  }

  const closeAddMed = () => { if (addMedicineModal.open) addMedicineModal.close(); };
  if (closeAddMedModalBtn) closeAddMedModalBtn.addEventListener('click', closeAddMed);
  if (cancelAddMedBtn) cancelAddMedBtn.addEventListener('click', closeAddMed);

  if (addMedForm) {
    addMedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#newMedName').value.trim();
      const genericName = container.querySelector('#newMedGeneric').value.trim();
      const dosage = container.querySelector('#newMedDosage').value.trim();
      const form = container.querySelector('#newMedForm').value;
      const category = container.querySelector('#newMedCategory').value;
      const price = container.querySelector('#newMedPrice').value;
      const quantity = container.querySelector('#newMedQuantity').value;

      store.addNewMedicine({
        name,
        genericName,
        dosage,
        form,
        category,
        price,
        quantity
      });

      addMedicineModal.close();
      renderHospitalAdminModule(container);
    });
  }
}
