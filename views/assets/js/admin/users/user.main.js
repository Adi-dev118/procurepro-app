import { userState } from './user.state.js';
import { fetchUsers, fetchSuppliers, fetchRecentActivities } from './user.api.js';

function changePage(page) {
  if (page < 1) return;
  userState.page = page;

  if (userState.role === 'supplier') {
    fetchSuppliers();
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
  fetchRecentActivities();

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
    document.getElementById('orders-tab-btn').style.display = '';
    document.getElementById('activity-tab-btn').style.display = '';

    document.getElementById('profile-content').innerHTML = '';
    document.getElementById('orders-content').innerHTML = '';
    document.getElementById('activity-content').innerHTML = '';
  });
});
// Action buttons

let currentAction = null;
let currentUserId = null;
let currentType = null;

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const id = btn.dataset.id;
  const type = btn.dataset.type; // 🔥

  // 🔴 Suspend → modal (already done)
  if (btn.classList.contains('suspend-btn')) {
    currentAction = 'suspend';
    currentUserId = id;
    currentType = type;
    document.getElementById('suspendUserId').value = currentUserId;
    document.getElementById('suspendReason').value = '';

    new bootstrap.Modal(document.getElementById('suspendUserModal')).show();
  }

  // 🔵 Approve → open modal
  if (btn.classList.contains('approve-btn')) {
    currentAction = 'approve';
    currentUserId = id;
    currentType = type;

    document.getElementById('actionModalTitle').innerText = 'Approve User';
    document.getElementById('actionModalBody').innerText =
      'Are you sure you want to approve this user?';

    new bootstrap.Modal(document.getElementById('actionModal')).show();
  }

  // 🟢 Activate → open modal
  if (btn.classList.contains('activate-btn')) {
    currentAction = 'activate';
    currentUserId = id;
    currentType = type;

    document.getElementById('actionModalTitle').innerText = 'Activate User';
    document.getElementById('actionModalBody').innerText =
      'Are you sure you want to activate this user?';

    new bootstrap.Modal(document.getElementById('actionModal')).show();
  }
});
const handleAction = async () => {
  const bodyData = {};
  if (!currentAction || !currentUserId) {
    console.error('Missing action/user');
    return;
  }

  let url = '';

  if (currentAction === 'approve') {
    console.log(currentType);
    if (currentType === 'vendor') {
      url = `/admin/supplier/supplier-data/modal-data/${currentUserId}/approve`;
    } else {
      url = `/admin/user/users-data/modal-data/${currentUserId}/approve`;
    }
  }

  if (currentAction === 'activate') {
    if (currentType === 'vendor') {
      url = `/admin/supplier/supplier-data/modal-data/${currentUserId}/activate`;
    } else {
      url = `/admin/user/users-data/modal-data/${currentUserId}/activate`;
    }
  }
  if (currentAction === 'suspend') {
    const reason = document.getElementById('suspendReason').value.trim();
    bodyData.reason = reason;
    if (currentType === 'vendor') {
      url = `/admin/supplier/supplier-data/modal-data/${currentUserId}/suspend`;
    } else {
      url = `/admin/user/users-data/modal-data/${currentUserId}/suspend`;
    }
  }

  await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });

  // ✅ CLOSE CORRECT MODAL
  if (currentAction === 'suspend') {
    bootstrap.Modal.getInstance(document.getElementById('suspendUserModal')).hide();
  } else {
    bootstrap.Modal.getInstance(document.getElementById('actionModal')).hide();
  }

  if (currentType === 'vendor') {
    fetchSuppliers();
  } else {
    fetchUsers();
  }
};

// attach both
document.getElementById('confirmActionBtn')?.addEventListener('click', handleAction);
document.getElementById('confirmSuspendBtn')?.addEventListener('click', handleAction);

