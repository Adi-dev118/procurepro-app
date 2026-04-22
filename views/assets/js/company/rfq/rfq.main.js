import { rfqState } from './rfq.state.js';
import { fetchRFQs } from './rfq.api.js';
import { renderRFQs } from './rfq.render.js';

/* ================= TAB SWITCH ================= */

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    // active class toggle
    document.querySelectorAll('.tab-btn')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    // update state
    rfqState.activeTab = btn.dataset.tab;

    // toggle sections
    document.querySelectorAll('[id^="tab-"]').forEach(el => {
      el.style.display = 'none';
    });

    document.getElementById(`tab-${rfqState.activeTab}`).style.display = 'block';

    // re-render
    renderRFQs();
  });
});

/* ================= ACCEPT BID ================= */

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.accept-bid-btn');
  if (!btn) return;

  const bidId = btn.dataset.bidId;

  try {
    await fetch(`/company/rfq/accept/${bidId}`, {
      method: 'POST'
    });

    // 🔥 refresh after accept
    fetchRFQs();

  } catch (err) {
    console.error('Accept bid error:', err);
  }
});

/* ================= INIT ================= */

document.addEventListener('DOMContentLoaded', () => {
  fetchRFQs();
});