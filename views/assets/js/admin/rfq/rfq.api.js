import { rfqState } from './rfq.state.js';
import {
  renderTable,
  renderItems,
  renderQuotes,
  renderSpecifications,
  renderPagination,
  changePage,
  updatePaginationInfo,
} from './rfq.render.js';

async function loadRfqs() {
  try {
    const res = await fetch('/api/v1/admin/all-rfq-data');
    const data = await res.json();
    rfqState.allRfqs = data.rfqs || data || [];
    rfqState.filteredRfqs = [...rfqState.allRfqs];
    renderTable();
  } catch (err) {
    console.error('Error loading RFQs:', err);
    document.getElementById('rfq-body').innerHTML =
      `<tr><td colspan="11" class="text-center text-muted py-4">
               <i class="bi bi-exclamation-circle me-2"></i>Failed to load RFQs
             </td></tr>`;
  }
}

async function loadRfqItems(rfqId) {
  try {
    const res = await fetch(`/api/v1/admin/rfq/${rfqId}/items`);
    const items = await res.json();
    renderItems(items);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-3">Failed to load items</td></tr>`;
  }
}

async function loadRfqQuotes(rfqId) {
  try {
    const res = await fetch(`/api/v1/admin/rfq/${rfqId}/quotes`);
    const quotes = await res.json();
    if (!quotes.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No quotes yet</td></tr>`;
      return;
    }
    renderQuotes(quotes);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger py-3">Failed to load quotes</td></tr>`;
  }
}

async function loadRfqSpecs(rfqId) {
  try {
    const res = await fetch(`/api/v1/admin/rfq/${rfqId}/specifications`);
    const specs = await res.json();
    if (!specs.length) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-4">No specifications added</td></tr>`;
      return;
    }
    renderSpecifications(specs);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-3">Failed to load specifications</td></tr>`;
  }
}

export { loadRfqs, loadRfqItems, loadRfqQuotes, loadRfqSpecs };
