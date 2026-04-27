// Company Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Initialize components
  initMobileMenu();
  initSearch();
  initNotifications();
  initFilters();
  initOrderTracking();
  initProfileTabs();
  initModals();

  // Load data based on current page
  const currentPage = window.location.pathname.split('/').pop();
  loadPageData(currentPage);
});

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.company-nav-mobile');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileNav.classList.toggle('active');
      if (mobileOverlay) mobileOverlay.classList.toggle('active');
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function () {
      mobileNav.classList.remove('active');
      mobileOverlay.classList.remove('active');
    });
  }
}

// Search functionality
function initSearch() {
  const searchInput = document.querySelector('.search-box-company input');

  if (searchInput) {
    searchInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        performSearch(this.value);
      }
    });
  }
}

// Notifications
function initNotifications() {
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationBadge = document.querySelector('.notification-badge');

  if (notificationBtn) {
    notificationBtn.addEventListener('click', function () {
      showNotifications();
      // Mark as read
      if (notificationBadge) {
        notificationBadge.style.display = 'none';
      }
    });
  }
}

// Marketplace filters
function initFilters() {
  const filterTags = document.querySelectorAll('.filter-tag');
  const priceInputs = document.querySelectorAll('.price-range input');
  const clearFiltersBtn = document.querySelector('.clear-filters');

  // Filter tags
  filterTags.forEach((tag) => {
    tag.addEventListener('click', function () {
      this.classList.toggle('active');
      applyFilters();
    });
  });

  // Price range
  priceInputs.forEach((input) => {
    input.addEventListener('change', applyFilters);
  });

  // Clear filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearFilters);
  }
}



// Order tracking
function initOrderTracking() {
  const trackOrderBtns = document.querySelectorAll('.track-order-btn');

  trackOrderBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
      showOrderTracking(orderId);
    });
  });
}

// Profile tabs
function initProfileTabs() {
  const profileTabs = document.querySelectorAll('.profile-tabs .nav-link');

  profileTabs.forEach((tab) => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active class from all tabs
      profileTabs.forEach((t) => t.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');

      // Show corresponding tab content
      const targetId = this.getAttribute('data-bs-target');
      const targetTab = document.querySelector(targetId);

      if (targetTab) {
        document.querySelectorAll('.tab-pane').forEach((pane) => {
          pane.classList.remove('show', 'active');
        });
        targetTab.classList.add('show', 'active');
      }
    });
  });
}

// Modals
function initModals() {
  // Close modals on overlay click
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        const modalInstance = bootstrap.Modal.getInstance(this);
        modalInstance.hide();
      }
    });
  });
}

// Load page-specific data
function loadPageData(page) {
  switch (page) {
    case 'dashboard.html':
      loadDashboardData();
      break;
    case 'marketplace.html':
      loadMarketplaceData();
      break;
    case 'rfq.html':
      loadRFQData();
      break;
    case 'orders.html':
      loadOrdersData();
      break;
    case 'profile.html':
      loadProfileData();
      break;
  }
}

// Dashboard data
function loadDashboardData() {
  // Update KPI cards with random data
  const kpiValues = document.querySelectorAll('.kpi-value');

  kpiValues.forEach((card) => {
    const currentValue = parseInt(card.textContent.replace(/[^0-9]/g, ''));
    const randomChange = Math.floor(Math.random() * 20) - 5;

    // Update change indicator
    const changeElement = card.parentElement.querySelector('.kpi-change');
    if (changeElement) {
      const changeClass = randomChange >= 0 ? 'positive' : 'negative';
      const changeIcon = randomChange >= 0 ? '↑' : '↓';

      changeElement.textContent = `${changeIcon} ${Math.abs(randomChange)}% from last month`;
      changeElement.className = `kpi-change ${changeClass}`;
    }
  });

  // Load recent activity
  loadRecentActivity();
}

// Marketplace data
function loadMarketplaceData() {
  // In a real app, this would load products from API
  console.log('Loading marketplace data...');
}

