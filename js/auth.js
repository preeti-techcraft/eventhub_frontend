// Toast Notification Utility
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color:var(--accent)"></i>' : '<i class="fas fa-exclamation-circle" style="color:var(--danger)"></i>';
    
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.8rem;">
            ${icon}
            <span>${message}</span>
        </div>
        <span style="cursor:pointer; font-weight:bold; margin-left:1rem; opacity:0.7;" onclick="this.parentElement.remove()">&times;</span>
    `;
    container.appendChild(toast);
    setTimeout(() => { if(toast.parentElement) toast.remove(); }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const session = DB.getSession();
    if (session) {
        window.location.href = 'dashboard.html';
    }

    // Modal Elements
    const modal = document.getElementById('auth-modal');
    const btnLoginModal = document.getElementById('btn-login-modal');
    const btnRegisterModal = document.getElementById('btn-register-modal');
    const btnExplore = document.getElementById('hero-btn-explore');
    const closeBtn = document.getElementById('modal-close');
    
    const authTitle = document.getElementById('auth-title');
    const regFields = document.getElementById('register-fields');
    const authForm = document.getElementById('auth-form');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchText = document.getElementById('auth-switch-text');
    const switchLink = document.getElementById('auth-switch-link');

    let isLogin = true;

    const openModal = (mode) => {
        isLogin = mode === 'login';
        updateModalUI();
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        authForm.reset();
    };

    const updateModalUI = () => {
        if (isLogin) {
            authTitle.innerText = "Welcome Back";
            regFields.style.display = "none";
            submitBtn.innerText = "Login to Portal";
            switchText.innerText = "Don't have an account?";
            switchLink.innerText = "Sign up here";
            // remove required from reg fields
            document.getElementById('auth-name').required = false;
            document.getElementById('auth-phone').required = false;
        } else {
            authTitle.innerText = "Create Your Account";
            regFields.style.display = "block";
            submitBtn.innerText = "Complete Sign Up";
            switchText.innerText = "Already have an account?";
            switchLink.innerText = "Login here";
            // add required to reg fields
            document.getElementById('auth-name').required = true;
            document.getElementById('auth-phone').required = true;
        }
    };

    // Event Listeners
    if(btnLoginModal) btnLoginModal.addEventListener('click', () => openModal('login'));
    if(btnExplore) btnExplore.addEventListener('click', () => openModal('register'));
    if(btnRegisterModal) btnRegisterModal.addEventListener('click', () => openModal('register'));
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Forgot Password Logic
    const forgotPasswordLink = document.getElementById('auth-forgot-password-link');
    const fpModal = document.getElementById('forgot-password-modal');
    const fpCloseBtn = document.getElementById('forgot-password-close');
    const fpForm = document.getElementById('forgot-password-form');

    if (forgotPasswordLink && fpModal) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
            fpModal.classList.add('active');
        });
    }

    if (fpCloseBtn) {
        fpCloseBtn.addEventListener('click', () => {
            fpModal.classList.remove('active');
        });
    }

    if (fpForm) {
        fpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('fp-email').value.trim();
            const newPassword = document.getElementById('fp-new-password').value;
            
            const submitBtn = fpForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            const res = await DB.forgotPassword(email, newPassword);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            if (res.success) {
                showToast(res.message, 'success');
                fpModal.classList.remove('active');
                fpForm.reset();
                openModal('login');
            } else {
                showToast(res.message || "Failed to reset password", 'error');
            }
        });
    }

    // Close modal if click outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
        if (fpModal && e.target === fpModal) fpModal.classList.remove('active');
    });

    if(switchLink) {
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            updateModalUI();
        });
    }

    // Password Toggle
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('auth-password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Form Submission
    if(authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value;

            if (isLogin) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
                submitBtn.disabled = true;
                
                const res = await DB.login(email, password);
                if (res.success) {
                    showToast(`Welcome back, ${res.user.name}!`, 'success');
                    setTimeout(() => window.location.href = 'dashboard.html', 800);
                } else {
                    submitBtn.innerHTML = 'Login to Portal';
                    submitBtn.disabled = false;
                    showToast(res.message, 'error');
                }
            } else {
                const name = document.getElementById('auth-name').value.trim();
                const phone = document.getElementById('auth-phone') ? document.getElementById('auth-phone').value.trim() : '';
                const role = document.getElementById('auth-role').value;
                
                if (!phone) {
                    showToast('Phone number is required for registration.', 'error');
                    return;
                }
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
                submitBtn.disabled = true;
                
                const res = await DB.register(name, email, password, role, phone);
                if (res.success) {
                    showToast('Registration successful! Please login to continue.', 'success');
                    isLogin = true;
                    updateModalUI();
                    authForm.reset();
                    submitBtn.disabled = false;
                } else {
                    submitBtn.innerHTML = 'Complete Sign Up';
                    submitBtn.disabled = false;
                    showToast(res.message, 'error');
                }
            }
        });
    }
});
