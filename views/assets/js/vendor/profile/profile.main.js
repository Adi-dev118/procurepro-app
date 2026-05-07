import { getCurrentUser, loadVendorStats, loadRecentOrders } from './profile.api.js';
import { renderProfileDropdown, initProfileDropdown } from './profile.render.js';
async function initNavbar() {
  const user = await getCurrentUser();

  const container = document.getElementById('navbarProfileContainer');
  const name = document.querySelectorAll('.vendor-name');

  name.forEach((n) => (n.innerHTML = `${user.name}`));
  container.innerHTML = renderProfileDropdown(user);
  initProfileDropdown();
}

async function initVendorStats() {
  const stats = await loadVendorStats();

  document.getElementById('total-earned').textContent = `$ ${Number(
    stats.totalEarned,
  ).toLocaleString()}`;
  document.getElementById('total-order').textContent = stats.totalOrders;
  document.getElementById('total-product').textContent = stats.totalProducts;
  document.getElementById('total-customer').textContent = stats.totalCustomers;
  document.getElementById('avg-rating').textContent = `${stats.avgRating} ★`;
  document.getElementById('pending-payout').textContent = `$ ${Number(
    stats.pendingPayout,
  ).toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', loadRecentOrders);
initNavbar();
initVendorStats();
