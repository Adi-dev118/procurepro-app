import { activityState } from './activity.state.js';



function renderAllActivities(activities, total) {
  
  const totalBody = document.getElementById('heroTotal');
  const tbody = document.getElementById('activityTableBody');
  totalBody.innerHTML = `${total}`
  if (!tbody) return;

  if (!activities.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <i class="bi bi-journal-x"></i>
            <p>No activity logs found.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = activities
    .map((act, idx) => {
      const status = (act.status || '').toLowerCase();

      let cls = 'info';
      if (status === 'success') cls = 'success';
      else if (status === 'failed' || status === 'error') cls = 'failed';
      else if (status === 'warning' || status === 'warn') cls = 'warning';

      const initials = (act.name || 'U')
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const date = new Date(act.timeStamp).toLocaleDateString('en-IN');
      const time = new Date(act.timeStamp).toLocaleTimeString('en-IN');

      return `
      <tr class="activity-row"
          data-name="${(act.name || '').toLowerCase()}"
          data-log="${(act.log || '').toLowerCase()}"
          data-status="${status}">

         <td>${(activityState.page - 1) * 10 + idx + 1}</td>

        <td>
          <div class="ts-cell">
            <span class="ts-date">${date}</span>
            <span class="ts-time">${time}</span>
          </div>
        </td>

        <td>
          <div class="user-cell">
            <div class="user-av">${initials}</div>
            <span class="user-name-text">${act.name || '—'}</span>
          </div>
        </td>

        <td>
          <span class="ip-cell">${act.address || '—'}</span>
        </td>

        <td>
          <span class="log-cell" title="${act.log || ''}">
            ${act.log || '—'}
          </span>
        </td>

        <td>
          <span class="s-badge ${cls}">
            ${act.status || '—'}
          </span>
        </td>
      </tr>
    `;
    })
    .join('');
}

function renderPagination(totalPages) {
  const container = document.getElementById('activity-pagination');
  const heroPage = document.getElementById('heroPage');
  container.innerHTML = '';
  heroPage.innerHTML = `${activityState.page}`;

  let pages = [];

  // Always include first page
  pages.push(1);
  const currentPage = activityState.page;

  // Pages around current
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Always include last page
  if (totalPages > 1) pages.push(totalPages);

  // Remove duplicates & sort
  pages = [...new Set(pages)].sort((a, b) => a - b);

  // Previous button
  container.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page = "${currentPage - 1}">Previous</a>
    </li>
  `;

  let prevPage = 0;

  pages.forEach((page) => {
    // Add "..." if gap exists
    if (page - prevPage > 1) {
      container.innerHTML += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }

    container.innerHTML += `
      <li class="page-item ${page === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${page}">${page}</a>
      </li>
    `;

    prevPage = page;
  });

  // Next button
  container.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page = "${currentPage + 1}">Next</a>
    </li>
  `;
}

function updateActivityCount(currentPage, totalactivites, limit = 5) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalactivites);

  let container = null;

 
    container = document.querySelector('.pagination-info-activity');

  if (!container) return; // safety
  const label = "activities"

  const text = `Showing ${start} to ${end} of ${totalactivites} ${label}`;
  container.textContent = text;
}

export { renderAllActivities, renderPagination, updateActivityCount };
