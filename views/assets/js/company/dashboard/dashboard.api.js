import { dashboardState } from './dashboard.state.js';
import { renderOrders } from './dashboard.render.js';
import { renderRFQs } from './dashboard.render.js';

export async function fetchDashboard() {
  try {
    dashboardState.loading = true;

    const res = await fetch(`/company/dashboard/dashboard-data`);
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