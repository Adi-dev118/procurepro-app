import { userState } from './user.state.js';

import { activityState } from '../activities/activity.state.js';

import {
  renderUsers,
  renderBuyers,
  renderSuppliers,
  renderActivities,
  renderUserStats,
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
async function loadUserStats() {
  try {
    const res = await fetch('/api/v1/admin/users-stats'); // your endpoint
    const data = await res.json();
    console.log(data)

    renderUserStats(data.stats);

  } catch (err) {
    console.error('User stats error:', err);
  }
}

async function fetchRecentActivities() {
  const res = await fetch('/admin/user/users-data/recent-activities');
  const data = await res.json();

  renderActivities(data.activities);
}

export { fetchUsers, fetchSuppliers, loadUserStats, fetchRecentActivities };
