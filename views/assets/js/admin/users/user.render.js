import { userState } from './user.state.js';
// All Users

function renderUsers(users) {
  const tbody = document.querySelector('#all-users tbody');
  tbody.innerHTML = '';

  users.forEach((user, index) => {
    const initials = user.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const roleBadge =
      user.role === 'customer'
        ? '<span class="badge bg-primary">Buyer</span>'
        : '<span class="badge bg-warning">Supplier</span>';

    const statusBadge =
      user.status === 'active'
        ? '<span class="status-badge active">Active</span>'
        : user.status === 'suspended'
          ? '<span class="status-badge suspended">Suspended</span>'
          : '<span class="status-badge pending">Pending</span>';

    const row = `
      <tr onclick="goToUser('${user.role}',${user.id})">
        <td>#${user.id}</td>
        <td><div class="d-flex align-items-center">
          <div class="user-avatar me-1" style="width:30px;height:30px;font-size:12px">
            ${initials}
          </div>
          ${user.name}
        </div></td>
        <td>${user.email}</td>
        <td>${roleBadge}</td>
        <td>${user.registrationDate?.split('T')[0]}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Buyers

function renderBuyers(users) {
  const tbody = document.getElementById('buyers-body');
  tbody.innerHTML = '';

  users.forEach((user) => {
    const initials = user.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const button =
      user.status === 'active'
        ? `<button class="btn btn-warning btn-sm suspend-btn"  data-id="${user.id}">Suspend</button>`
        : user.status === 'pending'
          ? `<button class="btn btn-primary btn-sm approve-btn"  data-id="${user.id}">Approve</button>`
          : `<button class="btn btn-success btn-sm activate-btn"  data-id="${user.id}">Active</button>`;

    const statusBadge =
      user.status === 'active'
        ? '<span class="status-badge active">Active</span>'
        : user.status === 'suspended'
          ? '<span class="status-badge suspended">Suspended</span>'
          : '<span class="status-badge pending">Pending</span>';

    tbody.innerHTML += `
      <tr>
        <td>#${user.id}</td>
        <td><div class="d-flex align-items-center">
          <div class="user-avatar me-1" style="width:30px;height:30px;font-size:12px">
            ${initials}
          </div>
          ${user.name}
        </div></td>
        <td>${user.email}</td>
        <td>${user.totalOrders || 0}</td>
        <td>$${user.totalSpent || 0}</td>
        <td>
          ${statusBadge}
        </td>
        <td>
          <did class="action-buttons">
          <button class="btn-icon view" title="View" id="user-info-modal" data-id="${user.id}">
            <i class="bi bi-eye"></i>
          </button>
          ${button}
          </div>
        </td>
      </tr>
    `;
  });
}

// Suppliers

function renderSuppliers(suppliers) {
  const tbody = document.querySelector('#suppliers-body');
  tbody.innerHTML = '';

  if (!suppliers || suppliers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No suppliers found</td>
      </tr>
    `;
    return;
  }

  suppliers.forEach((supplier) => {
    const statusBadge =
      supplier.status === 'active'
        ? '<span class="status-badge active">Active</span>'
        : supplier.status === 'suspended'
          ? '<span class="status-badge suspended">Suspended</span>'
          : '<span class="status-badge pending">Pending</span>';
    const initials = supplier.company
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const rating = supplier.avgRating || 0;

    tbody.innerHTML += `
      <tr>
        <td>#${supplier.id}</td>
        <td><div class="d-flex align-items-center">
          <div class="user-avatar me-1" style="width:30px;height:30px;font-size:12px">
            ${initials}
          </div>
          ${supplier.company || '-'}
        </div></td>
        <td>${supplier.contact || '-'}</td>
        <td>${supplier.totalProducts || 0}</td>
        <td>${rating}★</td>
        <td>${statusBadge}</td>
        <td>
        <did class="action-buttons">
          <button class="btn-icon view" title="View">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-warning btn-sm">Suspend</button>
          </div>
        </td>
      </tr>
    `;
  });
}

// Pending

function renderPendingSuppliers(suppliers) {
  const tbody = document.querySelector('#pending-body'); // ⚠️ IMPORTANT ID
  tbody.innerHTML = '';

  if (!suppliers || suppliers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No pending suppliers</td>
      </tr>
    `;
    return;
  }

  suppliers.forEach((supplier) => {
    const initials = (supplier.company || supplier.name || '-')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const documents = supplier.documents
      ? supplier.documents
          .split('|')
          .map((doc) => `<span class="badge bg-warning me-1">${doc.trim()}</span>`)
          .join('')
      : `<span class="badge bg-success">Not Required</span>`;

    tbody.innerHTML += `
      <tr>
        <td>#${supplier.id}</td>

        <td>
          <div class="d-flex align-items-center">
            <div class="user-avatar me-1" style="width:30px;height:30px;font-size:12px">
              ${initials}
            </div>
            ${supplier.company || supplier.name || '-'}
          </div>
        </td>

        <td>
          <span class="badge bg-warning">Supplier</span>
        </td>

        <td>${supplier.registration_date?.split('T')[0]}</td>

        <td>${documents}</td>

        <td>
          <div class="action-buttons">
            <button class="btn btn-success btn-sm approve-btn" data-id="${supplier.id}">
              Approve
            </button>

            <button class="btn btn-danger btn-sm reject-btn" data-id="${supplier.id}">
              Reject
            </button>

            <button class="btn btn-info btn-sm">
              <i class="bi bi-file-text"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

// Suspended

function renderSuspended(users) {
  const tbody = document.querySelector('#suspended-body');
  tbody.innerHTML = '';

  if (!users.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No suspended users</td>
      </tr>
    `;
    return;
  }

  users.forEach((user) => {
    const roleBadge =
      user.role === 'customer'
        ? '<span class="badge bg-primary">Buyer</span>'
        : '<span class="badge bg-warning">Supplier</span>';

    tbody.innerHTML += `
      <tr>
        <td>#${user.id}</td>
        <td>${user.name}</td>
        <td>${roleBadge}</td>
        <td>${user.suspended_on?.split('T')[0]}</td>
        <td>${user.suspend_reason || '-'}</td>
        <td>
          <button class="btn btn-success btn-sm">Activate</button>
          <button class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Pagination

function renderPagination(totalPages) {
  const container =
    userState.role === 'customer'
      ? document.getElementById('buyers-pagination')
      : userState.role === 'supplier'
        ? document.getElementById('suppliers-pagination')
        : userState.role === 'pending'
          ? document.getElementById('pending-pagination')
          : userState.role === 'suspended'
            ? document.getElementById('suspend-pagination')
            : document.getElementById('pagination');
  container.innerHTML = '';

  let pages = [];

  // Always include first page
  pages.push(1);
  const currentPage = userState.page;

  // Pages around current
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Always include last page
  if (totalPages > 1) pages.push(totalPages);

  // Remove duplicates & sort
  pages = [...new Set(pages)].sort((a, b) => a - b);

  // Previous button
  container.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page = "${currentPage - 1}">Previous</a>
    </li>
  `;

  let prevPage = 0;

  pages.forEach((page) => {
    // Add "..." if gap exists
    if (page - prevPage > 1) {
      container.innerHTML += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }

    container.innerHTML += `
      <li class="page-item ${page === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${page}">${page}</a>
      </li>
    `;

    prevPage = page;
  });

  // Next button
  container.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page = "${currentPage + 1}">Next</a>
    </li>
  `;
}

function updateUserCount(currentPage, totalUsers, limit = 5) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalUsers);

  let label = 'users';
  let container = null;

  if (userState.role === 'customer') {
    label = 'buyers';
    container = document.querySelector('.pagination-info-buyers');
  } else if (userState.role === 'supplier') {
    label = 'suppliers';
    container = document.querySelector('.pagination-info-suppliers ');
  } else if (userState.role === 'pending') {
    label = 'pending suppliers';
    container = document.querySelector('.pagination-info-pending');
  } else if (userState.role === 'suspended') {
    label = 'suspended users';
    container = document.querySelector('.pagination-info-suspended');
  } else {
    label = 'users';
    container = document.querySelector('.pagination-info-all-users');
  }

  if (!container) return; // safety

  const text = `Showing ${start} to ${end} of ${totalUsers} ${label}`;
  container.textContent = text;
}

export {
  renderUsers,
  renderBuyers,
  renderSuppliers,
  renderPendingSuppliers,
  renderSuspended,
  renderPagination,
  updateUserCount,
};
