import { loadVendorStats, loadRecentOrders } from './dashboard.api.js';
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

initVendorStats();
