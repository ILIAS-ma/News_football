// Configuration de l'API
const API_BASE_URL = 'https://newsfootbackend-production.up.railway.app';

// Éléments du DOM
const modal = document.getElementById('articleModal');
const modalTitle = document.getElementById('modalTitle');
const articleForm = document.getElementById('articleForm');
const articlesTableBody = document.getElementById('articlesTableBody');
const loadingOverlay = document.getElementById('loadingOverlay');
const logoutButton = document.getElementById('logoutButton');

// --- Variables pour la modale vidéo ---
const videoModal = document.getElementById('videoModal');
const videoModalTitle = document.getElementById('videoModalTitle');
const videoForm = document.getElementById('videoForm');
const videosTableBody = document.getElementById('videosTableBody');

// Fonctions pour la gestion des auteurs
let authors = [];

async function loadAuthors() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auteurs`);
        authors = await response.json();
        displayAuthors();
        updateAuthorSelects();
    } catch (error) {
        console.error('Erreur lors du chargement des auteurs:', error);
    }
}

function displayAuthors() {
    const tbody = document.getElementById('authorsTableBody');
    if (!tbody) return;

    tbody.innerHTML = authors.map(author => `
        <tr>
            <td>${author.prenom || ''}</td>
            <td>${author.nom || ''}</td>
            <td class="action-buttons">
                <button class="edit-button" onclick="editAuthor('${author.id_auteur}')">Modifier</button>
                <button class="delete-button" onclick="deleteAuthor('${author.id_auteur}')">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

function updateAuthorSelects() {
    const authorSelects = document.querySelectorAll('#author, #videoAuthor');
    authorSelects.forEach(select => {
        if (select) {
            select.innerHTML = authors.map(author => 
                `<option value="${author.id_auteur}">${author.prenom} ${author.nom}</option>`
            ).join('');
        }
    });
}

function openAuthorModal(authorId = null) {
    const modal = document.getElementById('authorModal');
    const form = document.getElementById('authorForm');
    const title = document.getElementById('authorModalTitle');

    if (authorId) {
        const author = authors.find(a => a.id_auteur === authorId);
        if (author) {
            title.textContent = 'Modifier un auteur';
            document.getElementById('authorId').value = author.id_auteur;
            document.getElementById('authorPrenom').value = author.prenom || '';
            document.getElementById('authorNom').value = author.nom || '';
        }
    } else {
        title.textContent = 'Ajouter un auteur';
        form.reset();
        document.getElementById('authorId').value = '';
    }

    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeAuthorModal() {
    const modal = document.getElementById('authorModal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

async function saveAuthor(event) {
    event.preventDefault();
    const form = event.target;
    const authorId = document.getElementById('authorId').value;
    const authorData = {
        prenom: document.getElementById('authorPrenom').value,
        nom: document.getElementById('authorNom').value
    };

    try {
        const url = authorId 
            ? `${API_BASE_URL}/api/auteurs/${authorId}`
            : `${API_BASE_URL}/api/auteurs`;
        
        const method = authorId ? 'PUT' : 'POST';
        const token = localStorage.getItem('token');
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(authorData)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Erreur lors de la sauvegarde');
        }

        await loadAuthors();
        closeAuthorModal();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la sauvegarde de l\'auteur : ' + (error.message || error));
    }
}

async function deleteAuthor(authorId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet auteur ?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/auteurs/${authorId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');

        await loadAuthors();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'auteur');
    }
}

function editAuthor(authorId) {
    openAuthorModal(authorId);
}

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

// Gestionnaire de déconnexion
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Fonctions utilitaires
const showLoading = () => {
    loadingOverlay.style.display = 'flex';
};

const hideLoading = () => {
    loadingOverlay.style.display = 'none';
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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

const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des catégories');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

const fetchAuthors = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/auteurs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des auteurs');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

const createArticle = async (formData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/articles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la création de l\'article');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

const updateArticle = async (id, formData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de l\'article');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

const deleteArticle = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'article');
        }
        
        return true;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

