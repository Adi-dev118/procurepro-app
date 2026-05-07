import { renderProfile, renderProducts, renderOrders } from './supplier.render.js';

function getSupplierIdFromUrl() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1];
}

export async function loadSupplierDetail() {
  const supplierId = getSupplierIdFromUrl();
  try {
    const res = await fetch(`/admin/supplier/supplier-data/modal-data/${supplierId}`);
    if (!res.ok) throw new Error('Failed to fetch supplier');
    const data = await res.json();

    document.getElementById('pageLoading').style.display = 'none';
    document.getElementById('supplierHero').style.display = 'flex';
    document.getElementById('detailTabs').style.display = 'block';

    renderProfile(data);
    renderProducts(data.products);
    renderOrders(data.orders, data.stats.total_earnings);

    document.title = `Admin Dashboard - ${data.business_name}`;
  } catch (err) {
    document.getElementById('pageLoading').innerHTML = `
            <div class="tab-error">
              <i class="bi bi-exclamation-circle" style="font-size:40px;display:block;margin-bottom:10px;"></i>
              <p>Failed to load supplier details. Please try again.</p>
              <a href="/admin/suppliers" class="btn btn-outline-primary mt-2">← Back to Suppliers</a>
            </div>
          `;
    console.error(err);
  }
}
