function renderCategories(data) {
  const categorySelect = document.getElementById('rfqCategory');
  categorySelect.innerHTML = `
        <option value="">Select Category</option>
      `;

  data.categories.forEach((category) => {
    categorySelect.innerHTML += `
          <option value="${category.id}">
            ${category.name}
          </option>
        `;
  });
}

function renderProducts(data) {
  document.querySelectorAll('.rfq-item-product').forEach((select) => {
    select.innerHTML = `
          <option value="">Select Item</option>
        `;

    data.products.forEach((product) => {
      select.innerHTML += `
            <option value="${product.id}">
              ${product.name}
            </option>
          `;
    });
  });
}

export { renderCategories, renderProducts };
