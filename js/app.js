
class GitHub {
  async getUser(username) {
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    if (! profileRes.ok) throw new Error("User not found");
    const profile = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=5`);
    const repos = await reposRes.json();

    return { profile, repos };
  }
}

class UI {
  constructor() {
    this.profileDiv = document.getElementById("profile");
    this.reposDiv = document.getElementById("repos");
    this.spinner = document.getElementById("spinner");
    this.grass = document.getElementById("grass");
  }

  showSpinner() {
    this.spinner.classList.remove("hidden");
  }

  hideSpinner() {
    this.spinner.classList.add("hidden");
  }

  showProfile(user) {
    this.profileDiv.innerHTML = `
      <div class="profile-card">
        <div class="profile-left">
          <img src="${user.avatar_url}" alt="${user.login}" />
          <a href="${user.html_url}" target="_blank"><button>View Profile</button></a>
        </div>
        <div class="profile-right">
          <div class="badges">
            <span class="badge badge-blue">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-gray">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-green">Followers: ${user.followers}</span>
            <span class="badge badge-blue">Following: ${user.following}</span>
          </div>
          <table class="meta-info">
            <tr><td>Company: ${user.company || 'null'}</td></tr>
            <tr><td>Website/Blog: ${user.blog || 'null'}</td></tr>
            <tr><td>Location: ${user.location || 'null'}</td></tr>
            <tr><td>Member Since: ${new Date(user.created_at).toLocaleString()}</td></tr>
          </table>
        </div>
      </div>
    `;
    
    this.grass.src = `https://ghchart.rshah.org/${user.login}`;
    
  }

  showRepos(repos) {
    this.reposDiv.innerHTML = "<h3>Latest Repos</h3>";
    repos.forEach(repo => {
      this.reposDiv.innerHTML += `
        <div class="repo">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <div class="stats">
            <span class="badge badge-blue">Stars: ${repo.stargazers_count}</span>
            <span class="badge badge-gray">Watchers: ${repo.watchers_count}</span>
            <span class="badge badge-green">Forks: ${repo.forks}</span>
          </div>
        </div>
      `;
    });
  }

  showError(message) {
    this.profileDiv.innerHTML = `<p style="color:red;">${message}</p>`;
    this.reposDiv.innerHTML = "";
  }

  clear() {
    this.profileDiv.innerHTML = "";
    this.reposDiv.innerHTML = "";
    this.grass.src = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
	
  const github = new GitHub();
  const ui = new UI();
	  
	document.getElementById("usernameInput").addEventListener("keydown", async (e) => {
	  if (e.key === 'Enter') {
	    e.preventDefault(); // Æû submit ¹æÁö
	    const username = e.target.value.trim();
	    if (!username) return;

	    ui.clear();
	    ui.showSpinner();

	    try {
	      const { profile, repos } = await github.getUser(username);
	      ui.showProfile(profile);
	      ui.showRepos(repos);
	    } catch (err) {
	      ui.showError(err.message);
	    } finally {
	      ui.hideSpinner();
	    }
	  }
	});

});
