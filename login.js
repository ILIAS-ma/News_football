// Configuration de l'API
const API_BASE_URL = 'https://newsfootbackend-production.up.railway.app';

// Éléments du DOM
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const passwordInput = document.getElementById('password');

// Vérifier si l'utilisateur est déjà connecté
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html';
    }
};

// Fonction de login
const login = async (password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            throw new Error('Mot de passe incorrect');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erreur de connexion:', error);
        loginError.classList.add('show');
        passwordInput.value = '';
        passwordInput.focus();
    }
};

// Gestionnaire de soumission du formulaire
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.remove('show');
    
    const password = passwordInput.value.trim();
    if (!password) {
        loginError.textContent = 'Veuillez entrer un mot de passe';
        loginError.classList.add('show');
        return;
    }

    await login(password);
});

// Vérifier l'authentification au chargement de la page
checkAuth(); 