// Fonctions d'affichage
const displayArticles = (articles) => {
    articlesTableBody.innerHTML = articles.map(article => `
        <tr>
            <td>${article.titre}</td>
            <td>${article.categorie}</td>
            <td>${article.auteur_prenom} ${article.auteur_nom}</td>
            <td>${formatDate(article.date_creation)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-button" onclick="editArticle(${article.id_article})">
                        Modifier
                    </button>
                    <button class="delete-button" onclick="confirmDelete(${article.id_article})">
                        Supprimer
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

const populateSelects = async () => {
    try {
        const [categories, authors] = await Promise.all([
            fetchCategories(),
            fetchAuthors()
        ]);

        const categorySelect = document.getElementById('category');
        const authorSelect = document.getElementById('author');

        categorySelect.innerHTML = categories.map(category => 
            `<option value="${category.id_categorie}">${category.nom}</option>`
        ).join('');

        authorSelect.innerHTML = authors.map(author => 
            `<option value="${author.id_auteur}">${author.prenom} ${author.nom}</option>`
        ).join('');
    } catch (error) {
        console.error('Erreur lors du chargement des listes:', error);
    }
};

// Gestion du modal
const openModal = (article = null) => {
    modalTitle.textContent = article ? 'Modifier l\'article' : 'Ajouter un article';
    articleForm.reset();
    document.getElementById('articleId').value = article ? article.id_article : '';
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.style.display = 'none';
    imagePreview.removeAttribute('data-image');
    document.getElementById('image').value = '';

    if (article) {
        document.getElementById('title').value = article.titre;
        document.getElementById('category').value = article.id_categorie;
        document.getElementById('author').value = article.id_auteur;
        document.getElementById('content').value = article.contenu;
        if (article.image) {
            imagePreview.src = `${API_BASE_URL}/src/${article.image}`;
            imagePreview.style.display = 'block';
            imagePreview.setAttribute('data-image', article.image);
        }
    }
    modal.style.display = 'block';
};

const closeModal = () => {
    modal.style.display = 'none';
    articleForm.reset();
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.style.display = 'none';
    imagePreview.removeAttribute('data-image');
};

// Gestion des événements
const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();
    try {
        const formData = new FormData();
        formData.append('titre', document.getElementById('title').value);
        formData.append('id_categorie', document.getElementById('category').value);
        formData.append('id_auteur', document.getElementById('author').value);
        formData.append('contenu', document.getElementById('content').value);

        const imageFile = document.getElementById('image').files[0];
        const articleId = document.getElementById('articleId').value;
        const imagePreview = document.getElementById('imagePreview');
        const imageAncienne = imagePreview.getAttribute('data-image');

        if (articleId) {
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (imageAncienne) {
                formData.append('imageAncienne', imageAncienne);
            }
            await updateArticle(articleId, formData);
        } else {
            if (imageFile) {
                formData.append('image', imageFile);
            }
            await createArticle(formData);
        }
        closeModal();
        await loadArticles();
    } catch (error) {
        alert('Une erreur est survenue lors de l\'enregistrement de l\'article');
    } finally {
        hideLoading();
    }
};

const editArticle = async (id) => {
    showLoading();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement de l\'article');
        }
        
        const article = await response.json();
        openModal(article);
    } catch (error) {
        alert('Une erreur est survenue lors du chargement de l\'article');
    } finally {
        hideLoading();
    }
};

const confirmDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        showLoading();
        try {
            await deleteArticle(id);
            await loadArticles();
        } catch (error) {
            alert('Une erreur est survenue lors de la suppression de l\'article');
        } finally {
            hideLoading();
        }
    }
};

const loadArticles = async () => {
    showLoading();
    try {
        const articles = await fetchArticles();
        displayArticles(articles);
    } catch (error) {
        articlesTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Une erreur est survenue lors du chargement des articles
                </td>
            </tr>
        `;
    } finally {
        hideLoading();
    }
};

// Prévisualisation de l'image à partir du fichier local
document.getElementById('image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const imagePreview = document.getElementById('imagePreview');
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Veuillez sélectionner une image au format JPG ou PNG.');
            e.target.value = '';
            imagePreview.style.display = 'none';
            imagePreview.removeAttribute('data-image');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            imagePreview.removeAttribute('data-image');
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        imagePreview.removeAttribute('data-image');
    }
});

// --- Ouvrir/Fermer la modale vidéo ---
function openVideoModal(video = null) {
    videoModalTitle.textContent = video ? "Modifier la vidéo" : "Ajouter une vidéo";
    videoForm.reset();
    document.getElementById('videoId').value = video ? video.id_video : '';
    document.getElementById('videoTitle').value = video ? video.titre : '';
    document.getElementById('videoCategory').value = video ? video.id_categorie : '';
    document.getElementById('videoAuthor').value = video ? video.id_auteur : '';
    document.getElementById('videoUrl').value = video ? video.url_youtube : '';
    document.getElementById('videoDescription').value = video ? video.description : '';
    videoModal.style.display = 'block';
}
function closeVideoModal() {
    videoModal.style.display = 'none';
    videoForm.reset();
}
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

