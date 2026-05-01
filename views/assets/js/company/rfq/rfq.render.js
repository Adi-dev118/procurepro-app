import { rfqState } from './rfq.state.js';

/* ================= HELPERS ================= */

function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ================= STAGE LOGIC ================= */

function getRFQStage(rfq) {
  const hasWinner =
    rfq.quotes && rfq.quotes.some((q) => q.status === 'accepted' || q.status === 'won');

  if (rfq.status === 'closed' || rfq.status === 'expired') {
    return hasWinner ? 'awarded' : 'pending';
  }

  if (rfq.status === 'active') return 'active';
  if (rfq.status === 'draft') return 'draft';

  return 'pending';
}

/* ================= MAIN RENDER ================= */

export function renderRFQs() {
  const activeEl = document.getElementById('tab-active');
  const pendingEl = document.getElementById('tab-pending');
  const closedEl = document.getElementById('tab-closed');

  activeEl.innerHTML = '';
  pendingEl.innerHTML = '';
  closedEl.innerHTML = '';

  if (!rfqState.data || rfqState.data.length === 0) {
    activeEl.innerHTML = emptyState();
    return;
  }

  let activeCount = 0;
  let pendingCount = 0;
  let closedCount = 0;

  rfqState.data.forEach((rfq) => {
    const stage = getRFQStage(rfq);

    /* ================= FIX: WINNER ONLY ================= */

    const isAwarded = stage === 'awarded';

    const winnerQuotes = rfq.quotes?.filter((q) => q.status === 'accepted' || q.status === 'won');

    const displayQuotes = isAwarded ? winnerQuotes : rfq.quotes || [];
    /* ================= RENDER BY STAGE ================= */

    if (stage === 'active') {
      activeCount++;

      activeEl.innerHTML += rfqCard(rfq, 'Open', 'open');
    } else if (stage === 'pending') {
      pendingCount++;

      pendingEl.innerHTML += rfqCard(rfq, 'Pending Review', 'awaiting');
    } else if (stage === 'awarded') {
      closedCount++;

      closedEl.innerHTML += rfqCard(rfq, 'Awarded', 'awarded');
    }
  });

  /* ================= COUNTS ================= */

  document.querySelector('[data-tab="active"] .tab-count').textContent = activeCount;
  document.querySelector('[data-tab="pending"] .tab-count').textContent = pendingCount;
  document.querySelector('[data-tab="closed"] .tab-count').textContent = closedCount;

  attachAcceptHandlers();
}

/* ================= CARD ================= */
function rfqCard(rfq, label, badgeClass) {
  return `
    <div class="rfq-card">

      <div class="rfq-card-header">

        <div>
          <div class="rfq-id">#RFQ-${rfq.id}</div>

          <div class="rfq-title">
            ${rfq.title} ${rfq.quantity ? `— ${rfq.quantity} Units` : ''}
          </div>

          <div class="rfq-meta">
            <span>${formatDate(rfq.deadline)}</span>
            <span>${rfq.bids_received || 0} bids</span>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="rfq-actions">
          <span class="badge ${badgeClass}">${label}</span>
          <button class="btn details-btn" onclick="window.location.href='/rfq/${rfq.id}'">Details</button>
        </div>

      </div>

      <div class="rfq-body">
        ${rfq.description ? `<p>${rfq.description}</p>` : ''}

        <div class="bids-title">
          Bids (${rfq.bids_received || 0})
        </div>

      </div>

    </div>
  `;
}
/* ================= ACCEPT ================= */

function attachAcceptHandlers() {
  document.querySelectorAll('.accept-bid-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const quoteId = btn.dataset.bidId;

      try {
        await fetch(`/api/rfq/accept/${quoteId}`, {
          method: 'POST',
        });

        // update local state
        rfqState.data.forEach((rfq) => {
          rfq.quotes?.forEach((q) => {
            if (q.id == quoteId) {
              q.status = 'accepted';
            } else {
              q.status = 'rejected';
            }
          });

          rfq.status = 'closed';
        });

        renderRFQs();
      } catch (err) {
        console.error(err);
      }
    });
  });
}

/* ================= EMPTY ================= */

function emptyState() {
  return `
    <div class="empty-state">
      <i class="bi bi-inbox"></i>
      <h5>No RFQs found</h5>
    </div>
  `;
}
