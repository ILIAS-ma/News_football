// Configuration de l'API
const API_BASE_URL = 'https://newsfootbackend-production.up.railway.app';

// Vérification de l'authentification
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
};

// Fonction de déconnexion
const logout = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
};

// Fonctions utilitaires
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const showLoading = (element) => {
    element.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
        </div>
    `;
};

const showError = (element, message) => {
    element.innerHTML = `
        <div class="error">
            <p>${message}</p>
        </div>
    `;
};

// Fonctions API
const fetchArticles = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/articles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            logout();
            return;
        }
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des articles');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

const fetchVideos = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/videos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            logout();
            return;
        }
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des vidéos');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

// Fonctions d'affichage
const displayArticles = (articles) => {
    const articlesContainer = document.querySelector('.articles-grid');
    
    if (!articles.length) {
        articlesContainer.innerHTML = '<p class="text-center">Aucun article disponible</p>';
        return;
    }

    articlesContainer.innerHTML = articles.map(article => {
        let imageUrl = '';
        if (article.image) {
            if (article.image.startsWith('http')) {
                imageUrl = article.image;
            } else {
                imageUrl = `https://newsfootbackend-production.up.railway.app/${article.image.startsWith('src/') ? article.image : 'src/' + article.image}`;
            }
        } else {
            imageUrl = 'https://via.placeholder.com/400x200?text=No+Image'; // image par défaut
        }
        return `
        <article class="article-card">
            <a href="article-detail.html?id=${article.id_article}" style="text-decoration: none; color: inherit;">
                <img 
                    src="${imageUrl}"
                    alt="${article.titre}"
                    class="article-image"
                >
                <div class="article-content">
                    <h2 class="article-title">${article.titre}</h2>
                    <div class="article-meta">
                        Par ${article.auteur_prenom} ${article.auteur_nom} • ${formatDate(article.date_creation)}
                    </div>
                    <p class="article-excerpt">${article.contenu.substring(0, 150)}...</p>
                    <span class="article-category">${article.categorie}</span>
                </div>
            </a>
        </article>
        `;
    }).join('');
};

// Fonction utilitaire pour obtenir une miniature YouTube robuste
const getYouTubeThumbnail = (videoId) => {
    // Liste des formats de miniatures à essayer
    const formats = [
        `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        `https://i.ytimg.com/vi/${videoId}/default.jpg`
    ];
    
    // Retourner un objet avec les URLs et une image de secours
    return {
        urls: formats,
        fallback: 'https://via.placeholder.com/480x360?text=Video+Thumbnail'
    };
};

const displayVideos = (videos) => {
    const videosContainer = document.querySelector('.videos-grid');
    
    if (!videos.length) {
        videosContainer.innerHTML = '<p class="text-center">Aucune vidéo disponible</p>';
        return;
    }

    videosContainer.innerHTML = videos.map(video => {
        const videoId = getYouTubeId(video.url_youtube);
        const thumbnails = getYouTubeThumbnail(videoId);
        
        return `
        <a href="video-detail.html?id=${video.id_video}" style="text-decoration:none;color:inherit;">
          <div class="video-card">
            <div class="video-thumbnail">
              <img 
                src="${thumbnails.urls[0]}"
                srcset="${thumbnails.urls.map((url, i) => `${url} ${i + 1}x`).join(', ')}"
                alt="${video.titre}"
                loading="lazy"
                onerror="this.onerror=null; this.src='${thumbnails.fallback}';"
              >
            </div>
            <div class="video-content">
              <h3 class="video-title">${video.titre}</h3>
              <p class="video-meta">
                Par ${video.auteur_prenom} ${video.auteur_nom} • ${formatDate(video.date_creation)}
              </p>
            </div>
          </div>
        </a>
    `}).join('');
};

// Fonction utilitaire pour extraire l'ID YouTube
const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Mise à jour de la navigation
const updateNavigation = () => {
    const adminLink = document.getElementById('adminLink');
    const logoutButton = document.getElementById('logoutButton');
    
    if (adminLink && logoutButton) {
        adminLink.style.display = 'inline-block';
        logoutButton.style.display = 'inline-block';
        
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
};

// Initialisation
const init = async () => {
    // Appeler checkAuth UNIQUEMENT sur les pages admin (par exemple, si body a la classe 'admin-page')
    if (document.body.classList.contains('admin-page')) {
        if (!checkAuth()) return;
        updateNavigation();
    }
    const articlesContainer = document.querySelector('.articles-grid');
    const videosContainer = document.querySelector('.videos-grid');

    try {
        // Chargement des articles
        showLoading(articlesContainer);
        const articles = await fetchArticles();
        displayArticles(articles);

        // Chargement des vidéos
        showLoading(videosContainer);
        const videos = await fetchVideos();
        displayVideos(videos);
    } catch (error) {
        showError(articlesContainer, 'Erreur lors du chargement des articles');
        showError(videosContainer, 'Erreur lors du chargement des vidéos');
    }
};

// Démarrer l'application
document.addEventListener('DOMContentLoaded', init); 