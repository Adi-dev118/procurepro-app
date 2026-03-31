// Vendor Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initVendorSidebarToggle();
  initVendorMobileMenu();
  initVendorSearchBox();
  initVendorTabs();
  initVendorDataTables();
  initVendorNotifications();
  initVendorProductActions();
  initVendorOrderActions();
  initVendorRFQActions();
  initVendorFormValidation();

  // Set current page active in sidebar
  setVendorActivePage();

  // Load initial data for dashboard
  if (document.querySelector('.vendor-dashboard-page')) {
    loadVendorDashboardData();
  }
});

// Sidebar toggle functionality
function initVendorSidebarToggle() {
  const toggleBtn = document.querySelector('.vendor-toggle-btn');
  const sidebar = document.querySelector('.vendor-sidebar');
  const mainContent = document.querySelector('.vendor-main-content');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');

      // Update button icon
      const icon = this.querySelector('i');
      if (icon.classList.contains('bi-chevron-left')) {
        icon.className = 'bi bi-chevron-right';
      } else {
        icon.className = 'bi bi-chevron-left';
      }

      // Save state in localStorage
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('vendorSidebarCollapsed', isCollapsed);
    });

    // Load saved state
    const savedState = localStorage.getItem('vendorSidebarCollapsed');
    if (savedState === 'true') {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
      const icon = toggleBtn.querySelector('i');
      icon.className = 'bi bi-chevron-right';
    }
  }
}

// Mobile menu functionality
function initVendorMobileMenu() {
  const mobileMenuBtn = document.querySelector('.vendor-mobile-menu-btn');
  const sidebar = document.querySelector('.vendor-sidebar');
  const mobileOverlay = document.querySelector('.vendor-mobile-overlay');

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
function initVendorSearchBox() {
  const searchInput = document.querySelector('.vendor-search-box input');

  if (searchInput) {
    searchInput.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });

    searchInput.addEventListener('blur', function () {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });

    // Add search functionality
    searchInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        performVendorSearch(this.value);
      }
    });
  }
}

// Tab functionality
function initVendorTabs() {
  const tabLinks = document.querySelectorAll('.vendor-nav-tabs .nav-link');

  tabLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Get target tab
      const targetId = this.getAttribute('data-bs-target') || this.getAttribute('href');
      const targetTab = document.querySelector(targetId);

      if (!targetTab) return;

      // Remove active class from all tabs
      document.querySelectorAll('.vendor-nav-tabs .nav-link').forEach((tab) => {
        tab.classList.remove('active');
      });

      // Hide all tab contents
      document.querySelectorAll('.vendor-tab-content .tab-pane').forEach((pane) => {
        pane.classList.remove('show', 'active');
      });

      // Activate current tab
      this.classList.add('active');
      targetTab.classList.add('show', 'active');
    });
  });
}

// Initialize data tables
function initVendorDataTables() {
  const tables = document.querySelectorAll('.vendor-table[data-sortable="true"]');

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
          sortVendorTable(table, columnIndex, 'asc');
        } else if (isAscending) {
          this.classList.add('sort-desc');
          sortVendorTable(table, columnIndex, 'desc');
        } else {
          sortVendorTable(table, columnIndex, 'asc');
          this.classList.add('sort-asc');
        }
      });
    });
  });
}

// Sort table function
function sortVendorTable(table, columnIndex, direction) {
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

// Notification functionality
function initVendorNotifications() {
  const badge = document.querySelector('.vendor-notification-badge span');
  const notificationBell = document.querySelector('.vendor-notification-badge');

  if (badge) {
    // Set random notification count
    const notificationCount = Math.floor(Math.random() * 5) + 1;
    badge.textContent = notificationCount;

    // Notification dropdown functionality
    if (notificationBell) {
      notificationBell.addEventListener('click', function (e) {
        e.stopPropagation();
        showVendorNotifications();
      });
    }
  }
}

// Show notifications
function showVendorNotifications() {
  // Create notification dropdown
  let dropdown = document.querySelector('.vendor-notification-dropdown');

  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'vendor-notification-dropdown';
    dropdown.innerHTML = `
            <div class="vendor-notification-header">
                <h6>Notifications</h6>
                <button type="button" class="btn btn-link btn-sm">Mark all as read</button>
            </div>
            <div class="vendor-notification-list">
                <div class="vendor-notification-item unread">
                    <div class="vendor-notification-icon">
                        <i class="bi bi-cart-check"></i>
                    </div>
                    <div class="vendor-notification-content">
                        <p>New order #ORD-7842 received</p>
                        <span class="vendor-notification-time">10 minutes ago</span>
                    </div>
                </div>
                <div class="vendor-notification-item unread">
                    <div class="vendor-notification-icon">
                        <i class="bi bi-chat-left-text"></i>
                    </div>
                    <div class="vendor-notification-content">
                        <p>New RFQ for electronics components</p>
                        <span class="vendor-notification-time">1 hour ago</span>
                    </div>
                </div>
                <div class="vendor-notification-item">
                    <div class="vendor-notification-icon">
                        <i class="bi bi-credit-card"></i>
                    </div>
                    <div class="vendor-notification-content">
                        <p>Payment of $1,245.50 processed</p>
                        <span class="vendor-notification-time">Yesterday</span>
                    </div>
                </div>
            </div>
            <div class="vendor-notification-footer">
                <a href="#" class="btn btn-link btn-sm w-100">View all notifications</a>
            </div>
        `;

    document.querySelector('.vendor-topbar-actions').appendChild(dropdown);

    // Position dropdown
    const bell = document.querySelector('.vendor-notification-badge');
    const rect = bell.getBoundingClientRect();
    dropdown.style.position = 'absolute';
    dropdown.style.top = rect.bottom + 10 + 'px';
    dropdown.style.right = '30px';
    dropdown.style.width = '350px';
    dropdown.style.zIndex = '1000';

    // Add styles
    dropdown.style.backgroundColor = 'white';
    dropdown.style.borderRadius = '10px';
    dropdown.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    dropdown.style.border = '1px solid #eee';

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target) && !bell.contains(e.target)) {
        dropdown.remove();
      }
    });

    // Mark as read functionality
    dropdown.querySelectorAll('.vendor-notification-item.unread').forEach((item) => {
      item.addEventListener('click', function () {
        this.classList.remove('unread');
        updateNotificationBadge();
      });
    });

    // Mark all as read
    dropdown
      .querySelector('.vendor-notification-header button')
      .addEventListener('click', function () {
        dropdown.querySelectorAll('.vendor-notification-item.unread').forEach((item) => {
          item.classList.remove('unread');
        });
        updateNotificationBadge();
      });
  } else {
    dropdown.remove();
  }
}

