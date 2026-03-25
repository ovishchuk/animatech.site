// Admin Panel JavaScript
let authToken = localStorage.getItem('adminToken');
let currentPage = 'dashboard';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    if (authToken) {
        showDashboard();
    } else {
        showLogin();
    }
    
    // Event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('blog-form').addEventListener('submit', handleBlogSubmit);
    document.getElementById('username-form').addEventListener('submit', handleUsernameChange);
    document.getElementById('password-form').addEventListener('submit', handlePasswordChange);
    
    // Navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            switchPage(page);
        });
    });
});

// Login handling
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showDashboard();
        } else {
            document.getElementById('login-error').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('login-error').classList.add('hidden');
            }, 3000);
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('login-error').classList.remove('hidden');
    }
}

// Logout handling
function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    showLogin();
}

// UI Functions
function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard-screen').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    
    // Load dashboard data
    loadDashboardData();
    loadOrders();
    loadBlogPosts();
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    const response = await fetch(`/api${endpoint}`, mergedOptions);
    
    if (response.status === 401 || response.status === 403) {
        handleLogout();
        throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

// Dashboard Data Loading
async function loadDashboardData() {
    try {
        const [orders, posts] = await Promise.all([
            apiRequest('/orders'),
            apiRequest('/blog')
        ]);
        
        // Update statistics
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const totalPosts = posts.length;
        
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pendingOrders;
        document.getElementById('completed-orders').textContent = completedOrders;
        document.getElementById('total-posts').textContent = totalPosts;
        
        // Update recent orders
        const recentOrdersHtml = orders.slice(0, 5).map(order => `
            <div class="p-4 border-b border-gray-700">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-white font-semibold">${order.name}</p>
                        <p class="text-gray-400 text-sm">${order.service}</p>
                    </div>
                    <span class="status-badge status-${order.status}">${order.status}</span>
                </div>
            </div>
        `).join('');
        
        document.getElementById('recent-orders').innerHTML = recentOrdersHtml || '<p class="text-gray-400 p-4">No orders yet</p>';
        
        // Update recent posts
        const recentPostsHtml = posts.slice(0, 5).map(post => `
            <div class="p-4 border-b border-gray-700">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-white font-semibold">${post.title}</p>
                        <p class="text-gray-400 text-sm">${post.excerpt || 'No excerpt'}</p>
                    </div>
                    <span class="status-badge status-${post.status}">${post.status}</span>
                </div>
            </div>
        `).join('');
        
        document.getElementById('recent-posts').innerHTML = recentPostsHtml || '<p class="text-gray-400 p-4">No posts yet</p>';
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Orders Management
async function loadOrders() {
    try {
        const orders = await apiRequest('/orders');
        
        const ordersHtml = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.email}</td>
                <td>${order.service}</td>
                <td>
                    <select class="status-select" data-order-id="${order.id}" onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-neon" onclick="viewOrder(${order.id})">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('orders-table').innerHTML = ordersHtml || '<tr><td colspan="7" class="text-center text-gray-400 py-8">No orders found</td></tr>';
        
        // Re-initialize icons
        lucide.createIcons();
        
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orders-table').innerHTML = '<tr><td colspan="7" class="text-center text-red-400 py-8">Error loading orders</td></tr>';
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        await apiRequest(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        // Refresh orders
        if (currentPage === 'orders') {
            loadOrders();
        } else {
            loadDashboardData();
        }
        
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Error updating order status');
    }
}

async function viewOrder(orderId) {
    try {
        const orders = await apiRequest('/orders');
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            alert(`Order Details:\n\nName: ${order.name}\nEmail: ${order.email}\nService: ${order.service}\nDescription: ${order.description}\nStatus: ${order.status}\nCreated: ${new Date(order.created_at).toLocaleString()}`);
        }
    } catch (error) {
        console.error('Error viewing order:', error);
    }
}

function refreshOrders() {
    loadOrders();
}

// Blog Management
async function loadBlogPosts() {
    try {
        const posts = await apiRequest('/blog?status=all');
        
        const postsHtml = posts.map(post => `
            <tr>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>
                    <span class="status-badge status-${post.status}">${post.status}</span>
                </td>
                <td>${new Date(post.created_at).toLocaleDateString()}</td>
                <td>${new Date(post.updated_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-neon mr-2" onclick="editBlogPost(${post.id})">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                    </button>
                    <button class="btn-neon" onclick="deleteBlogPost(${post.id})">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('blog-table').innerHTML = postsHtml || '<tr><td colspan="6" class="text-center text-gray-400 py-8">No posts found</td></tr>';
        
        // Re-initialize icons
        lucide.createIcons();
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-table').innerHTML = '<tr><td colspan="6" class="text-center text-red-400 py-8">Error loading posts</td></tr>';
    }
}

function openBlogModal(postId = null) {
    const modal = document.getElementById('blog-modal');
    const form = document.getElementById('blog-form');
    
    if (postId) {
        // Edit mode - load post data
        loadBlogPost(postId);
    } else {
        // New post mode
        form.reset();
        document.getElementById('blog-id').value = '';
    }
    
    modal.style.display = 'block';
}

function closeBlogModal() {
    document.getElementById('blog-modal').style.display = 'none';
    document.getElementById('blog-form').reset();
}

async function loadBlogPost(postId) {
    try {
        const posts = await apiRequest('/blog?status=all');
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            document.getElementById('blog-id').value = post.id;
            document.getElementById('blog-title').value = post.title;
            document.getElementById('blog-excerpt').value = post.excerpt || '';
            document.getElementById('blog-content').value = post.content;
            document.getElementById('blog-status').value = post.status;
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
    }
}

async function handleBlogSubmit(e) {
    e.preventDefault();
    
    const postId = document.getElementById('blog-id').value;
    const postData = {
        title: document.getElementById('blog-title').value,
        excerpt: document.getElementById('blog-excerpt').value,
        content: document.getElementById('blog-content').value,
        status: document.getElementById('blog-status').value
    };
    
    try {
        if (postId) {
            // Update existing post
            await apiRequest(`/blog/${postId}`, {
                method: 'PUT',
                body: JSON.stringify(postData)
            });
        } else {
            // Create new post
            await apiRequest('/blog', {
                method: 'POST',
                body: JSON.stringify(postData)
            });
        }
        
        closeBlogModal();
        loadBlogPosts();
        
        if (currentPage === 'dashboard') {
            loadDashboardData();
        }
        
    } catch (error) {
        console.error('Error saving blog post:', error);
        alert('Error saving blog post');
    }
}

async function editBlogPost(postId) {
    openBlogModal(postId);
}

async function deleteBlogPost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        try {
            await apiRequest(`/blog/${postId}`, {
                method: 'DELETE'
            });
            
            loadBlogPosts();
            
            if (currentPage === 'dashboard') {
                loadDashboardData();
            }
            
        } catch (error) {
            console.error('Error deleting blog post:', error);
            alert('Error deleting blog post');
        }
    }
}

// Settings Management
async function handleUsernameChange(e) {
    e.preventDefault();
    
    const newUsername = document.getElementById('new-username').value.trim();
    
    if (!newUsername) {
        showMessage('Please enter a new username', 'error');
        return;
    }
    
    if (newUsername.length < 3) {
        showMessage('Username must be at least 3 characters long', 'error');
        return;
    }
    
    try {
        const result = await apiRequest('/admin/username', {
            method: 'PUT',
            body: JSON.stringify({ newUsername })
        });
        
        showMessage('Username updated successfully! You will need to login again.', 'success');
        
        // Clear form
        document.getElementById('username-form').reset();
        
        // Update current username display
        document.getElementById('current-username').value = newUsername;
        
        // Logout after 2 seconds to force re-login with new username
        setTimeout(() => {
            handleLogout();
        }, 2000);
        
    } catch (error) {
        console.error('Username change error:', error);
        showMessage(error.message || 'Error updating username', 'error');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage('All password fields are required', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters long', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match', 'error');
        return;
    }
    
    if (currentPassword === newPassword) {
        showMessage('New password must be different from current password', 'error');
        return;
    }
    
    try {
        const result = await apiRequest('/admin/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        showMessage('Password updated successfully!', 'success');
        
        // Clear form
        document.getElementById('password-form').reset();
        
    } catch (error) {
        console.error('Password change error:', error);
        showMessage(error.message || 'Error updating password', 'error');
    }
}

// Load current username when settings page is shown
function loadSettingsData() {
    // Get current username from JWT token payload
    try {
        const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
        document.getElementById('current-username').value = tokenPayload.username;
    } catch (error) {
        console.error('Error parsing token:', error);
        document.getElementById('current-username').value = 'Unknown';
    }
}

// Update switchPage function to load settings data
function switchPage(page) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    document.getElementById(`${page}-page`).classList.remove('hidden');
    
    currentPage = page;
    
    // Load page-specific data
    if (page === 'orders') {
        loadOrders();
    } else if (page === 'blog') {
        loadBlogPosts();
    } else if (page === 'settings') {
        loadSettingsData();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('blog-modal');
    if (event.target === modal) {
        closeBlogModal();
    }
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-toast');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast ${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        min-width: 250px;
        text-align: center;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'rgba(0, 255, 0, 0.1)';
        messageDiv.style.border = '1px solid rgba(0, 255, 0, 0.3)';
        messageDiv.style.color = '#00ff00';
    } else {
        messageDiv.style.background = 'rgba(255, 0, 0, 0.1)';
        messageDiv.style.border = '1px solid rgba(255, 0, 0, 0.3)';
        messageDiv.style.color = '#ff0000';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
