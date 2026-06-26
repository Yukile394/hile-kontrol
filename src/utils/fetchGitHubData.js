export async function fetchGitHubData(username) {
  const headers = { Accept: "application/vnd.github.v3+json" };

  const [reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
  ]);

  if (!reposRes.ok) {
    if (reposRes.status === 404) throw new Error("Kullanıcı bulunamadı");
    if (reposRes.status === 403) throw new Error("API limiti aşıldı, biraz bekle");
    throw new Error("GitHub erişim hatası");
  }

  const repos = await reposRes.json();
  const events = eventsRes.ok ? await eventsRes.json() : [];

  return { repos, events };
}
