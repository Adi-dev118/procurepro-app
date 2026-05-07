import { renderRecentOrders } from './profile.render.js';
export async function getCurrentUser() {
  const res = await fetch('/vendor/api/v1/profile-data');

  const data = await res.json();
  return data.profile;
}

export async function loadVendorStats() {
  const res = await fetch('/vendor/api/v1/dashboard/stats');
  const data = await res.json();
  return data.stats;
}

export async function loadRecentOrders() {
  try {
    const res = await fetch('/vendor/api/v1/dashboard/recent-order');

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    renderRecentOrders(data.orders);
  } catch (error) {
    console.error('Recent Orders Error:', error);
  }
}

export async function logoutUser() {
  const res = await fetch('/api/v1/users/logout', {
    method: 'POST',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Logout failed');
  }

  return data;
}
