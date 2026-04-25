import { activityState } from './activity.state.js';
import { fetchActivities } from './activity.api.js';

// const rows = document.querySelectorAll('.activity-row');
let visibleCount = 0;
/*
rows.forEach((row) => {
  const name = row.dataset.name || '';
  const log = row.dataset.log || '';
  const status = row.dataset.status || '';

  const matchSearch = !searchVal || name.includes(searchVal) || log.includes(searchVal);
  const matchStatus = !statusVal || status.includes(statusVal);

  if (matchSearch && matchStatus) {
    row.style.display = '';
    visibleCount++;
  } else {
    row.style.display = 'none';
  }
});
*/
function changePage(page) {
  if (page < 1) return;

  activityState.page = page;
  fetchActivities();
}

document.addEventListener('click', (e) => {
  const pageBtn = e.target.closest('.page-link');

  if (pageBtn && pageBtn.dataset.page) {
    e.preventDefault();

    const page = Number(pageBtn.dataset.page);

    changePage(page);
  }
});

document.getElementById('showingCount').textContent = visibleCount;

// Show empty state if nothing visible
const tbody = document.getElementById('activityTableBody');
const existingEmpty = tbody.querySelector('.client-empty');
if (visibleCount === 0) {
  if (!existingEmpty) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'client-empty';
    emptyRow.innerHTML = `
              <td colspan="6">
                <div class="empty-state">
                  <i class="bi bi-search"></i>
                  <p>No records match your filters.</p>
                </div>
              </td>
            `;
    tbody.appendChild(emptyRow);
  }
} else {
  if (existingEmpty) existingEmpty.remove();
}

// Init showing count
document.addEventListener('DOMContentLoaded', () => {
  fetchActivities();
});
