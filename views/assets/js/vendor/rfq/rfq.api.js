import { rfqState } from './rfq.state.js';
import { renderRFQs, viewQuote, renderRFQStats } from './rfq.render.js';

export async function fetchRFQs() {
  const query = new URLSearchParams({
    status: rfqState.status,
    page: rfqState.page,
  });

  const res = await fetch(`/vendor/api/v1/rfq/rfq-data?${query}`);
  const data = await res.json();

  renderRFQs(data.rfqs, rfqState.status);
}

export async function fetchQuotes(id) {
  const res = await fetch(`/api/v1/rfq/vendor/quotes/${id}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);
  viewQuote(data);
}

export async function loadRFQStats() {
  try {
    const res = await fetch('/vendor/api/v1/rfq/rfq-stats');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }

    const stats = data.stats;
    renderRFQStats(stats);
  } catch (error) {
    console.error('Product Stats Error:', error);
  }
}
