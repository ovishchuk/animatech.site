const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize database
const db = new Database();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://ovishchuk.duckdns.org' 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP' }
});

app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, '../html')));

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await db.getAdminUser(username);
        
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Order routes
app.post('/api/orders', async (req, res) => {
    try {
        const { name, email, service, description } = req.body;

        if (!name || !email || !service || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const order = await db.createOrder({ name, email, service, description });
        
        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await db.getOrders();
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const { status } = req.body;

        if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await db.updateOrderStatus(orderId, status);
        res.json(result);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Blog routes
app.get('/api/blog', async (req, res) => {
    try {
        const { status = 'published' } = req.query;
        const posts = await db.getBlogPosts(status);
        res.json(posts);
    } catch (error) {
        console.error('Get blog posts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/blog', authenticateToken, async (req, res) => {
    try {
        const { title, content, excerpt, status = 'draft' } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const post = await db.createBlogPost({ title, content, excerpt, status });
        
        res.status(201).json({
            message: 'Blog post created successfully',
            post
        });
    } catch (error) {
        console.error('Create blog post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/blog/:id', authenticateToken, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, content, excerpt, status } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const result = await db.updateBlogPost(postId, { title, content, excerpt, status });
        res.json(result);
    } catch (error) {
        console.error('Update blog post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/blog/:id', authenticateToken, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const result = await db.deleteBlogPost(postId);
        res.json(result);
    } catch (error) {
        console.error('Delete blog post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin panel route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/admin/index.html'));
});

// Admin settings routes
app.put('/api/admin/username', authenticateToken, async (req, res) => {
    try {
        const { newUsername } = req.body;
        const userId = req.user.id;

        if (!newUsername || newUsername.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        const result = await db.updateAdminUsername(userId, newUsername.trim());
        res.json({ message: 'Username updated successfully', ...result });
    } catch (error) {
        console.error('Update username error:', error);
        if (error.message === 'Username already exists') {
            res.status(400).json({ error: 'Username already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.put('/api/admin/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Verify current password
        const user = await db.getAdminUser(req.user.username);
        if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const result = await db.updateAdminPassword(userId, newPassword);
        res.json({ message: 'Password updated successfully', ...result });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Catch all handler for SPA
app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/admin')) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(__dirname, '../html/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
    try {
        await db.initialize();
        
        app.listen(PORT, () => {
            console.log(`🚀 CyberDev server running on port ${PORT}`);
            console.log(`📱 Admin panel: http://localhost:${PORT}/admin`);
            console.log(`🌐 Website: http://localhost:${PORT}`);
            console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await db.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await db.close();
    process.exit(0);
});

startServer();
