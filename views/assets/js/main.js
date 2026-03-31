// Main JavaScript for Admin Dashboard

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initSidebarToggle();
  initMobileMenu();
  initSearchBox();
  initTabs();
  initDataTables();
  initCharts();
  initFormValidation();
  initNotificationBadge();
  initUserActions();

  // Set current page active in sidebar
  setActivePage();

  // Load initial data for dashboard
  if (document.querySelector('.dashboard-page')) {
    loadDashboardData();
  }
});

// Sidebar toggle functionality
function initSidebarToggle() {
  const toggleBtn = document.querySelector('.toggle-btn');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');

      // Save state in localStorage
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    });

    // Load saved state
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
    }
  }
}

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      sidebar.classList.add('mobile-open');
      if (mobileOverlay) mobileOverlay.classList.add('active');
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function () {
      sidebar.classList.remove('mobile-open');
      mobileOverlay.classList.remove('active');
    });
  }
}

// Search box functionality
function initSearchBox() {
  const searchInputs = document.querySelectorAll('input[name="search"]');

  searchInputs.forEach((searchInput) => {
    const searchBtn = searchInput.parentElement.querySelector('.search-btn');

    // Focus UI effect (keep this)
    searchInput.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });

    searchInput.addEventListener('blur', function () {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });

    // ❌ REMOVE this (VERY IMPORTANT)
    // searchInput.addEventListener('input', ...)

    // ✅ Search on button click
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        state.search = searchInput.value;
        state.page = 1;
        performSearch(state.search);
      });
    }

    // ✅ Search on Enter key
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        state.search = this.value;
        state.page = 1;
        performSearch(state.search);
      }
    });
  });
}
// Tab functionality
function initTabs() {
  const tabLinks = document.querySelectorAll('.nav-tabs .nav-link');

  tabLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Get target tab
      const targetId = this.getAttribute('data-bs-target') || this.getAttribute('href');
      const targetTab = document.querySelector(targetId);

      if (!targetTab) return;

      // Remove active class from all tabs
      document.querySelectorAll('.nav-tabs .nav-link').forEach((tab) => {
        tab.classList.remove('active');
      });

      // Hide all tab contents
      document.querySelectorAll('.tab-pane').forEach((pane) => {
        pane.classList.remove('show', 'active');
      });

      // Activate current tab
      this.classList.add('active');
      targetTab.classList.add('show', 'active');
    });
  });
}

// Initialize data tables with sorting and filtering
function initDataTables() {
  const tables = document.querySelectorAll('.table[data-sortable="true"]');

  tables.forEach((table) => {
    const headers = table.querySelectorAll('th[data-sortable]');

    headers.forEach((header) => {
      header.style.cursor = 'pointer';
      header.addEventListener('click', function () {
        const columnIndex = Array.from(this.parentNode.children).indexOf(this);
        const isAscending = this.classList.contains('sort-asc');
        const isDescending = this.classList.contains('sort-desc');

        // Remove sort classes from all headers
        headers.forEach((h) => {
          h.classList.remove('sort-asc', 'sort-desc');
        });

        // Set new sort direction
        if (!isAscending && !isDescending) {
          this.classList.add('sort-asc');
          sortTable(table, columnIndex, 'asc');
        } else if (isAscending) {
          this.classList.add('sort-desc');
          sortTable(table, columnIndex, 'desc');
        } else {
          sortTable(table, columnIndex, 'asc');
          this.classList.add('sort-asc');
        }
      });
    });
  });
}

// Sort table function
function sortTable(table, columnIndex, direction) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aCell = a.children[columnIndex].textContent.trim();
    const bCell = b.children[columnIndex].textContent.trim();

    // Try to convert to numbers for numeric comparison
    const aNum = parseFloat(aCell.replace(/[^0-9.-]+/g, ''));
    const bNum = parseFloat(bCell.replace(/[^0-9.-]+/g, ''));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return direction === 'asc' ? aNum - bNum : bNum - aNum;
    } else {
      // String comparison
      return direction === 'asc' ? aCell.localeCompare(bCell) : bCell.localeCompare(aCell);
    }
  });

  // Remove existing rows
  rows.forEach((row) => tbody.removeChild(row));

  // Append sorted rows
  rows.forEach((row) => tbody.appendChild(row));
}

// Initialize chart placeholders (in a real app, use Chart.js or similar)
function initCharts() {
  // This would be replaced with actual chart library initialization
  console.log('Charts initialized - in a real app, use Chart.js, D3.js, etc.');
}

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');

  forms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }

      form.classList.add('was-validated');
    });
  });
}

// Notification badge
function initNotificationBadge() {
  // Simulate new notifications
  const badge = document.querySelector('.notification-badge span');
  if (badge) {
    // Random number of notifications for demo
    const notificationCount = Math.floor(Math.random() * 5) + 1;
    badge.textContent = notificationCount;

    // Mark as read on click
    document.querySelector('.notification-badge').addEventListener('click', function () {
      badge.textContent = '0';
      badge.style.backgroundColor = '#777';
    });
  }
}

