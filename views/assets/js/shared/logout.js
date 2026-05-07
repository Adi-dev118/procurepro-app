const signOut = document.getElementById('signoutButton');
async function handleLogout(e) {
  e.preventDefault();
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Logout failed');
      return;
    }
    window.location.href = '/signup';
  } catch (error) {
    console.error(error);
  }
}
if (signOut) {
  signOut.addEventListener('click', handleLogout);
}
