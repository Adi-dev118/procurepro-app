import { rfqState } from './rfq.state.js';
import { fetchRFQs } from './rfq.api.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchRFQs();
});

document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', (e) => {
    const id = e.target.id;

    if (id === 'active-rfqs-tab') rfqState.status = 'active';
    else if (id === 'submitted-quotes-tab') rfqState.status = 'submitted';
    else if (id === 'won-quotes-tab') rfqState.status = 'won';
    else if (id === 'lost-quotes-tab') rfqState.status = 'lost';
    else if (id === 'expired-tab') rfqState.status = 'expired';

    rfqState.page = 1;

    fetchRFQs();
  });
});
