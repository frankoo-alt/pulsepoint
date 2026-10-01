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

  // Window Frame Controls (Toggle Windowed / Full Width)
  const windowToggleBtn = document.getElementById('windowSizeToggleBtn');
  const windowExpandDot = document.getElementById('windowExpandDot');
  const windowToggleLabel = document.getElementById('windowToggleLabel');

  function updateWindowModeUI(isFullWidth) {
    if (isFullWidth) {
      document.body.classList.add('full-width-mode');
      if (windowToggleLabel) windowToggleLabel.textContent = 'Windowed';
    } else {
      document.body.classList.remove('full-width-mode');
      if (windowToggleLabel) windowToggleLabel.textContent = 'Full Width';
    }
  }

  const savedMode = localStorage.getItem('PULSEPOINT_WINDOW_MODE') === 'FULL_WIDTH';
  updateWindowModeUI(savedMode);

  function toggleWindowMode() {
    const isNowFullWidth = !document.body.classList.contains('full-width-mode');
    updateWindowModeUI(isNowFullWidth);
    localStorage.setItem('PULSEPOINT_WINDOW_MODE', isNowFullWidth ? 'FULL_WIDTH' : 'WINDOWED');
  }

  if (windowToggleBtn) windowToggleBtn.addEventListener('click', toggleWindowMode);
  if (windowExpandDot) windowExpandDot.addEventListener('click', toggleWindowMode);
}

// Boot application upon DOM readiness
document.addEventListener('DOMContentLoaded', initApp);
