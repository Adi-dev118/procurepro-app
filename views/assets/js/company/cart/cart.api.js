// cart.api.js

import { cartState } from './cart.state.js';
import { renderCart } from './cart.render.js';

export async function fetchCart() {
  try {
    const query = new URLSearchParams({
      page: cartState.page,
    });

    const res = await fetch(`/api/v1/carts/get-items/?${query}`);
    const data = await res.json();

    renderCart(data.cart || []);
  } catch (error) {
    console.error('Fetch Cart Error:', error);
  }
}

// ===============================
// Increase Quantity
// ===============================
export async function increaseCartItem(productId) {
  try {
    const res = await fetch(`/api/v1/carts/increase-items/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    const data = await res.json();

    if (data.status === 'Success') {
      fetchCart();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Increase Item Error:', error);
  }
}

// ===============================
// Decrease Quantity
// ===============================
export async function decreaseCartItem(productId) {
  try {
    const res = await fetch(`/api/v1/carts/decrease-items/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    const data = await res.json();

    if (data.status === 'Success') {
      fetchCart();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Decrease Item Error:', error);
  }
}

// ===============================
// Delete Single Item
// ===============================
export async function deleteCartItem(productId) {
  try {
    const res = await fetch(`/api/v1/carts/remove-items/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
      }),
    });

    const data = await res.json();

    if (data.status === 'Success') {
      fetchCart();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Delete Item Error:', error);
  }
}

// ===============================
// Clear Entire Cart
// ===============================
export async function clearEntireCart() {
  try {
    const res = await fetch(`/api/v1/carts/clear-items/`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (data.status === 'Success') {
      fetchCart();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Clear Cart Error:', error);
  }
}