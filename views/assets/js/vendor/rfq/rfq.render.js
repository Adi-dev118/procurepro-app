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
          <button class="btn btn-primary btn-sm">Submit Quote</button>
          <button class="btn btn-outline-secondary btn-sm">View Details</button>
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
            <button class="btn btn-outline-secondary btn-sm">
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
