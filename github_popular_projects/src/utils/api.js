function fetchPopularRepos(language, page = 1) {
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
