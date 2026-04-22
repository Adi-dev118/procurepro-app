import { rfqState } from './rfq.state.js';
import { renderRFQs } from './rfq.render.js';

export async function fetchRFQs() {
  try {
    const res = await fetch('/company/rfq/rfq-data');
    const data = await res.json();

    rfqState.data = data.rfqs || [];

    renderRFQs();

  } catch (err) {
    console.error('RFQ fetch error:', err);
  }
}