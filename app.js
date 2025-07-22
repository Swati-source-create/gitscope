// File: app.js

async function searchUser() {
  const username = document.getElementById("username").value.trim();
  const userInfo = document.getElementById("userInfo");
  const repoList = document.getElementById("repoList");
  const languageChartEl = document.getElementById("languageChart");

  userInfo.innerHTML = "";
  repoList.innerHTML = "";
  if (languageChartEl) languageChartEl.style.display = "none";

  if (!username) {
    alert("Please enter a GitHub username.");
    return;
  }

  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error("User not found");
    const userData = await userResponse.json();

    userInfo.innerHTML = `
      <img src="${userData.avatar_url}" alt="Avatar" class="rounded-circle" width="120">
      <h3 class="mt-3">${userData.name || userData.login}</h3>
      <p>${userData.bio || "No bio available."}</p>
      <p><strong>Repos:</strong> ${userData.public_repos} | <strong>Followers:</strong> ${userData.followers}</p>
      <a href="${userData.html_url}" target="_blank" class="btn btn-dark mt-2">View on GitHub</a>
    `;

    const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = await repoResponse.json();

    const languageCounts = {};
    repos.forEach(repo => {
      const lang = repo.language;
      if (lang) {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      }

      const card = document.createElement("div");
      card.className = "col-md-4 repo-card";
      card.innerHTML = `
        <h5>${repo.name}</h5>
        <p>${repo.description || "No description."}</p>
        <span class="badge bg-secondary">★ ${repo.stargazers_count}</span>
        <span class="badge bg-info text-dark">🍴 ${repo.forks_count}</span>
        <span class="badge bg-warning text-dark">🛠 ${repo.language || "N/A"}</span>
        <br><a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">View Repo</a>
      `;
      repoList.appendChild(card);
    });

    if (languageChartEl && Object.keys(languageCounts).length > 0) {
      languageChartEl.style.display = "block";
      const ctx = languageChartEl.getContext("2d");

      new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(languageCounts),
          datasets: [{
            data: Object.values(languageCounts),
            backgroundColor: [
              "#007bff", "#28a745", "#ffc107", "#dc3545", "#6610f2", "#20c997", "#6f42c1"
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            title: {
              display: true,
              text: "Languages Used Across Public Repositories"
            }
          }
        }
      });
    }
  } catch (error) {
    userInfo.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

