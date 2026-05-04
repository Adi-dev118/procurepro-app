import { rfqState } from './rfq.state.js';
import { loadRfqs, loadRfqItems, loadRfqQuotes, loadRfqSpecs } from './rfq.api.js';
import { renderTable } from './rfq.render.js';

function applyFilters() {
  const { status, deadline, search } = rfqState.activeFilters;
  const now = new Date();

  rfqState.filteredRfqs = rfqState.allRfqs.filter((r) => {
    if (status && r.status?.toLowerCase() !== status) return false;
    if (priority && r.priority?.toLowerCase() !== priority) return false;
    if (deadline) {
      const dl = new Date(r.deadline);
      if (deadline === 'expired' && dl >= now) return false;
      if (deadline === '7days' && (dl < now || dl > new Date(now.getTime() + 7 * 86400000)))
        return false;
      if (deadline === '30days' && (dl < now || dl > new Date(now.getTime() + 30 * 86400000)))
        return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.title?.toLowerCase().includes(q) &&
        !String(r.id).includes(q) &&
        !r.location?.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  currentPage = 1;
  renderTable();
}

async function openRfqModal(rfqId) {
  const rfq = rfqState.allRfqs.find((r) => r.id === rfqId);
  if (!rfq) return;

  // Populate Details tab
  document.getElementById('modal-rfq-id').textContent = `RFQ-${String(rfq.id).padStart(4, '0')}`;
  document.getElementById('modal-user-id').textContent = `UID-${rfq.user_id}`;
  document.getElementById('modal-location').textContent = rfq.location || '—';
  document.getElementById('modal-created-at').textContent = fmtDate(rfq.created_at);
  document.getElementById('modal-deadline').textContent = fmtDate(rfq.deadline);
  document.getElementById('modal-title').textContent = rfq.title;
  document.getElementById('modal-description').textContent = rfq.description || '—';
  document.getElementById('modal-budget-min').textContent = fmtCurrency(rfq.budget_min);
  document.getElementById('modal-budget-max').textContent = fmtCurrency(rfq.budget_max);
  document.getElementById('modal-quantity').textContent = rfq.quantity ?? '—';
  document.getElementById('modal-priority').innerHTML = priorityBadge(rfq.priority);
  document.getElementById('modal-status').innerHTML = statusBadge(rfq.status);

  // Store rfq id on cancel button
  document.getElementById('modal-cancel-rfq-btn').dataset.id = rfqId;

  // Modal title
  document.getElementById('viewRfqModalLabel').innerHTML =
    `<i class="bi bi-file-earmark-text me-2"></i>RFQ-${String(rfq.id).padStart(4, '0')} — ${rfq.title}`;

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('viewRfqModal'));
  modal.show();

  // Lazy-load items, quotes, specs
  loadRfqItems(rfqId);
  loadRfqQuotes(rfqId);
  loadRfqSpecs(rfqId);
}
/* Attach filter listeners */
document.querySelectorAll('.rfq-status-filter').forEach((el) =>
  el.addEventListener('click', (e) => {
    e.preventDefault();
    activeFilters.status = el.dataset.status;
    applyFilters();
  }),
);
document.querySelectorAll('.rfq-priority-filter').forEach((el) =>
  el.addEventListener('click', (e) => {
    e.preventDefault();
    activeFilters.priority = el.dataset.priority;
    applyFilters();
  }),
);
document.querySelectorAll('.rfq-deadline-filter').forEach((el) =>
  el.addEventListener('click', (e) => {
    e.preventDefault();
    activeFilters.deadline = el.dataset.range;
    applyFilters();
  }),
);

document.getElementById('rfq-search-btn').addEventListener('click', () => {
  activeFilters.search = document.getElementById('rfq-search-input').value.trim();
  applyFilters();
});
document.getElementById('rfq-search-input').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    activeFilters.search = e.target.value.trim();
    applyFilters();
  }
});

document.getElementById('rfq-clear-filters').addEventListener('click', () => {
  rfqState.activeFilters = { status: '', priority: '', deadline: '', search: '' };
  document.getElementById('rfq-search-input').value = '';
  rfqState.filteredRfqs = [...rfqState.allRfqs];
  rfqState.currentPage = 1;
  renderTable();
});

async function cancelRfq(rfqId) {
  try {
    const res = await fetch(`/api/v1/admin/rfqs/${rfqId}/cancel`, { method: 'PATCH' });
    if (res.ok) {
      const rfq = rfqState.allRfqs.find((r) => r.id === rfqId);
      if (rfq) rfq.status = 'cancelled';
      applyFilters();
    } else {
      alert('Failed to cancel RFQ. Please try again.');
    }
  } catch (e) {
    alert('Network error. Please try again.');
  }
}

document.getElementById('modal-cancel-rfq-btn').addEventListener('click', function () {
  const id = parseInt(this.dataset.id);
  if (id) cancelRfq(id);
});

/* ---------- Print ---------- */
document.getElementById('modal-print-btn').addEventListener('click', () => window.print());

/* ---------- Export ---------- */
document.getElementById('rfq-export-btn').addEventListener('click', () => {
  const rows = [
    [
      'RFQ ID',
      'Title',
      'Buyer ID',
      'Budget Min',
      'Budget Max',
      'Qty',
      'Deadline',
      'Location',
      'Priority',
      'Status',
    ],
  ];
  rfqState.filteredRfqs.forEach((r) =>
    rows.push([
      `RFQ-${String(r.id).padStart(4, '0')}`,
      `"${r.title}"`,
      `UID-${r.user_id}`,
      r.budget_min,
      r.budget_max,
      r.quantity,
      fmtDate(r.deadline),
      r.location,
      r.priority,
      r.status,
    ]),
  );
  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: 'rfqs_export.csv' });
  a.click();
  URL.revokeObjectURL(url);
});

// 🔹 INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
  loadRfqs();
  loadRfqItems();
  loadRfqQuotes();
  loadRfqSpecs();
});
