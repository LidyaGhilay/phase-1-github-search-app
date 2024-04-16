const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) return;

  try {
    const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    displayUsers(data.items);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});

function displayUsers(users) {
  searchResults.innerHTML = '';

  users.forEach(user => {
    const userCard = document.createElement('div');
    userCard.classList.add('user-card');
    userCard.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login} avatar">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
    `;
    userCard.addEventListener('click', () => fetchUserRepos(user.login));
    searchResults.appendChild(userCard);
  });
}

async function fetchUserRepos(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const repos = await response.json();
    displayRepos(repos);
  } catch (error) {
    console.error('Error fetching repository data:', error);
  }
}

function displayRepos(repos) {
  searchResults.innerHTML = '';

  repos.forEach(repo => {
    const repoCard = document.createElement('div');
    repoCard.classList.add('repo-card');
    repoCard.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'No description'}</p>
      <a href="${repo.html_url}" target="_blank">View Repo</a>
    `;
    searchResults.appendChild(repoCard);
  });
}
