/**
 * Aust Wide Lending - Main Application Controller
 * Handles Navigation scroll effects, mobile drawer, interactive modal,
 * and accessibility triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar scroll effect
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Pre-Approval Modal
  const modalOverlay = document.getElementById('preApprovalModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const ctaButtons = document.querySelectorAll('.trigger-pre-approval');

  const openModal = (e) => {
    if (e) e.preventDefault();
    modalOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeDrawer();
  };

  const closeModal = () => {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalCloseBtn?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });

  // Modal lead form submission mock
  const leadForm = document.getElementById('preApprovalForm');
  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Submitting Request...
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      const container = document.querySelector('.modal-container');
      if (container) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #ECFDF5; color: #059669; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">Pre-Approval Request Received!</h3>
            <p style="color: #64748B; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
              Thank you! One of our senior Australian mortgage specialists will review your borrowing scenario and contact you within 2 business hours.
            </p>
            <button onclick="document.getElementById('preApprovalModal').classList.remove('active'); document.body.style.overflow='';" class="btn-primary" style="padding: 0.75rem 2rem;">
              Back to Home
            </button>
          </div>
        `;
      }
    }, 900);
  });
});
