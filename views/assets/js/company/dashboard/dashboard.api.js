import { dashboardState } from './dashboard.state.js';
import { renderOrders, renderRFQs, renderStats } from './dashboard.render.js';

export async function fetchDashboard() {
  try {
    dashboardState.loading = true;

    const res = await fetch(`/company/api/v1/dashboard/recent-data`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard');
    }

    // render all sections
    renderOrders(data.orders);
    renderRFQs(data.rfqs);
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
  } finally {
    dashboardState.loading = false;
  }
}

export async function loadStats() {
  try {
    const res = await fetch('/company/api/v1/dashboard/stats');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }

    const stats = data.stats;
    renderStats(stats);
  } catch (error) {
    console.error('Product Stats Error:', error);
  }
}
