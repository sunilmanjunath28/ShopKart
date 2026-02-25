const API_URL = 'http://localhost:8080/api';

// Show alert message
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
    
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Show loading state
function setLoading(btnId, textId, isLoading) {
    const btn = document.getElementById(btnId);
    const text = document.getElementById(textId);
    
    if (isLoading) {
        btn.disabled = true;
        text.innerHTML = '<span class="loading"></span>';
    } else {
        btn.disabled = false;
        text.textContent = btnId === 'loginForm' ? 'Login' : 'Continue';
    }
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        setLoading('loginForm', 'loginBtnText', true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Store logged in user email
                localStorage.setItem('loggedInUser', data.email);
                localStorage.setItem('token', data.token || 'demo-token');
                
                // Check if user has saved profile data (keyed by email)
                const profileKey = 'profile_' + data.email;
                const savedProfileStr = localStorage.getItem(profileKey);
                
                showAlert('Login successful! Redirecting...', 'success');
                
                if (savedProfileStr) {
                    // Profile exists - merge and redirect to dashboard
                    const savedProfile = JSON.parse(savedProfileStr);
                    const mergedUser = {
                        ...data,
                        name: savedProfile.name || data.name,
                        phone: savedProfile.phone || data.phone,
                        city: savedProfile.city || data.city,
                        pincode: savedProfile.pincode || data.pincode,
                        profileImage: savedProfile.profileImage || data.profileImage
                    };
                    localStorage.setItem('user', JSON.stringify(mergedUser));
                    console.log('✅ Loaded saved profile for:', data.email);
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard-select.html';
                    }, 1000);
                } else {
                    // No profile exists - redirect to profile page
                    localStorage.setItem('user', JSON.stringify(data));
                    console.log('⚠️ No profile found for:', data.email);
                    
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 1000);
                }
            } else {
                const error = await response.text();
                showAlert(error || 'Invalid email or password. Please try again.');
                setLoading('loginForm', 'loginBtnText', false);
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Unable to connect to server. Please try again later.');
            setLoading('loginForm', 'loginBtnText', false);
        }
    });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long.');
            return;
        }

        setLoading('registerForm', 'registerBtnText', true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Store logged in user email
                localStorage.setItem('loggedInUser', data.email);
                localStorage.setItem('token', data.token || 'demo-token');
                localStorage.setItem('user', JSON.stringify(data));
                
                showAlert('Registration successful! Redirecting to profile...', 'success');
                
                // Always redirect to profile page after registration
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
            } else {
                const error = await response.text();
                showAlert(error || 'Registration failed. Email might already be in use.');
                setLoading('registerForm', 'registerBtnText', false);
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Unable to connect to server. Please try again later.');
            setLoading('registerForm', 'registerBtnText', false);
        }
    });
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    // Save profile data before logout (keyed by email)
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.email && (user.phone || user.city || user.pincode)) {
            // Save profile data separately
            const profileKey = 'profile_' + user.email;
            const profileData = {
                name: user.name,
                phone: user.phone,
                city: user.city,
                pincode: user.pincode,
                profileImage: user.profileImage
            };
            localStorage.setItem(profileKey, JSON.stringify(profileData));
            console.log('💾 Profile saved for:', user.email);
        }
    }
    
    // Only remove loggedInUser, token, and user - keep profile_<email> data
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 Logged out - profile data preserved');
    window.location.href = 'login.html';
}
