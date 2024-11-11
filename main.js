document.addEventListener('DOMContentLoaded', () => {
    fetch('Articles.json')
        .then(response => response.json())
        .then(data => {
            window.articles = data.articles;
            loadArticles(window.articles);
            displayMostPopularArticle();
            applySavedTheme();
        });

    document.getElementById('sort-options').addEventListener('change', sortArticles);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// function to Load articles into the DOM
function loadArticles(articles) {
    const container = document.getElementById('articles-container');
    container.innerHTML = '';
    articles.forEach(article => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';
        cardWrapper.innerHTML = `
            <div class="card h-100 d-flex flex-column">
                <div class="card-body flex-grow-1">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text"><small class="text-muted">${new Date(article.date).toLocaleDateString()} - ${article.category}</small></p>
                    <p class="card-text">${article.content.substring(0, 100)}...</p>
                    <button class="btn btn-primary mt-auto" onclick="openModal(${article.id})">Read More</button>
                    <p class="card-text mt-2"><small class="text-muted">${calculateReadingTime(article.wordCount)} mins read</small></p>
                    <p class="card-text"><small class="text-muted">Views: ${article.views}</small></p>
                </div>
            </div>
        `;
        container.appendChild(cardWrapper);
    });
}

//function to Display the most popular article
function displayMostPopularArticle() {
    const popularArticle = window.articles.reduce((max, article) => article.views > max.views ? article : max, window.articles[0]);
    const popularContainer = document.getElementById('most-popular-article');
    popularContainer.innerHTML = `
        <h5>${popularArticle.title}</h5>
        <p>${popularArticle.content.substring(0, 100)}...</p>
        <p><small class="text-muted">Views: ${popularArticle.views}</small></p>
        <button class="btn btn-primary" onclick="openModal(${popularArticle.id})">Read More</button>
    `;
}

// function to Calculate reading time based on 200 words per minute
function calculateReadingTime(wordCount) {
    return Math.ceil(wordCount / 200);
}

// function to Sort articles based on the selected option
function sortArticles() {
    const sortOption = document.getElementById('sort-options').value;
    if (sortOption === 'views') {
        window.articles.sort((a, b) => b.views - a.views);
    } else {
        window.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    loadArticles(window.articles);
}

// function to Toggle between light and dark mode and save preference to localStorage
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// function to Apply the saved theme from localStorage on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// function Open modal using Bootstrap modal
function openModal(articleId) {
    const article = window.articles.find(a => a.id === articleId);

    document.getElementById('articleModalLabel').textContent = article.title;
    document.querySelector('.modal-body').innerHTML = `
        <p><small>${new Date(article.date).toLocaleDateString()} - ${article.category}</small></p>
        <p>${article.content}</p>
        <p><small>Estimated reading time: ${calculateReadingTime(article.wordCount)} mins</small></p>
    `;

    $('#articleModal').modal('show');

    article.views += 1;
    loadArticles(window.articles);
    displayMostPopularArticle();
}

