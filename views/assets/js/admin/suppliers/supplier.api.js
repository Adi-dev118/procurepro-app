import { supplierState } from './supplier.state.js';
import { renderSuppliers, renderPagination , updateSupplierCount} from './supplie.render.js';
export async function fetchSuppliers() {
  const query = new URLSearchParams({
    page: supplierState.page,
    search: supplierState.search,
    status: supplierState.status,
  });

  const res = await fetch(`/admin/supplier/supplier-data?${query}`);
  const data = await res.json();

  supplierState.page = data.currentPage;

  renderSuppliers(data.suppliers);
  renderPagination(data.totalPages);
  updateSupplierCount(data.currentPage, data.total)
}