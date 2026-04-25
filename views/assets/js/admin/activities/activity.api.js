import { activityState } from './activity.state.js';
import { renderAllActivities, renderPagination, updateActivityCount } from './activity.render.js';

async function fetchActivities() {
  const query = new URLSearchParams({
    page: activityState.page,
    search: activityState.search || '',
    status: activityState.status || '',
  });

  const res = await fetch(`/admin/user/users-data/activities-data?${query}`);
  const data = await res.json();

  console.log(data);
  activityState.page = data.currentPage;

  renderAllActivities(data.activities, data.total);
  renderPagination(data.totalPages);
  updateActivityCount(data.currentPage, data.total);
}

export { fetchActivities };
