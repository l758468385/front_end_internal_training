const params = '?'

function getErrorMessage(message, username) {
    if (message === 'Not Found') {
        return `${username} doesn't exist`
    }
    return message
}

function getProfile(username) {
    return fetch(`https://api.github.com/users/${username}${params}`)
        .then((res) => res.json())
        .then((profile) => {
            if (profile.message) {
                throw new Error(getErrorMessage(profile.message, username))
            }

            return profile
        })
}

function getRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
        .then((res) => res.json())
        .then((repos) => {
            if (repos.message) {
                throw new Error(getErrorMessage(repos.message, username))
            }

            return repos
        })
}

function getStarCount(repos) {
    return repos.reduce((count, {stargazers_count}) => {
        return count + stargazers_count
    }, 0)
}

function calculateScore(followers, repos) {
    return (followers * 3) + getStarCount(repos)
}

function getUserData(username) {
    return Promise.all([
        getProfile(username),
        getRepos(username)
    ]).then(([profile, repos]) => ({
        profile,
        score: calculateScore(profile.followers, repos)
    }))
}

function sortPlayers(players) {
    return players.sort((a,b) => b.score - a.score)
}

export function battle(players) {
    return Promise.all([
        getUserData(players[0]),
        getUserData(players[1])
    ]).then((results) => sortPlayers(results))
}



export function fetchPopularRepos(language, page = 1) {
    const endpoint = `https://api.github.com/search/repositories?q=stars:>1 language:${language}&sort=stars&order=desc&type=Repositories&page=${page}&per_page=10`;

    return fetch(endpoint)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            if (!data.items) {
                throw new Error(data.message || 'No items found');
            }

            return data.items;
        });
}