// --- CRUD Vidéos ---
const fetchVideos = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des vidéos');
    return await response.json();
};

const createVideo = async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videos`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse serveur:', errorText);
        throw new Error('Erreur lors de la création de la vidéo');
    }
    return await response.json();
};

const updateVideo = async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse serveur:', errorText);
        throw new Error('Erreur lors de la modification de la vidéo');
    }
    return await response.json();
};

const deleteVideo = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la vidéo');
    return true;
};

// --- Affichage des vidéos ---
const displayVideos = (videos) => {
    videosTableBody.innerHTML = videos.map(video => `
        <tr>
            <td>${video.titre}</td>
            <td>${video.categorie}</td>
            <td>${video.auteur_prenom} ${video.auteur_nom}</td>
            <td>${formatDate(video.date_creation)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-button" onclick="editVideo(${video.id_video})">Modifier</button>
                    <button class="delete-button" onclick="confirmDeleteVideo(${video.id_video})">Supprimer</button>
                </div>
            </td>
        </tr>
    `).join('');
};

// --- Charger les catégories et auteurs pour la vidéo ---
const populateVideoSelects = async () => {
    const [categories, authors] = await Promise.all([fetchCategories(), fetchAuthors()]);
    const videoCategory = document.getElementById('videoCategory');
    const videoAuthor = document.getElementById('videoAuthor');
    videoCategory.innerHTML = categories.map(c => `<option value="${c.id_categorie}">${c.nom}</option>`).join('');
    videoAuthor.innerHTML = authors.map(a => `<option value="${a.id_auteur}">${a.prenom} ${a.nom}</option>`).join('');
};

// --- Editer une vidéo ---
window.editVideo = async (id) => {
    showLoading();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erreur lors du chargement de la vidéo');
        const video = await response.json();
        openVideoModal(video);
    } catch (e) {
        alert('Erreur lors du chargement de la vidéo');
    } finally {
        hideLoading();
    }
};

// --- Supprimer une vidéo ---
window.confirmDeleteVideo = async (id) => {
    if (confirm('Supprimer cette vidéo ?')) {
        showLoading();
        try {
            await deleteVideo(id);
            await loadVideos();
        } catch (e) {
            alert('Erreur lors de la suppression de la vidéo');
        } finally {
            hideLoading();
        }
    }
};

// --- Soumission du formulaire vidéo ---
videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    try {
        const data = {
            titre: document.getElementById('videoTitle').value,
            id_categorie: document.getElementById('videoCategory').value,
            id_auteur: document.getElementById('videoAuthor').value,
            url_youtube: document.getElementById('videoUrl').value,
            description: document.getElementById('videoDescription').value
        };
        const videoId = document.getElementById('videoId').value;
        if (videoId) {
            await updateVideo(videoId, data);
        } else {
            await createVideo(data);
        }
        closeVideoModal();
        await loadVideos();
    } catch (e) {
        alert('Erreur lors de l\'enregistrement de la vidéo');
    } finally {
        hideLoading();
    }
});

// --- Charger les vidéos ---
const loadVideos = async () => {
    showLoading();
    try {
        const videos = await fetchVideos();
        displayVideos(videos);
    } catch (e) {
        videosTableBody.innerHTML = `<tr><td colspan=\"5\">Erreur lors du chargement des vidéos</td></tr>`;
    } finally {
        hideLoading();
    }
};

// --- Initialisation vidéos ---
const initVideos = async () => {
    await Promise.all([loadVideos(), populateVideoSelects()]);
};

// Initialisation
const init = async () => {
    if (!checkAuth()) return;
    
    await Promise.all([
        loadArticles(),
        populateSelects(),
        initVideos()
    ]);
    
    articleForm.addEventListener('submit', handleSubmit);
    
    // Fermer le modal en cliquant en dehors
    window.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // Ajout de l'écouteur d'événement pour le formulaire auteur
    const authorFormEl = document.getElementById('authorForm');
    if (authorFormEl) {
        authorFormEl.addEventListener('submit', saveAuthor);
    }
};

// Démarrer l'application
document.addEventListener('DOMContentLoaded', init); 