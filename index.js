const fetchWithTimeOut = async (resource, options = {}) => {
    const { timeout = 5000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        return await fetch(resource, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(id);
    }
};

const displayNews = articles => {
    const newsContainer = document.getElementById('newsContainer');
    if (!articles?.length) {
        newsContainer.innerHTML = `<p class="text-center">No news found for this category.</p>`;
        return;
    }
    newsContainer.innerHTML = '';
    articles.forEach(({ urlToImage, title, description, url }) => {
        newsContainer.innerHTML += `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${urlToImage || 'https://via.placeholder.com/150'}" class="img-fluid rounded-start" loading="lazy" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${description || ''}</p>
                            <a href="${url}" target="_blank" class="btn btn-primary">Read more</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
};

const loadCategoryNews = async category => {
    try {
        const res = await fetch(`/api/news?category=${category}`);
        const data = await res.json();
        displayNews(data.articles);
    } catch (e) {
        console.error('Error fetching news:', e);
    }
};

const searchNews = async () => {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (!query) return;
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = `
        <h2 class="mb-4 text-center">Searching for:
            <span class="text-primary">"${query}"</span>
        </h2>
        <p class="text-center">Please wait...</p>
    `;
    try {
        const res = await fetchWithTimeOut(`/api/news?q=${encodeURIComponent(query)}`, { timeout: 5000 });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        newsContainer.innerHTML = `
            <h2 class="mb-4 text-center">Results for: 
                <span class="text-primary">"${query}"</span>
            </h2>
        `;
        displayNews(data.articles);
        input.value = "";
    } catch (e) {
        console.error('Error fetching news:', e);
        newsContainer.innerHTML = `
            <h2 class="mb-4 text-center text-danger">
              Oops! Could not fetch results for "${query}".  
              Please check your connection and try again.
            </h2>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadCategoryNews('general');
    document.querySelectorAll('.nav-link').forEach(link =>
        link.addEventListener('click', e => {
            e.preventDefault();
            loadCategoryNews(link.textContent.toLowerCase());
        })
    );
});

document.getElementById("searchInput").addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchNews();
    }
});
