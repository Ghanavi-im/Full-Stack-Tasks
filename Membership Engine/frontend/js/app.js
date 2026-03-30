// --- Constants & Config ---
const API_URL = 'http://localhost:5000/api';

// --- Auth Helpers ---
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    window.location.href = 'login.html';
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

// --- Auth Pages Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Nav Injection for Landing Page
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        if (isLoggedIn()) {
            const role = localStorage.getItem('role');
            navMenu.innerHTML = `<a href="${role === 'Admin' ? 'admin.html' : 'dashboard.html'}">Dashboard</a> <a href="#" onclick="logout()">Logout</a>`;
        } else {
            navMenu.innerHTML = `<a href="login.html">Login</a> <a href="register.html">Register</a>`;
        }
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-message');
            
            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.user.role);
                    localStorage.setItem('name', data.user.name);
                    window.location.href = data.user.role === 'Admin' ? 'admin.html' : 'dashboard.html';
                } else {
                    errorMsg.innerText = data.error;
                    errorMsg.classList.remove('hidden');
                }
            } catch (err) {
                errorMsg.innerText = 'Network error. Please try again.';
                errorMsg.classList.remove('hidden');
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const errorMsg = document.getElementById('error-message');
            const successMsg = document.getElementById('success-message');
            
            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role })
                });
                const data = await res.json();
                
                if (res.ok) {
                    successMsg.innerText = 'Registration successful! Please login.';
                    successMsg.classList.remove('hidden');
                    errorMsg.classList.add('hidden');
                    registerForm.reset();
                } else {
                    errorMsg.innerText = data.error;
                    errorMsg.classList.remove('hidden');
                    successMsg.classList.add('hidden');
                }
            } catch (err) {
                errorMsg.innerText = 'Network error. Please try again.';
                errorMsg.classList.remove('hidden');
            }
        });
    }
});

// --- Dashboard Logic ---
async function loadPlans(isUser) {
    try {
        const res = await fetch(`${API_URL}/plans`);
        const plans = await res.json();
        const container = document.getElementById('plans-container');
        if (!container) return;

        container.innerHTML = '';
        plans.forEach(plan => {
            const card = document.createElement('div');
            card.className = 'card plan-card';
            card.innerHTML = `
                <h4>${plan.name}</h4>
                <div class="plan-price">$${plan.price}</div>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">Duration: ${plan.duration_days} days</p>
                ${isUser ? `<button class="btn btn-full" onclick="subscribeToPlan(${plan.id})">Subscribe / Upgrade</button>` : ''}
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading plans');
    }
}

async function loadMySubscription() {
    try {
        const res = await fetch(`${API_URL}/my-subscription`, { headers: authHeaders() });
        const data = await res.json();
        
        const infoDiv = document.getElementById('subscription-info');
        const badge = document.getElementById('status-badge');
        
        if (data.message || !data.plan_name) {
            infoDiv.innerHTML = '<p>You do not have an active subscription. Please select a plan below.</p>';
            badge.innerText = 'No Plan';
            badge.className = 'status-badge status-expired';
            return;
        }

        const start = new Date(data.start_date).toLocaleDateString();
        const end = new Date(data.end_date).toLocaleDateString();
        
        badge.innerText = data.status;
        badge.className = data.status === 'Active' ? 'status-badge status-active' : 'status-badge status-expired';

        infoDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="font-size: 1.25rem;">${data.plan_name}</h4>
                <span style="font-size: 1.25rem; font-weight: bold; color: var(--primary-color)">$${data.price}</span>
            </div>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Start Date:</strong> ${start}</p>
            <p><strong>End Date:</strong> ${end}</p>
        `;
    } catch (error) {
        console.error('Error loading subscription');
    }
}

async function subscribeToPlan(planId) {
    if(!confirm('Are you sure you want to subscribe to this plan? It will replace any active plan.')) return;
    try {
        const res = await fetch(`${API_URL}/subscribe`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ plan_id: planId })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Subscription Added successfully!');
            loadMySubscription();
        } else {
            alert(data.error || 'Failed to subscribe');
        }
    } catch (error) {
        alert('Network error');
    }
}

async function testPremiumFeature() {
    const resBox = document.getElementById('feature-result');
    try {
        const res = await fetch(`${API_URL}/feature/premium`, { headers: authHeaders() });
        const data = await res.json();
        
        resBox.classList.remove('hidden', 'alert-success', 'alert-error');
        if (res.ok) {
            resBox.classList.add('alert-success');
            resBox.innerText = `Success: ${data.message} (Your Plan: ${data.plan})`;
        } else {
            resBox.classList.add('alert-error');
            resBox.innerText = `Error: ${data.error}`;
        }
    } catch (error) {
        resBox.classList.remove('hidden', 'alert-success');
        resBox.classList.add('alert-error');
        resBox.innerText = 'Network error while testing feature.';
    }
}

// --- Admin Logic ---
async function loadAdminUsers() {
    try {
        const res = await fetch(`${API_URL}/admin/users`, { headers: authHeaders() });
        const users = await res.json();
        const tbody = document.getElementById('users-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = users.map(u => `
            <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 1rem;">${u.id}</td>
                <td style="padding: 1rem;">${u.name}</td>
                <td style="padding: 1rem;">${u.email}</td>
                <td style="padding: 1rem;">
                    <span class="status-badge ${u.role === 'Admin' ? 'status-active' : ''}" style="background: ${u.role === 'Admin' ? '#FEF3C7' : '#F3F4F6'}; color: ${u.role === 'Admin' ? '#D97706' : '#374151'}">${u.role}</span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users');
    }
}

async function loadAdminSubscriptions() {
    try {
        const res = await fetch(`${API_URL}/admin/subscriptions`, { headers: authHeaders() });
        const subs = await res.json();
        const tbody = document.getElementById('subs-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = subs.map(s => `
            <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 1rem;">${s.id}</td>
                <td style="padding: 1rem;">${s.user_name} (${s.email})</td>
                <td style="padding: 1rem;">${s.plan_name}</td>
                <td style="padding: 1rem;">${new Date(s.start_date).toLocaleDateString()}</td>
                <td style="padding: 1rem;">${new Date(s.end_date).toLocaleDateString()}</td>
                <td style="padding: 1rem;">
                    <span class="status-badge ${s.status === 'Active' ? 'status-active' : 'status-expired'}">${s.status}</span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading subscriptions');
    }
}

async function createPlan() {
    const name = document.getElementById('plan-name').value;
    const price = document.getElementById('plan-price').value;
    const duration_days = document.getElementById('plan-duration').value;
    
    try {
        const res = await fetch(`${API_URL}/admin/plans`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ name, price, duration_days })
        });
        
        if (res.ok) {
            alert('Plan created successfully!');
            document.getElementById('add-plan-form').reset();
            document.getElementById('add-plan-form-container').classList.add('hidden');
            loadPlans(false); // reload admin plans
        } else {
            alert('Error creating plan');
        }
    } catch(err) {
        alert('Request failed');
    }
}