// Update notification badge
function updateNotificationBadge() {
  const badge = document.querySelector('.vendor-notification-badge span');
  if (badge) {
    const unreadCount = document.querySelectorAll('.vendor-notification-item.unread').length;
    badge.textContent = unreadCount;
    if (unreadCount === 0) {
      badge.style.display = 'none';
    }
  }
}

// Product actions
function initVendorProductActions() {
  // Delete product
  document.querySelectorAll('.vendor-btn-icon.delete').forEach((btn) => {
    btn.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');
      const productName = this.getAttribute('data-product-name');

      if (confirm(`Are you sure you want to delete "${productName}"?`)) {
        deleteVendorProduct(productId, this);
      }
    });
  });

  // Edit product
  document.querySelectorAll('.vendor-btn-icon.edit').forEach((btn) => {
    btn.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');
      editVendorProduct(productId);
    });
  });

  // Add product button
  const addProductBtn = document.querySelector('.btn-add-product');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', function () {
      showAddProductModal();
    });
  }
}

// Delete product function
function deleteVendorProduct(productId, button) {
  console.log(`Deleting product ${productId}`);

  // Remove from UI
  const productCard = button.closest('.vendor-product-card') || button.closest('tr');
  productCard.style.opacity = '0.5';

  setTimeout(() => {
    productCard.remove();
    showVendorToast('Product deleted successfully', 'success');

    // Update product count
    updateProductStats();
  }, 300);
}

// Edit product function
function editVendorProduct(productId) {
  console.log(`Editing product ${productId}`);
  showVendorToast('Opening product editor...', 'info');

  // In a real app, this would open an edit modal
  // For now, just show a toast
  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
  }, 500);
}

// Update product stats
function updateProductStats() {
  const productCards = document.querySelectorAll('.vendor-product-card').length;
  const productCountElement = document.querySelector(
    '.vendor-stat-card.products .vendor-stat-card-value',
  );

  if (productCountElement) {
    productCountElement.textContent = productCards;
  }
}

// Order actions
function initVendorOrderActions() {
  // Process order
  document.querySelectorAll('.btn-process-order').forEach((btn) => {
    btn.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
      processVendorOrder(orderId, this);
    });
  });

  // Ship order
  document.querySelectorAll('.btn-ship-order').forEach((btn) => {
    btn.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
      shipVendorOrder(orderId, this);
    });
  });

  // Complete order
  document.querySelectorAll('.btn-complete-order').forEach((btn) => {
    btn.addEventListener('click', function () {
      const orderId = this.getAttribute('data-order-id');
      completeVendorOrder(orderId, this);
    });
  });
}

// Process order function
function processVendorOrder(orderId, button) {
  console.log(`Processing order ${orderId}`);

  // Update UI
  const row = button.closest('tr');
  row.querySelector('.vendor-status-badge').textContent = 'Processing';
  row.querySelector('.vendor-status-badge').className = 'vendor-status-badge processing';

  // Update action buttons
  const actionCell = row.querySelector('.vendor-action-buttons');
  actionCell.innerHTML = `
        <button class="btn btn-info btn-sm btn-ship-order" data-order-id="${orderId}">
            <i class="bi bi-truck me-1"></i> Ship
        </button>
        <button class="btn btn-danger btn-sm">
            <i class="bi bi-x-circle me-1"></i> Cancel
        </button>
    `;

  // Re-initialize event listeners
  initVendorOrderActions();

  showVendorToast('Order marked as processing', 'success');
}

