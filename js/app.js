/**
 * PulsePoint Main Application Orchestrator
 * Integrates navbar, hero banner, module router, and toast notification rendering
 */

import { store } from './store.js';
import { renderNavbar } from './components/navbar.js';
import { renderPharmacyModule } from './components/pharmacy.js';
import { renderDiagnosticsModule } from './components/diagnostics.js';
import { renderBloodPublicModule } from './components/bloodPublic.js';
import { renderDonorPortalModule } from './components/donorPortal.js';
import { renderHospitalAdminModule } from './components/hospitalAdmin.js';
import { renderPharmacyAdminModule } from './components/pharmacyAdmin.js';

export function initApp() {
  const navContainer = document.getElementById('navbarContainer');
  const mainView = document.getElementById('moduleContainer');
  const toastContainer = document.getElementById('toastContainer');

  function render() {
    // 1. Render Navigation Bar
    if (navContainer) {
      renderNavbar(navContainer);
    }

    // 2. Render Active Tab Module
    if (mainView) {
      const activeTab = store.state.activeTab;
      switch (activeTab) {
        case 'pharmacy':
          renderPharmacyModule(mainView);
          break;
        case 'diagnostics':
          renderDiagnosticsModule(mainView);
          break;
        case 'blood-public':
          renderBloodPublicModule(mainView);
          break;
        case 'donor-portal':
          renderDonorPortalModule(mainView);
          break;
        case 'hospital-admin':
          renderHospitalAdminModule(mainView);
          break;
        case 'pharmacy-admin':
          renderPharmacyAdminModule(mainView);
          break;
        default:
          renderPharmacyModule(mainView);
      }
    }

    // 3. Render Floating Toasts
    if (toastContainer) {
      const toasts = store.state.toasts;
      toastContainer.innerHTML = toasts.map(t => `
        <div class="toast-item toast-${t.type}" role="alert">
          <div class="toast-item-title">${t.title}</div>
          <div class="toast-item-desc">${t.message}</div>
        </div>
      `).join('');
    }
  }

  // Subscribe to central state changes
  store.subscribe(() => {
    render();
  });

  // Initial render
  render();
}

// Boot application upon DOM readiness
document.addEventListener('DOMContentLoaded', initApp);