// RFQ data
function loadRFQData() {
  // In a real app, this would load RFQs from API
  console.log('Loading RFQ data...');
}

// Orders data
function loadOrdersData() {
  // In a real app, this would load orders from API
  console.log('Loading orders data...');
}

// Profile data
function loadProfileData() {
  // In a real app, this would load profile data from API
  console.log('Loading profile data...');
}

// Search function
function performSearch(query) {
  console.log(`Searching for: ${query}`);

  if (query.trim()) {
    showToast(`Search results for "${query}"`, 'info');

    // In a real app, this would filter products/RFQs based on query
    if (document.querySelector('.products-grid')) {
      filterProductsByQuery(query);
    }
  }
}

// Filter products by search query
function filterProductsByQuery(query) {
  const products = document.querySelectorAll('.product-card');
  const queryLower = query.toLowerCase();

  products.forEach((product) => {
    const title = product.querySelector('.product-title').textContent.toLowerCase();
    const description = product.querySelector('.product-description').textContent.toLowerCase();
    const category = product.querySelector('.product-category').textContent.toLowerCase();

    if (
      title.includes(queryLower) ||
      description.includes(queryLower) ||
      category.includes(queryLower)
    ) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// Apply marketplace filters
function applyFilters() {
  const activeTags = Array.from(document.querySelectorAll('.filter-tag.active')).map((tag) =>
    tag.textContent.trim(),
  );

  const minPrice = document.querySelector('.price-min')?.value || 0;
  const maxPrice = document.querySelector('.price-max')?.value || 10000;

  console.log(`Applying filters: ${activeTags.join(', ')}, Price: $${minPrice}-$${maxPrice}`);

  // In a real app, this would filter products based on selected filters
  showToast('Filters applied', 'success');
}

// Clear all filters
function clearFilters() {
  document.querySelectorAll('.filter-tag.active').forEach((tag) => {
    tag.classList.remove('active');
  });

  const priceInputs = document.querySelectorAll('.price-range input');
  priceInputs[0].value = '';
  priceInputs[1].value = '';

  showToast('Filters cleared', 'info');
}

// Show notifications modal
function showNotifications() {
  // In a real app, this would show actual notifications
  const notifications = [
    {
      id: 1,
      type: 'offer',
      title: 'New quote received',
      message: 'Supplier TechGadgets Ltd has submitted a quote for your RFQ #RFQ-001',
      time: '10 min ago',
    },
    {
      id: 2,
      type: 'order',
      title: 'Order shipped',
      message: 'Your order #ORD-7842 has been shipped. Tracking number: TRK-789456123',
      time: '2 hours ago',
    },
    {
      id: 3,
      type: 'rfq',
      title: 'RFQ reminder',
      message: 'Your RFQ #RFQ-002 is closing in 24 hours',
      time: '1 day ago',
    },
  ];

  // Create notifications dropdown or modal
  const notificationHtml = `
        <div class="notification-dropdown">
            <div class="notification-header">
                <h6>Notifications</h6>
                <button class="btn btn-sm btn-outline-secondary">Mark all as read</button>
            </div>
            <div class="notification-list">
                ${notifications
                  .map(
                    (notif) => `
                    <div class="notification-item" data-id="${notif.id}">
                        <div class="notification-icon">
                            <i class="bi bi-${notif.type === 'offer' ? 'currency-dollar' : notif.type === 'order' ? 'truck' : 'megaphone'}"></i>
                        </div>
                        <div class="notification-content">
                            <h6>${notif.title}</h6>
                            <p>${notif.message}</p>
                            <span class="notification-time">${notif.time}</span>
                        </div>
                    </div>
                `,
                  )
                  .join('')}
            </div>
            <div class="notification-footer">
                <a href="#" class="view-all">View all notifications</a>
            </div>
        </div>
    `;

  // Show notification dropdown
  showNotificationDropdown(notificationHtml);
}

// Show order tracking
function showOrderTracking(orderId) {
  console.log(`Showing tracking for order ${orderId}`);

  // In a real app, this would show tracking details
  showToast(`Tracking information for order ${orderId}`, 'info');
}

// Load recent activity
function loadRecentActivity() {
  const activityData = [
    {
      type: 'order',
      title: 'New order placed',
      details: 'Order #ORD-7845 for Industrial Parts',
      time: '2 hours ago',
    },
    {
      type: 'rfq',
      title: 'RFQ created',
      details: 'RFQ #RFQ-003 for Machinery Components',
      time: '1 day ago',
    },
    {
      type: 'quote',
      title: 'Quote received',
      details: 'New quote from Global Supplies Inc.',
      time: '2 days ago',
    },
    {
      type: 'payment',
      title: 'Payment processed',
      details: 'Payment for order #ORD-7842 completed',
      time: '3 days ago',
    },
  ];

  const activityContainer = document.querySelector('.recent-activity');
  if (activityContainer) {
    const activityHtml = activityData
      .map(
        (item) => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="bi bi-${item.type === 'order' ? 'cart-check' : item.type === 'rfq' ? 'megaphone' : item.type === 'quote' ? 'file-text' : 'credit-card'}"></i>
                </div>
                <div class="activity-content">
                    <h6>${item.title}</h6>
                    <p>${item.details}</p>
                    <span class="activity-time">${item.time}</span>
                </div>
            </div>
        `,
      )
      .join('');

    activityContainer.innerHTML = activityHtml;
  }
}

// Show notification dropdown
function showNotificationDropdown(content) {
  // Remove existing dropdown
  const existingDropdown = document.querySelector('.notification-dropdown-container');
  if (existingDropdown) existingDropdown.remove();

  // Create new dropdown
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'notification-dropdown-container position-absolute';
  dropdownContainer.style.top = '60px';
  dropdownContainer.style.right = '20px';
  dropdownContainer.style.zIndex = '1000';
  dropdownContainer.innerHTML = content;

  document.body.appendChild(dropdownContainer);

  // Close dropdown when clicking outside
  setTimeout(() => {
    const closeDropdown = (e) => {
      if (!dropdownContainer.contains(e.target) && !e.target.closest('.notification-btn')) {
        dropdownContainer.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };
    document.addEventListener('click', closeDropdown);
  }, 100);
}

// Toast notification
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container-company');

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container-company position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }

  // Create toast
  const toastId = 'toast-' + Date.now();
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.id = toastId;

  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

  toastContainer.appendChild(toast);

  // Initialize and show toast
  const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
  bsToast.show();

  // Remove toast after it's hidden
  toast.addEventListener('hidden.bs.toast', function () {
    toast.remove();
  });
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const categorySelect = document.getElementById('rfqCategory');
  const supplierSelect = document.getElementById('supplierInvitation');

  // =========================
  // Load Categories
  // =========================

  async function loadCategories() {
    try {
      const res = await fetch('/api/v1/products/categories');
      const data = await res.json();

      categorySelect.innerHTML = `
        <option value="">Select Category</option>
      `;

      data.categories.forEach((category) => {
        categorySelect.innerHTML += `
          <option value="${category.id}">
            ${category.name}
          </option>
        `;
      });
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // On Category Change
  // Load Products + Suppliers
  // =========================

  categorySelect.addEventListener('change', async () => {
    const categoryId = categorySelect.value;

    if (!categoryId) return;

    await loadProducts(categoryId);
    await loadSuppliers(categoryId);
  });

  // =========================
  // Dynamic Products
  // =========================

  async function loadProducts(categoryId) {
    try {
      const res = await fetch(`/api/v1/products/by-category/${categoryId}`);

      const data = await res.json();

      document.querySelectorAll('.rfq-item-product').forEach((select) => {
        select.innerHTML = `
          <option value="">Select Item</option>
        `;

        data.products.forEach((product) => {
          select.innerHTML += `
            <option value="${product.id}">
              ${product.name}
            </option>
          `;
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // Dynamic Suppliers
  // =========================

  async function loadSuppliers(categoryId) {
    try {
      const res = await fetch(`/api/v1/users/vendor/by-category/${categoryId}`);

      const data = await res.json();

      supplierSelect.innerHTML = '';

      data.suppliers.forEach((supplier) => {
        supplierSelect.innerHTML += `
          <option value="${supplier.id}">
            ${supplier.business_name}
          </option>
        `;
      });
    } catch (error) {
      console.error(error);
    }
  }

  loadCategories();
});
// SIgnup Login

function switchTab(t) {
  ['Login', 'Signup'].forEach((n) => {
    document.getElementById('t' + n).classList.toggle('active', n.toLowerCase() === t);
    document.getElementById('p' + n).classList.toggle('active', n.toLowerCase() === t);
  });
}

function toast(msg) {
  document.getElementById('toastMsg').textContent = msg;
  const el = document.getElementById('toast');
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

function setErr(id, errId, cond) {
  document.getElementById(id)?.classList.toggle('error', cond);
  document.getElementById(errId)?.classList.toggle('show', cond);
  return cond;
}

function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function checkStrength(v) {
  const bar = document.getElementById('sBar');
  const fill = document.getElementById('sFill');
  bar.classList.toggle('show', v.length > 0);
  const s = [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(
    Boolean,
  ).length;
  fill.style.width = ['25%', '50%', '75%', '100%'][s - 1] || '0';
  fill.style.background = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'][s - 1] || 'transparent';
}

async function handleLogin() {
  const email = document.getElementById('lEmail').value.trim();
  const pass = document.getElementById('lPass').value;
  const e1 = setErr('lEmail', 'lEmailErr', !validEmail(email));
  const e2 = setErr('lPass', 'lPassErr', !pass);
  if (!e1 && !e2) {
    // TODO: POST /api/auth/login  →  { email, password: pass }
    try {
      const res = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });
      const data = await res.json();
      //   console.log(data.session.role);
      //   console.log(data.message, 'Hello');
      if (res.ok) {
        if (data.session.role === 'customer') {
          toast('Signed in successfully! Redirecting…');
          setTimeout(() => (window.location.href = '/dashboard'), 1800);
        } else if (data.session.role === 'admin') {
          toast('Signed in successfully! Redirecting…');
          setTimeout(() => (window.location.href = '/admin/dashboard'), 1800);
        } else {
          toast('Signed in successfully! Redirecting…');
          setTimeout(() => (window.location.href = '/vendor/dashboard'), 1800);
        }
      } else {
        toast(data.message || 'login failed');
      }
    } catch (error) {
      toast('Something went wrong');
    }
  }
}

async function handleSignup() {
  const first = document.getElementById('sFirst').value.trim();
  const last = document.getElementById('sLast').value.trim();
  const email = document.getElementById('sEmail').value.trim();
  const pass = document.getElementById('sPass').value;
  const confirm = document.getElementById('sConfirm').value;
  const errors = [
    setErr('sFirst', 'sFirstErr', !first),
    setErr('sLast', 'sLastErr', !last),
    setErr('sEmail', 'sEmailErr', !validEmail(email)),
    setErr('sPass', 'sPassErr', pass.length < 8),
    setErr('sConfirm', 'sConfirmErr', pass !== confirm),
  ];
  if (!errors.some(Boolean)) {
    // TODO: POST /api/auth/signup  →  { firstName: first, lastName: last, email, password: pass }
    // Backend should auto-assign role: 'buyer' for all new signups

    try {
      const res = await fetch('/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: `${first} ${last}`,
          email: email,
          password: pass,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast('Account created! Welcome to ProcurePro.');
        setTimeout(() => switchTab('login'), 5000);
      } else {
        toast(data.message || 'Signup failed');
      }
    } catch (error) {
      toast('Something went wrong');
    }
  }
}

function togglePass(btn) {
  const input = btn.previousElementSibling;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = isHidden
    ? '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>'
    : '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>';
}
document.addEventListener('DOMContentLoaded', function () {
  const signupBtn = document.getElementById('signupBtn');
  const loginBtn = document.getElementById('loginBtn');

  if (signupBtn) {
    signupBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handleSignup();
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handleLogin();
    });
  }
});