// User action handlers (approve, reject, suspend, etc.)
function initUserActions() {
  // Approve button
  document.querySelectorAll('.btn-approve').forEach((btn) => {
    btn.addEventListener('click', function () {
      const userId = this.getAttribute('data-user-id');
      approveUser(userId, this);
    });
  });

  // Reject button
  document.querySelectorAll('.btn-reject').forEach((btn) => {
    btn.addEventListener('click', function () {
      const userId = this.getAttribute('data-user-id');
      rejectUser(userId, this);
    });
  });

  // Suspend button
  document.querySelectorAll('.btn-suspend').forEach((btn) => {
    btn.addEventListener('click', function () {
      const userId = this.getAttribute('data-user-id');
      suspendUser(userId, this);
    });
  });

  // Delete button
  document.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', function () {
      const itemId = this.getAttribute('data-id');
      const itemType = this.getAttribute('data-type');

      if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
        deleteItem(itemId, itemType, this);
      }
    });
  });
}

// User action functions
function approveUser(userId, button) {
  console.log(`Approving user ${userId}`);

  // Update UI
  const row = button.closest('tr');
  row.querySelector('.status-badge').textContent = 'Approved';
  row.querySelector('.status-badge').className = 'status-badge approved';

  // Remove action buttons
  const actionCell = row.querySelector('.action-buttons');
  actionCell.innerHTML = '<span class="text-success">Approved</span>';

  showToast('User approved successfully', 'success');
}

function rejectUser(userId, button) {
  console.log(`Rejecting user ${userId}`);

  // Update UI
  const row = button.closest('tr');
  row.querySelector('.status-badge').textContent = 'Rejected';
  row.querySelector('.status-badge').className = 'status-badge suspended';

  // Remove action buttons
  const actionCell = row.querySelector('.action-buttons');
  actionCell.innerHTML = '<span class="text-danger">Rejected</span>';

  showToast('User rejected', 'warning');
}

function suspendUser(userId, button) {
  console.log(`Suspending user ${userId}`);

  // Update UI
  const row = button.closest('tr');
  const statusBadge = row.querySelector('.status-badge');

  if (statusBadge.classList.contains('active')) {
    statusBadge.textContent = 'Suspended';
    statusBadge.className = 'status-badge suspended';
    button.textContent = 'Activate';
    button.className = 'btn btn-success btn-sm btn-activate';

    showToast('User suspended', 'warning');
  } else {
    statusBadge.textContent = 'Active';
    statusBadge.className = 'status-badge active';
    button.textContent = 'Suspend';
    button.className = 'btn btn-warning btn-sm btn-suspend';

    showToast('User activated', 'success');
  }
}

function deleteItem(itemId, itemType, button) {
  console.log(`Deleting ${itemType} ${itemId}`);

  // Remove row from table
  const row = button.closest('tr');
  row.style.opacity = '0.5';

  setTimeout(() => {
    row.remove();
    showToast(`${itemType} deleted successfully`, 'success');
  }, 300);
}

// Set active page in sidebar
function setActivePage() {
  const currentPage = window.location.pathname.split('/').pop();
  const menuLinks = document.querySelectorAll('.sidebar-menu a');

  menuLinks.forEach((link) => {
    const linkPage = link.getAttribute('href').split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Load dashboard data
function loadDashboardData() {
  // Simulate loading data
  console.log('Loading dashboard data...');

  // Update KPI cards with random data (in real app, fetch from API)
  const kpiCards = document.querySelectorAll('.kpi-card-value');

  kpiCards.forEach((card) => {
    const currentValue = parseInt(card.textContent.replace(/[^0-9]/g, ''));
    const randomChange = Math.floor(Math.random() * 20) - 5;

    // Update change indicator
    const changeElement = card.nextElementSibling;
    if (changeElement && changeElement.classList.contains('kpi-card-change')) {
      const changeClass = randomChange >= 0 ? 'positive' : 'negative';
      const changeIcon = randomChange >= 0 ? '↑' : '↓';

      changeElement.textContent = `${changeIcon} ${Math.abs(randomChange)}% from last period`;
      changeElement.className = `kpi-card-change ${changeClass}`;
    }
  });
}
// Toast notification
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }

  // Create toast
  const toastId = 'toast-' + Date.now();
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  toast.id = toastId;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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

// Utility function to format numbers
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Admin logout Function

const signOut = document.getElementById('signoutButton');

async function handleLogout() {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'POST',
    });

    const data = await res.json();

    if (!res.ok) {
      toast(data.message || 'Logout failed');
      return;
    }
    console.log('Logiut');
    toast(data.message || 'Logged out successfully');

    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  } catch (error) {
    toast('Network error. Try again.');
  }
}
if (signOut) {
  signOut.addEventListener('click', handleLogout);
}

