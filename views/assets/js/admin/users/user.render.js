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
        ? `<button class="btn btn-warning btn-sm suspend-btn" data-type="buyer" data-id="${user.id}">Suspend</button>`
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
          <button class="btn-icon view" title="View" id="user-info-modal" data-userId="${user.id}">
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
      supplier.status === 'approved'
        ? '<span class="status-badge active">Active</span>'
        : supplier.status === 'suspended'
          ? '<span class="status-badge suspended">Suspended</span>'
          : '<span class="status-badge pending">Pending</span>';
    const initials = supplier.company
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const button =
      supplier.status === 'approved'
        ? `<button class="btn btn-warning btn-sm suspend-btn" data-type="vendor" data-id="${supplier.supplierId}">Suspend</button>`
        : supplier.status === 'pending'
          ? `<button class="btn btn-primary btn-sm approve-btn" data-type="vendor" data-id="${supplier.supplierId}">Approve</button>`
          : `<button class="btn btn-success btn-sm activate-btn" data-type="vendor"
        data-id="${supplier.supplierId}">Active</button>`;

    const rating = supplier.avgRating || 0;

    tbody.innerHTML += `
      <tr>
        <td>#${supplier.supplierId}</td>
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
          <button class="btn-icon view" title="View" data-supplierId="${supplier.supplierId}" data-type="supplier">
            <i class="bi bi-eye"></i>
          ${button}
          </div>
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
  renderPagination,
  updateUserCount,
};
