import { fetchDashboard, loadStats } from './dashboard.api.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchDashboard();
  loadStats();
});
