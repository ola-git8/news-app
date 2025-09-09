

function loadCategoryNews(category) {
    fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_key}`)
        .then(response => response.json())
        .then(data => {
            displayNews(data.articles);
        })
        .catch(error => console.error('Error fetching news:', error));
}

function searchNews() {
    const input = document.getElementById('searchInput'); 
    const query = input.value.trim(); 
    
    if (!query) return; // prevent empty search
    
    fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_key}`)
        .then(response => response.json())
        .then(data => {
            // Show search heading ✅
            const newsContainer = document.getElementById('newsContainer');
            newsContainer.innerHTML = `
                <h2 class="mb-4 text-center">Results for: <span class="text-primary">"${query}"</span></h2>
            `;

            displayNews(data.articles);

            input.value = ""; // clear input
        })
        .catch(error => console.error('Error fetching news:', error));
}


function displayNews(articles) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';

    if (!articles || articles.length === 0) {
    newsContainer.innerHTML = `<p class="text-center">No news found for this category.</p>`;
    return;
}

    
    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.className = 'card mb-3';
        newsCard.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" class="img-fluid rounded-start" loading="lazy" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description || ''}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>  
                    </div>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategoryNews('general');
    const categoryLinks = document.querySelectorAll('.nav-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.textContent.toLowerCase();
            loadCategoryNews(category);
        });
    });
});



document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchNews();
    }
});