function openUserModal(user) {
  function getStatusBadge(status) {
    const map = {
      delivered: 'success',
      pending: 'warning',
      processing: 'primary',
      cancelled: 'danger',
    };

    return `<span class="badge bg-${map[status] || 'secondary'}">${status}</span>`;
  }
  // 🔹 Set title
  document.querySelector('#viewUserModal .modal-title').textContent = user.name;

  // 🔹 PROFILE TAB
  document.getElementById('profile-content').innerHTML = `
  <div class="row g-4">

    <div class="col-md-6">
      <div class="card p-3 profile-card">
        <p><span>Name: </span>${user.name}</p>
        <p><span>Email: </span>${user.email}</p>
        <p><span>Role</span><span class="badge role-badge">${user.role}</span></p>
      </div>
    </div>

    <div class="col-md-6">
      <div class="card p-3 profile-card">
        <p><span>Phone: </span>${user.address?.phone || '-'}</p>
        <p><span>Address: </span>
          ${
            user.address
              ? `
                ${user.address.street}<br/>
                ${user.address.city}, ${user.address.state}<br/>
                ${user.address.pincode}
              `
              : '-'
          }
        </p>
      </div>
    </div>

  </div>
`;
  // 🔹 ORDERS TAB
  document.getElementById('orders-content').innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${
          user.orders?.length
            ? user.orders
                .map(
                  (o) => `
                <tr>
                  <td>#${o.id}</td>
                  <td>₹${o.amount}</td>
                 <td>${getStatusBadge(o.status)}</td>
                </tr>
              `,
                )
                .join('')
            : '<tr><td colspan="3">No orders</td></tr>'
        }
      </tbody>
    </table>
  `;

  // 🔹 ACTIVITY TAB
  document.getElementById('activity-content').innerHTML = `
    <ul class="list-group">
    ${
      user.activity?.length
        ? user.activity
            .map(
              (a) => `
              <li class="list-group-item activity-item">
  <div>
    <strong>${a.activity}</strong>
    <p class="mb-1 text-muted">${a.detail}</p>
    <small>${new Date(a.created_at).toLocaleString()}</small>
  </div>
  <span class="badge bg-success">${a.status}</span>
</li>
            `,
            )
            .join('')
        : '<li class="list-group-item">No activity</li>'
    }
  </ul>
  `;

  // 🔥 Reset to first tab every time
  const firstTab = new bootstrap.Tab(document.getElementById('profile-tab-btn'));
  firstTab.show();

  // 🔥 Show modal
  const modal = new bootstrap.Modal(document.getElementById('viewUserModal'));
  modal.show();
}

async function openSupplierProfile(id) {
  try {
    const res = await fetch(`/admin/supplier/supplier-data/modal-data/${id}`);
    const data = await res.json();

    // 🔴 Hide unwanted tabs
    document.getElementById('orders-tab-btn').style.display = 'none';
    document.getElementById('activity-tab-btn').style.display = 'none';

    // 🔴 Force Profile tab active
    new bootstrap.Tab(document.querySelector('#profile-tab-btn')).show();

    document.querySelector('#viewUserModal .modal-title').textContent = data.business_name;
    // 🔴 Render LIMITED info
    document.getElementById('profile-content').innerHTML = `
  <div class="supplier-profile">

    <div class="profile-left">
      <div class="profile-card">
        <p><span><i class="bi bi-building"></i> Company</span>${data.business_name || '-'}</p>
        <p><span><i class="bi bi-envelope"></i> Email</span>${data.email || '-'}</p>
        <p><span>Status</span>
          <span class="status-badge ${data.verification_status}">
            ${data.verification_status || '-'}
          </span>
        </p>
      </div>
    </div>

    <div class="profile-right">
      <div class="profile-card">
        <p><span>Phone</span>${data.mobile_no || '-'}</p>
        <p><span>Products</span>${data.stats?.total_products || 0}</p>
        <p><span>Orders</span>${data.stats?.total_orders || 0}</p>
        <p><span>Earnings</span>
          <span class="earning"> $ ${data.stats?.total_earnings || 0}</span>
        </p>
      </div>
    </div>

  </div>
`;
    new bootstrap.Modal(document.getElementById('viewUserModal')).show();
  } catch (err) {
    console.error(err);
  }
}
document.addEventListener('click', async (e) => {
  e.stopPropagation();
  const btn = e.target.closest('.view');
  if (!btn) return;

  const supplierId = btn.getAttribute('data-supplierId');
  const userId = btn.getAttribute('data-userId');

  // 🚫 HARD STOP
  if (!supplierId && !userId) return;

  if (supplierId) {
    openSupplierProfile(supplierId);
    return;
  }

  if (userId) {
    try {
      const res = await fetch(`/admin/user/users-data/modal-data/${userId}`);
      const user = await res.json();
      openUserModal(user);
    } catch (err) {
      console.error(err);
    }
  }
});
