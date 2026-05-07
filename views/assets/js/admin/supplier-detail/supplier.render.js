
function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}


function renderProfile(data) {
  // Hero
  document.getElementById('heroAvatar').textContent = getInitials(data.business_name);
  document.getElementById('heroName').textContent = data.business_name;
  document.getElementById('heroType').textContent = data.owner_name + ' · ' + data.email;
  document.getElementById('heroBizType').textContent = data.business_type;
  document.getElementById('heroVerified').textContent = '✓ ' + data.verification_status;
  document.getElementById('heroProducts').textContent = data.stats.total_products;
  document.getElementById('heroOrders').textContent = data.stats.total_orders;
  document.getElementById('heroEarnings').textContent = formatCurrency(data.stats.total_earnings);

  // Profile tab
  document.getElementById('profBusinessName').textContent = data.business_name;
  document.getElementById('profOwnerName').textContent = data.owner_name;
  document.getElementById('profEmail').textContent = data.email;
  document.getElementById('profMobile').textContent = data.mobile_no;
  document.getElementById('profBizType').textContent = data.business_type;
  document.getElementById('profRegistration').textContent = data.business_registration;
  document.getElementById('profDescription').textContent = data.description;

  // Verification badge
  const vEl = document.getElementById('profVerification');
  const vStatus = data.verification_status;
  vEl.innerHTML = `<span class="v-status ${vStatus}">${vStatus.charAt(0).toUpperCase() + vStatus.slice(1)}</span>`;

  // Address
  const addr = data.address;
  const addrEl = document.getElementById('profAddress');
  addrEl.innerHTML = `
          <strong>Business Address</strong>
          ${addr.address_line1}${addr.address_line2 ? ', ' + addr.address_line2 : ''}<br>
          ${addr.city}, ${addr.state} — ${addr.pincode}<br>
          ${addr.country}
        `;

  // Stats
  document.getElementById('statProducts').textContent = data.stats.total_products;
  document.getElementById('statOrders').textContent = data.stats.total_orders;
  document.getElementById('statEarnings').textContent = formatCurrency(data.stats.total_earnings);
}

function renderProducts(products) {
  document.getElementById('productsCount').textContent = products.length;
  const grid = document.getElementById('productsGrid');
  if (!products.length) {
    grid.innerHTML =
      '<p class="text-muted text-center py-5">No products found for this supplier.</p>';
    return;
  }
  grid.innerHTML = products
    .map(
      (p) => `
          <div class="product-card">
            <div class="product-id">Product #${p.id}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-details">
              <div class="product-price">
                ${formatCurrency(p.final_price)}
                <span>Final Price</span>
              </div>
              <div class="product-stock">
                <div class="stock-count">${p.stock}</div>
                <div class="stock-label">In Stock</div>
              </div>
            </div>
          </div>
        `,
    )
    .join('');
}

function renderOrders(orders, totalEarnings) {
  document.getElementById('ordersCount').textContent = orders.length;
  document.getElementById('totalEarnings').textContent = formatCurrency(totalEarnings);

  const tbody = document.getElementById('ordersTableBody');
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No orders found.</td></tr>`;
    return;
  }
  tbody.innerHTML = orders
    .map(
      (o) => `
          <tr>
            <td><span class="order-id-badge">#${o.id}</span></td>
            <td><span class="order-amount">${formatCurrency(o.amount)}</span></td>
            <td><span class="order-status ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
            <td><span class="order-date"><i class="bi bi-calendar3 me-1"></i>${formatDate(o.created_at)}</span></td>
          </tr>
        `,
    )
    .join('');
}

export {renderProfile, renderProducts , renderOrders}