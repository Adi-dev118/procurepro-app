import { rfqState } from './rfq.state.js';
/* ---------- Helpers ---------- */
function fmtCurrency(val) {
  if (!val && val !== 0) return '—';
  return '₹' + Number(val).toLocaleString('en-IN');
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function statusBadge(status) {
  const map = {
    active: ['bg-primary', 'Active'],
    closed: ['bg-warning text-dark', 'closed'],
    expired: ['bg-danger', 'expired'],
  };
  const [cls, label] = map[status?.toLowerCase()] || ['bg-secondary', status || '—'];
  return `<span class="badge ${cls}">${label}</span>`;
}

function priorityBadge(priority) {
  const map = {
    high: 'badge bg-danger',
    medium: 'badge bg-warning text-dark',
    low: 'badge bg-success',
  };
  const cls = map[priority?.toLowerCase()] || 'badge bg-secondary';
  return `<span class="${cls} text-capitalize">${priority || '—'}</span>`;
}

function quoteStatusBadge(status) {
  const map = {
    accepted: 'badge bg-success',
    rejected: 'badge bg-danger',
    submitted: 'badge bg-primary',
    pending: 'badge bg-warning text-dark',
  };
  const cls = map[status?.toLowerCase()] || 'badge bg-secondary';
  return `<span class="${cls} text-capitalize">${status || '—'}</span>`;
}

function renderTable() {
  const start = (rfqState.currentPage - 1) * rfqState.limit;
  const page = rfqState.filteredRfqs.slice(start, start + rfqState.limit);
  const tbody = document.getElementById('rfq-body');

  if (rfqState.filteredRfqs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="text-center text-muted py-4">
            <i class="bi bi-inbox me-2"></i>No RFQs found</td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = page
    .map(
      (r) => `
          <tr>
            <td><span class="order-id-badge">RFQ-${String(r.id).padStart(4, '0')}</span></td>
          
            <td><span class="text-muted">${r.buyer}</span></td>
            <td class="order-amount">${fmtCurrency(r.budget_min)} – ${fmtCurrency(r.budget_max)}</td>
            <td>${r.quantity ?? '—'}</td>
            <td class="order-date">${fmtDate(r.deadline)}</td>
           
            <td>${statusBadge(r.status)}</td>
            <td>${priorityBadge(r.priority)}</td>
            <td>
              <span class="badge bg-light text-dark border" style="font-size:13px">
                <i class="bi bi-chat-square-text me-1"></i>${r.quote_count ?? 0}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1"
                      onclick="openRfqModal(${r.id})" title="View RFQ">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger"
                      onclick="cancelRfq(${r.id})" title="Cancel RFQ">
                <i class="bi bi-x-circle"></i>
              </button>
            </td>
          </tr>
        `,
    )
    .join('');

  renderPagination();
  updatePaginationInfo();
}

function renderItems(items) {
  const tbody = document.getElementById('modal-items-body');
  tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">
          <i class="bi bi-hourglass-split me-1"></i>Loading…</td></tr>`;
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No items found</td></tr>`;
    return;
  }
  tbody.innerHTML = items
    .map(
      (it, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${it.product_name}</strong></td>
              <td>${it.quantity}</td>
              <td class="text-muted">${it.specifications || '—'}</td>
            </tr>
          `,
    )
    .join('');
}

function renderQuotes(quotes) {
  const tbody = document.getElementById('modal-quotes-body');
  tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-3">
          <i class="bi bi-hourglass-split me-1"></i>Loading…</td></tr>`;
  tbody.innerHTML = quotes
    .map(
      (q) => `
            <tr>
              <td><span class="order-id-badge">Q-${String(q.id).padStart(3, '0')}</span></td>
              <td>SUP-${q.supplier_id}</td>
              <td class="order-amount">${fmtCurrency(q.price)}</td>
              <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                  title="${q.message}">${q.message || '—'}</td>
              <td>${q.delivery_days ?? '—'} days</td>
              <td>${q.warranty ?? '—'} yrs</td>
              <td class="text-muted" style="font-size:13px">${q.payment_terms || '—'}</td>
              <td>${quoteStatusBadge(q.status)}</td>
              <td class="order-date">${fmtDate(q.created_at)}</td>
            </tr>
          `,
    )
    .join('');
}

function renderSpecifications(specs) {
  const tbody = document.getElementById('modal-specs-body');
  tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">
          <i class="bi bi-hourglass-split me-1"></i>Loading…</td></tr>`;
  if (!confirm(`Cancel RFQ-${String(rfqId).padStart(4, '0')}? This cannot be undone.`)) return;
  tbody.innerHTML = specs
    .map(
      (s, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${s.spec_name}</strong></td>
              <td>${s.spec_value}</td>
            </tr>
          `,
    )
    .join('');
}
/* ---------- Pagination ---------- */
function renderPagination() {
  const total = Math.ceil(filteredRfqs.length / limit);
  const ul = document.getElementById('rfq-pagination');
  if (total <= 1) {
    ul.innerHTML = '';
    return;
  }

  let html = `<li class="page-item ${rfqState.currentPage === 1 ? 'disabled' : ''}">
          <button class="page-link" onclick="changePage(${rfqState.currentPage - 1})">‹</button></li>`;
  for (let i = 1; i <= total; i++) {
    html += `<li class="page-item ${i === rfqState.currentPage ? 'active' : ''}">
            <button class="page-link" onclick="changePage(${i})">${i}</button></li>`;
  }
  html += `<li class="page-item ${rfqState.currentPage === total ? 'disabled' : ''}">
          <button class="page-link" onclick="changePage(${rfqState.currentPage + 1})">›</button></li>`;
  ul.innerHTML = html;
}

function changePage(page) {
  const total = Math.ceil(filteredRfqs.length / limit);
  if (page < 1 || page > total) return;
  rfqState.currentPage = page;
  renderTable();
}

function updatePaginationInfo() {
  const start = (rfqState.currentPage - 1) * rfqState.limit + 1;
  const end = Math.min(rfqState.currentPage * rfqState.limit, filteredRfqs.length);
  document.getElementById('rfq-pagination-info').textContent =
    rfqState.filteredRfqs.length > 0
      ? `Showing ${start}–${end} of ${rfqState.filteredRfqs.length} RFQs`
      : 'No results';
}

export {
  renderTable,
  renderItems,
  renderQuotes,
  renderSpecifications,
  renderPagination,
  changePage,
  updatePaginationInfo,
};
