// Login page: sign in with DummyJSON
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-identifier');
const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');

function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');

    const username = loginUsername.value.trim();
    const password = loginPassword.value; // don't trim passwords

    if (!username || !password) {
        showError('Please enter your username and password.');
        return;
    }

    loginButton.disabled = true;

    try {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, expiresInMins: 30 })
        });
        const data = await response.json();

        if (response.ok) {
            // Save who is logged in. Other pages will read this.
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                image: data.image,
                token: data.accessToken || data.token
            }));
            window.location.href = 'index.html';
        } else {
            showError(data.message || 'Invalid username or password.');
            loginButton.disabled = false;
        }
    } catch (error) {
        showError('Something went wrong. Please try again.');
        loginButton.disabled = false;
    }
});