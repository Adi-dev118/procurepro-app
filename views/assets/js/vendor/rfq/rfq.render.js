import { rfqState } from './rfq.state.js';

export function renderRFQs(data, status) {
  const activeCardsContainer = document.getElementById('active-rfq-cards-container');
  const submittedBody = document.getElementById('submitted-table-body');
  const wonBody = document.getElementById('won-table-body');
  const lostBody = document.getElementById('lost-table-body');
  const expiredCardsContainer = document.getElementById('expired-rfq-cards-container');
  // clear all
  if (activeCardsContainer) activeCardsContainer.innerHTML = '';
  if (submittedBody) submittedBody.innerHTML = '';
  if (wonBody) wonBody.innerHTML = '';
  if (lostBody) lostBody.innerHTML = '';
  if (expiredCardsContainer) expiredCardsContainer.innerHTML = '';

  // 🔵 ACTIVE → CARDS
  if (status === 'active' || status === 'expired') {
    let html = '';
    if (!data.length) {
      html = `
      <div class="text-center py-5 text-muted">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        <p>No RFQs available</p>
      </div>
    `;
    } else {
      data.forEach((rfq) => {
        html += `
        <div class="vendor-rfq-card mb-3">
          <h5>${rfq.title}</h5>

          <p class="text-muted">
            <i class="bi bi-clock"></i>
            Deadline: ${new Date(rfq.deadline).toDateString()}
          </p>

          <p>${rfq.description || ''}</p>

          <div class="d-flex gap-2">
          <button 
  class="btn btn-primary btn-sm submit-quote-btn"
  data-rfq-id="${rfq.id}"
  data-bs-toggle="modal"
  data-bs-target="#submitQuoteModal"
>
  Submit Quote
</button>
          <button class="btn btn-outline-secondary btn-sm" ><a href="rfq/${rfq.id}">View Details</a></button>
          </div>
          </div>
          `;
      });
    }

    if (status === 'active') {
      activeCardsContainer.innerHTML = html;
    } else if (status === 'expired') {
      expiredCardsContainer.innerHTML = html;
    }
  }

  // 🟡 TABLE (submitted / won / lost)
  else {
    let html = '';
    if (!data.length) {
      html = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">
          <i class="bi bi-inbox me-2"></i>
          No quotes found
        </td>
      </tr>
    `;
    } else {
      data.forEach((q) => {
        html += `
        <tr>
          <td>#QT-${String(q.quote_id).padStart(3, '0')}</td>
          <td>${q.title}</td>
          <td>${new Date(q.created_at || q.submitted_date).toISOString().split('T')[0]}</td>
          <td>$${Number(q.price).toLocaleString()}</td>
          <td>${q.status}</td>
          <td>
            <button class="btn btn-outline-secondary btn-sm btn-sm view-quote-btn" data-quote-id="${q.quote_id}">
              <i class="bi bi-eye me-1"></i> View
            </button>
            </td>
        </tr>
      `;
      });
    }

    if (status === 'submitted') submittedBody.innerHTML = html;
    else if (status === 'won') wonBody.innerHTML = html;
    else if (status === 'lost') lostBody.innerHTML = html;
  }
}

export function viewQuote(data) {
  try {
    const q = data.quote;
    const statusEl = document.getElementById('viewStatus');

    statusEl.textContent = q.status;

    statusEl.className =
      'quote-status ' +
      (q.status === 'accepted'
        ? 'status-accepted'
        : q.status === 'rejected'
          ? 'status-rejected'
          : q.status === 'submitted'
            ? 'status-submitted'
            : 'status-default');

    document.getElementById('viewRfqTitle').textContent = q.rfq_title;
    document.getElementById('viewPrice').textContent = q.price;
    document.getElementById('viewDelivery').textContent = q.delivery_days;
    document.getElementById('viewPayment').textContent = q.payment_terms;
    // document.getElementById('viewStatus').textContent = q.status;
    document.getElementById('viewMessage').textContent = q.message || '—';

    new bootstrap.Modal(document.getElementById('viewQuoteModal')).show();
  } catch (err) {
    alert(err.message);
  }
}
