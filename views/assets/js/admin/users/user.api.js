import { userState } from './user.state.js';
import {
  renderUsers,
  renderBuyers,
  renderSuppliers,
  renderPendingSuppliers,
  renderPagination,
  updateUserCount,
} from './user.render.js';

async function fetchUsers() {
  const query = new URLSearchParams({
    page: userState.page,
    search: userState.search,
    status: userState.status,
    role: userState.filterRole || userState.role,
  });
  const res = await fetch(`/admin/user/users-data?${query}`);
  const data = await res.json();

  userState.page = data.currentPage;

  if (userState.role === 'customer') {
    renderBuyers(data.users);
    renderPagination(data.totalPages);
    updateUserCount(data.currentPage, data.totalUsers);
  } else {
    renderUsers(data.users);
    renderPagination(data.totalPages);
    updateUserCount(data.currentPage, data.totalUsers);
  }
}

async function fetchSuppliers() {
  const query = new URLSearchParams({
    page: userState.page,
    search: userState.search,
    status: userState.status,
    role: userState.filterRole,
  });

  const res = await fetch(`/admin/user/suppliers-data?${query}`);
  const data = await res.json();

  renderSuppliers(data.suppliers);
  renderPagination(data.totalPages);
  updateUserCount(data.currentPage, data.totalSuppliers);
}

async function fetchPendingSuppliers() {
  const query = new URLSearchParams({
    page: userState.page,
    search: userState.search,
  });

  const res = await fetch(`/admin/user/suppliers-pending?${query}`);
  const data = await res.json();

  renderPendingSuppliers(data.pendingSuppliers);
  renderPagination(data.totalPages);
  updateUserCount(data.currentPage, data.total);
}

export { fetchUsers, fetchSuppliers, fetchPendingSuppliers };
