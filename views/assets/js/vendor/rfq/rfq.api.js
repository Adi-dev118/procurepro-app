import { rfqState } from './rfq.state.js';
import { renderRFQs } from './rfq.render.js';

export async function fetchRFQs() {
  const query = new URLSearchParams({
    status: rfqState.status,
    page: rfqState.page
  });

  const res = await fetch(`/vendor/rfq/rfq-data?${query}`);
  const data = await res.json();

  renderRFQs(data.rfqs, rfqState.status);
}