import { disputeState } from "./dispute.state.js";

function getCurrentTableBody() {
  switch (disputeState.tab) {
    case 'open':
      return document.getElementById('open-body');
    case 'in_progress':
      return document.getElementById('progress-body');
    case 'resolved':
      return document.getElementById('resolved-body');
    default:
      return document.getElementById('all-body');
  }
}

function renderDisputes(disputes) {
  const tbody = getCurrentTableBody();

  if (!tbody) return;

  tbody.innerHTML = '';

  if (!disputes.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">No disputes found</td>
      </tr>
    `;
    return;
  }

  disputes.forEach((d) => {
    // 🔹 Type Badge
    let typeBadge = '';
    if (d.type === 'Counterfeit Item') {
      typeBadge = `<span class="badge bg-danger">Counterfeit Item</span>`;
    } else if (d.type === 'Item not Received') {
      typeBadge = `<span class="badge bg-success">Item not Received</span>`;
    } else if (d.type === 'Late Delivery') {
      typeBadge = `<span class="badge bg-primary">Late Delivery</span>`;
    }else if (d.type === 'Defective Product') {
      typeBadge = `<span class="badge bg-warning">Defective Product</span>`;
    } else {
      typeBadge = `<span class="badge bg-secondary">${d.type}</span>`;
    }

    // 🔹 Priority Badge
    let priorityBadge = '';
    if (d.priority === 'high') {
      priorityBadge = `<span class="badge bg-danger">High</span>`;
    } else if (d.priority === 'medium') {
      priorityBadge = `<span class="badge bg-warning">Medium</span>`;
    } else {
      priorityBadge = `<span class="badge bg-secondary">Low</span>`;
    }

    // 🔹 Status Badge
    let statusBadge = '';
    if (d.status === 'open') {
      statusBadge = `<span class="badge bg-primary">Open</span>`;
    } else if (d.status === 'in_progress') {
      statusBadge = `<span class="badge bg-warning text-dark">In Progress</span>`;
    } else if (d.status === 'resolved') {
      statusBadge = `<span class="badge bg-success">Resolved</span>`;
    } else {
      statusBadge = `<span class="badge bg-secondary">${d.status}</span>`;
    }

    tbody.innerHTML += `
      <tr>
        <td>
          <strong>#DSP-00${d.id}</strong>
          <div class="text-muted small">Click to view details</div>
        </td>

        <td>
          <strong>#ORD-00${d.order_id}</strong>
          <div class="text-muted small">${d.product_name || ''}</div>
        </td>

        <td>
          <div>
            <strong>Buyer:</strong> ${d.name}
          </div>
          <div class="text-muted small">
            <strong>Supplier:</strong> ${d.business_name}
          </div>
        </td>

        <td>${typeBadge}</td>

        <td>
          ${d.date}
          <div class="text-muted small">${d.time || ''}</div>
        </td>

        <td>${priorityBadge}</td>

        <td>${statusBadge}</td>

        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-info view" data-id="${d.id}">
              View
            </button>
            <button class="btn btn-sm btn-primary assign" data-id="${d.id}">
              Assign
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}


function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  let pages = [];

  // Always include first page
  pages.push(1);
  const currentPage = disputeState.page;

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

function updateDisputeCount(currentPage, totalDispues, limit = 5) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalDispues);

  let label = 'disputes';
  let container = null;
  container = document.querySelector('.pagination-info');

  if (!container) return; // safety

  const text = `Showing ${start} to ${end} of ${totalDispues} ${label}`;
  container.textContent = text;
}

export {renderDisputes, renderPagination, updateDisputeCount};