// Ship order function
function shipVendorOrder(orderId, button) {
  console.log(`Shipping order ${orderId}`);

  // Update UI
  const row = button.closest('tr');
  row.querySelector('.vendor-status-badge').textContent = 'Shipped';
  row.querySelector('.vendor-status-badge').className = 'vendor-status-badge shipped';

  // Update action buttons
  const actionCell = row.querySelector('.vendor-action-buttons');
  actionCell.innerHTML = `
        <button class="btn btn-success btn-sm btn-complete-order" data-order-id="${orderId}">
            <i class="bi bi-check-circle me-1"></i> Complete
        </button>
        <button class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-printer me-1"></i> Invoice
        </button>
    `;

  // Re-initialize event listeners
  initVendorOrderActions();

  showVendorToast('Order marked as shipped', 'success');
}

// Complete order function
function completeVendorOrder(orderId, button) {
  console.log(`Completing order ${orderId}`);

  // Update UI
  const row = button.closest('tr');
  row.querySelector('.vendor-status-badge').textContent = 'Completed';
  row.querySelector('.vendor-status-badge').className = 'vendor-status-badge completed';

  // Update action buttons
  const actionCell = row.querySelector('.vendor-action-buttons');
  actionCell.innerHTML = `
        <button class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-eye me-1"></i> View
        </button>
        <button class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-printer me-1"></i> Invoice
        </button>
    `;

  showVendorToast('Order marked as completed', 'success');
}

// RFQ actions
function initVendorRFQActions() {
  // Submit quote
  document.querySelectorAll('.btn-submit-quote').forEach((btn) => {
    btn.addEventListener('click', function () {
      const rfqId = this.getAttribute('data-rfq-id');
      submitRFQQuote(rfqId, this);
    });
  });

  // View RFQ details
  document.querySelectorAll('.btn-view-rfq').forEach((btn) => {
    btn.addEventListener('click', function () {
      const rfqId = this.getAttribute('data-rfq-id');
      viewRFQDetails(rfqId);
    });
  });
}

// Submit quote function
function submitRFQQuote(rfqId, button) {
  console.log(`Submitting quote for RFQ ${rfqId}`);

  // Show quote submission modal
  const modal = new bootstrap.Modal(document.getElementById('submitQuoteModal'));
  modal.show();

  // Update button after submission
  button.addEventListener('click', function () {
    button.innerHTML = '<i class="bi bi-clock me-1"></i> Quote Submitted';
    button.className = 'btn btn-secondary btn-sm';
    button.disabled = true;
    showVendorToast('Quote submitted successfully', 'success');
  });
}

// View RFQ details
function viewRFQDetails(rfqId) {
  console.log(`Viewing RFQ ${rfqId}`);
  // In a real app, this would open a detailed view
  showVendorToast('Opening RFQ details...', 'info');
}

// Form validation
function initVendorFormValidation() {
  const forms = document.querySelectorAll('.vendor-needs-validation');

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

// Set active page in sidebar
function setVendorActivePage() {
  const currentPage = window.location.pathname.split('/').pop();
  const menuLinks = document.querySelectorAll('.vendor-sidebar-menu a');

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
function loadVendorDashboardData() {
  console.log('Loading vendor dashboard data...');

  // Update stat cards with random data
  const statCards = document.querySelectorAll('.vendor-stat-card-value');

  statCards.forEach((card) => {
    const currentValue = parseInt(card.textContent.replace(/[^0-9]/g, ''));
    const randomChange = Math.floor(Math.random() * 20) - 5;

    // Update change indicator
    const changeElement = card.nextElementSibling;
    if (changeElement && changeElement.classList.contains('vendor-stat-card-change')) {
      const changeClass = randomChange >= 0 ? 'positive' : 'negative';
      const changeIcon = randomChange >= 0 ? '↑' : '↓';

      changeElement.textContent = `${changeIcon} ${Math.abs(randomChange)}% from last month`;
      changeElement.className = `vendor-stat-card-change ${changeClass}`;
    }
  });
}

// Perform search
function performVendorSearch(query) {
  console.log(`Searching for: ${query}`);

  if (query.trim()) {
    showVendorToast(`Search results for "${query}"`, 'info');
  }
}

// Show toast notification
function showVendorToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.vendor-toast-container');

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'vendor-toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }

  // Create toast
  const toastId = 'vendor-toast-' + Date.now();
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

// Show add product modal
function showAddProductModal() {
  // In a real app, this would open a modal
  // For now, just show a toast
  showVendorToast('Opening product creation form...', 'info');

  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
  }, 500);
}
const profileTrigger = document.getElementById('profileTrigger');
const profileDropdown = document.getElementById('profileDropdown');
const profileChevron = document.getElementById('profileChevron');
const signOut = document.getElementById('signoutButton');

profileTrigger.addEventListener('click', function (e) {
  e.stopPropagation();
  const isOpen = profileDropdown.classList.toggle('open');
  profileChevron.classList.toggle('rotated', isOpen);
});

document.addEventListener('click', function () {
  profileDropdown.classList.remove('open');
  profileChevron.classList.remove('rotated');
});

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
    console.log('Logiut')
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