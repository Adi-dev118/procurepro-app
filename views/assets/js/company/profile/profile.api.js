export async function loadCurrentUser() {
  const res = await fetch('/company/api/v1/dashboard/cuurent-user');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data.user;
}
