import { renderRecentOrders } from './dashboard.render.js';


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
