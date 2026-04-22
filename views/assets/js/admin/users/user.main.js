import { userState } from './user.state.js';
import {
  fetchUsers,
  fetchSuppliers,
  fetchPendingSuppliers,
  fetchSuspendedUsers,
} from './user.api.js';

function changePage(page) {
  if (page < 1) return;
  userState.page = page;

  if (userState.role === 'supplier') {
    fetchSuppliers();
  } else if (userState.role === 'pending') {
    fetchPendingSuppliers(); // ✅ IMPORTANT
  } else if (userState.role === 'suspended') {
    fetchSuspendedUsers();
  } else {
    fetchUsers();
  }
}

// Filters Functions

function setStatusFilter(status) {
  if (userState.status === status) {
    userState.status = ''; // remove filter
  } else {
    userState.status = status;
  }
  userState.page = 1;

  if (userState.role === 'supplier') {
    if (userState.status === 'active') userState.status = 'approved';
    fetchSuppliers();
  } else if (userState.role === 'pending') {
    fetchPendingSuppliers();
  } else if (userState.role === 'suspended') {
    fetchSuspendedUsers();
  } else {
    fetchUsers();
  }
}
function setRoleFilter(role) {
  const mappedRole = role === 'buyer' ? 'customer' : role;

  // 🔥 TOGGLE
  if (userState.filterRole === mappedRole) {
    userState.filterRole = '';
  } else {
    userState.filterRole = mappedRole;
  }
  userState.page = 1;
  if (userState.role === 'supplier') {
    fetchSuppliers();
  } else if (userState.role === 'pending') {
    fetchPendingSuppliers();
  } else if (userState.role === 'suspended') {
    fetchSuspendedUsers(); // ✅ now correct
  } else {
    fetchUsers();
  }
}

function clearFilters() {
  userState.status = '';
  userState.filterRole = '';
  userState.search = '';
  userState.page = 1;

  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });

  if (userState.role === 'supplier') {
    fetchSuppliers();
  } else if (userState.role === 'pending') {
    fetchPendingSuppliers();
  } else if (userState.role === 'suspended') {
    fetchSuspendedUsers();
  } else {
    fetchUsers();
  }
}

async function performSearch(query) {
  try {
    userState.search = query;
    userState.page = 1;
    if (userState.role === 'supplier') {
      fetchSuppliers();
    } else if (userState.role === 'pending') {
      fetchPendingSuppliers(); // ✅
    } else if (userState.role === 'suspended') {
      fetchSuspendedUsers(); // ✅ ADD THIS
    } else {
      fetchUsers();
    } // ✅ reuses the same filter-aware fetch
  } catch (err) {
    console.error(err);
  }
}

function resetSearch() {
  userState.search = '';

  // clear ALL search inputs (because multiple tabs)
  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });
}

document.getElementById('all-users-tab').addEventListener('click', () => {
  resetSearch();
  userState.role = '';
  userState.status = '';
  userState.filterRole = '';
  userState.page = 1;
  fetchUsers();
});

document.getElementById('buyers-tab').addEventListener('click', () => {
  resetSearch();
  userState.role = 'customer'; // 🔥 KEY
  userState.status = '';
  userState.page = 1;
  userState.filterRole = '';
  fetchUsers();
});

document.getElementById('suppliers-tab').addEventListener('click', () => {
  resetSearch();
  userState.role = 'supplier'; // 🔥 KEY
  userState.status = '';
  userState.filterRole = '';
  userState.page = 1;
  fetchSuppliers();
});

document.getElementById('pending-tab').addEventListener('click', () => {
  resetSearch();
  userState.role = 'pending'; // 🔥 KEY
  userState.status = '';
  userState.filterRole = '';
  userState.page = 1;
  fetchPendingSuppliers();
});
document.getElementById('suspended-tab').addEventListener('click', () => {
  resetSearch();
  userState.role = 'suspended';
  userState.filterRole = '';
  userState.page = 1;
  fetchSuspendedUsers();
});
document.addEventListener('click', (e) => {
  const pageBtn = e.target.closest('.page-link');

  if (pageBtn && pageBtn.dataset.page) {
    e.preventDefault();
    const page = Number(pageBtn.dataset.page);
    changePage(page);
  }
});

