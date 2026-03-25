const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    resolve();
                }
            });
        });
    }

    async initialize() {
        await this.connect();
        
        // Create tables
        await this.createTables();
        
        // Insert default admin user
        await this.insertDefaultAdmin();
        
        console.log('Database initialized successfully');
    }

    createTables() {
        return new Promise((resolve, reject) => {
            const queries = [
                // Admin users table
                `CREATE TABLE IF NOT EXISTS admin_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,
                
                // Orders table
                `CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    service TEXT NOT NULL,
                    description TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,
                
                // Blog posts table
                `CREATE TABLE IF NOT EXISTS blog_posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    excerpt TEXT,
                    status TEXT DEFAULT 'draft',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`
            ];

            let completed = 0;
            queries.forEach(query => {
                this.db.run(query, (err) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                        reject(err);
                    } else {
                        completed++;
                        if (completed === queries.length) {
                            resolve();
                        }
                    }
                });
            });
        });
    }

    insertDefaultAdmin() {
        return new Promise((resolve, reject) => {
            const bcrypt = require('bcryptjs');
            const defaultPassword = 'admin123'; // Change this in production
            const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

            this.db.get('SELECT id FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    this.db.run(
                        'INSERT INTO admin_users (username, password) VALUES (?, ?)',
                        ['admin', hashedPassword],
                        function(err) {
                            if (err) {
                                reject(err);
                            } else {
                                console.log('Default admin user created');
                                console.log('Username: admin, Password: admin123');
                                resolve();
                            }
                        }
                    );
                } else {
                    resolve();
                }
            });
        });
    }

    // Order methods
    createOrder(orderData) {
        return new Promise((resolve, reject) => {
            const { name, email, service, description } = orderData;
            this.db.run(
                'INSERT INTO orders (name, email, service, description) VALUES (?, ?, ?, ?)',
                [name, email, service, description],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, ...orderData });
                    }
                }
            );
        });
    }

    getOrders() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    updateOrderStatus(orderId, status) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, orderId],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ orderId, status });
                    }
                }
            );
        });
    }

    // Blog methods
    createBlogPost(postData) {
        return new Promise((resolve, reject) => {
            const { title, content, excerpt, status = 'draft' } = postData;
            this.db.run(
                'INSERT INTO blog_posts (title, content, excerpt, status) VALUES (?, ?, ?, ?)',
                [title, content, excerpt, status],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, ...postData });
                    }
                }
            );
        });
    }

    getBlogPosts(status = 'published') {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM blog_posts';
            let params = [];
            
            if (status) {
                query += ' WHERE status = ?';
                params.push(status);
            }
            
            query += ' ORDER BY created_at DESC';
            
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    updateBlogPost(postId, postData) {
        return new Promise((resolve, reject) => {
            const { title, content, excerpt, status } = postData;
            this.db.run(
                'UPDATE blog_posts SET title = ?, content = ?, excerpt = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [title, content, excerpt, status, postId],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ postId, ...postData });
                    }
                }
            );
        });
    }

    deleteBlogPost(postId) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM blog_posts WHERE id = ?', [postId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deletedId: postId });
                }
            });
        });
    }

    // Admin methods
    getAdminUser(username) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    updateAdminUsername(userId, newUsername) {
        return new Promise((resolve, reject) => {
            // Check if username already exists
            this.db.get('SELECT id FROM admin_users WHERE username = ? AND id != ?', [newUsername, userId], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    reject(new Error('Username already exists'));
                } else {
                    this.db.run(
                        'UPDATE admin_users SET username = ? WHERE id = ?',
                        [newUsername, userId],
                        function(err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ userId, newUsername });
                            }
                        }
                    );
                }
            });
        });
    }

    updateAdminPassword(userId, newPassword) {
        return new Promise((resolve, reject) => {
            const bcrypt = require('bcryptjs');
            const hashedPassword = bcrypt.hashSync(newPassword, 10);

            this.db.run(
                'UPDATE admin_users SET password = ? WHERE id = ?',
                [hashedPassword, userId],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ userId });
                    }
                }
            );
        });
    }

    close() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed');
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

// Initialize database if run directly
if (require.main === module) {
    const db = new Database();
    db.initialize().then(() => {
        console.log('Database setup complete');
        process.exit(0);
    }).catch(err => {
        console.error('Database setup failed:', err);
        process.exit(1);
    });
}

module.exports = Database;