document.querySelectorAll('input[name="search"]').forEach((input) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(input.value.trim()); // 🔥 ALSO HERE
    }
  });
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.search-btn');

  if (btn) {
    const input = btn.closest('.input-group').querySelector('input[name="search"]');
    performSearch(input.value.trim());
  }
});

document.addEventListener('click', (e) => {
  const statusBtn = e.target.closest('.status-filter');

  if (statusBtn) {
    e.preventDefault();
    const status = statusBtn.dataset.status;
    setStatusFilter(status);
  }
});

document.addEventListener('click', (e) => {
  const roleBtn = e.target.closest('[data-role]');

  if (roleBtn) {
    e.preventDefault();
    const role = roleBtn.dataset.role;
    setRoleFilter(role);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.clear-filters')) {
    e.preventDefault();
    clearFilters();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

  let activeTab = '#profile-tab';

  const modal = document.getElementById('viewUserModal');

  // 🔹 Track tab changes (ONLY modal tabs)
  modal.querySelectorAll('#userDetailTabs button').forEach((tabBtn) => {
    tabBtn.addEventListener('shown.bs.tab', (e) => {
      activeTab = e.target.getAttribute('data-bs-target');
    });
  });

  // 🔹 Restore tab
  modal.addEventListener('shown.bs.modal', () => {
    setTimeout(() => {
      const triggerEl = modal.querySelector(
        `#userDetailTabs button[data-bs-target="${activeTab}"]`,
      );

      if (triggerEl) {
        new bootstrap.Tab(triggerEl).show();
      }
    }, 10);
  });

  // 🔹 Reset ONLY modal tabs (NOT whole page)
  modal.addEventListener('hidden.bs.modal', () => {
    modal.querySelectorAll('#userDetailTabs button').forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    modal.querySelectorAll('.tab-pane').forEach((pane) => {
      pane.classList.remove('show', 'active');
    });
  });
});
// Action buttons

let currentAction = null;
let currentUserId = null;

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const userId = btn.dataset.id;

  // 🔴 Suspend → modal (already done)
  if (btn.classList.contains('suspend-btn')) {
    document.getElementById('suspendUserId').value = userId;
    document.getElementById('suspendReason').value = '';

    new bootstrap.Modal(document.getElementById('suspendUserModal')).show();
  }

  // 🔵 Approve → open modal
  if (btn.classList.contains('approve-btn')) {
    currentAction = 'approve';
    currentUserId = userId;

    document.getElementById('actionModalTitle').innerText = 'Approve User';
    document.getElementById('actionModalBody').innerText =
      'Are you sure you want to approve this user?';

    new bootstrap.Modal(document.getElementById('actionModal')).show();
  }

  // 🟢 Activate → open modal
  if (btn.classList.contains('activate-btn')) {
    currentAction = 'activate';
    currentUserId = userId;

    document.getElementById('actionModalTitle').innerText = 'Activate User';
    document.getElementById('actionModalBody').innerText =
      'Are you sure you want to activate this user?';

    new bootstrap.Modal(document.getElementById('actionModal')).show();
  }
});

document.getElementById('confirmActionBtn').addEventListener('click', async () => {
  if (!currentAction || !currentUserId) return;

  try {
    let url = '';

    if (currentAction === 'approve') {
      url = `/admin/user/users-data/modal-data/${currentUserId}/approve`;
    }

    if (currentAction === 'activate') {
      url = `/admin/user/users-data/modal-data/${currentUserId}/activate`;
    }

    await fetch(url, {
      method: 'PUT',
    });

    // close modal
    bootstrap.Modal.getInstance(document.getElementById('actionModal')).hide();

    fetchUsers(); // refresh table
  } catch (err) {
    console.error(err);
    alert('Action failed');
  }
});
