# Animatech - Living AI & Robotics

A cyberpunk-style platform where robotics, software, and AI come to life with soul and personality.

## 🚀 Features

- **Cyberpunk Design**: Neon effects, dark theme, responsive layout
- **Living Technologies**: AI and robotics solutions with personality
- **Personal Portfolio**: About, services, blog, and projects sections
- **AI Services**: Advanced AI development and consulting
- **Robotics Solutions**: Custom robotics and automation
- **Admin Panel**: Full CRUD operations for projects and blog posts
- **Authentication**: Secure JWT-based admin authentication
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **HTML5** with semantic markup
- **Tailwind CSS** for styling
- **Vanilla JavaScript** with ES6+ features
- **Lucide Icons** for iconography
- **CSS Animations** for cyberpunk effects

### Backend
- **Node.js** with Express.js
- **SQLite** for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security headers

### Deployment
- **Nginx** as reverse proxy
- **Ubuntu** server
- **Port 80** for production

## 📁 Project Structure

```
animatech.site/
├── html/                 # Frontend files
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── admin/           # Admin panel
│   └── assets/          # Static assets
├── server/               # Backend files
│   ├── database.js       # Database operations
│   ├── app.js           # Express server
│   └── package.json      # Dependencies
└── README.md             # This file
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup
```bash
# Clone repository
git clone https://github.com/yourusername/animatech.site.git
cd animatech.site

# Install dependencies
cd server
npm install

# Initialize database
npm run init-db

# Start development server
npm start
```

### Environment Variables
Create `.env` file in server directory:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
```

## 🔧 Admin Panel

Access: `http://localhost:3000/admin`

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Change default credentials in production!**

## 📝️ API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Projects
- `GET /api/projects` - Get all projects (admin)
- `POST /api/projects` - Create new project (public)
- `PUT /api/projects/:id/status` - Update project status (admin)

### Blog
- `GET /api/blog` - Get published posts (public)
- `GET /api/blog?status=all` - Get all posts (admin)
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)
- `DELETE /api/blog/:id` - Delete post (admin)

### Admin Settings
- `PUT /api/admin/username` - Update admin username
- `PUT /api/admin/password` - Update admin password

## 🎨 Brand Colors

Animatech uses three signature neon colors that represent our philosophy of living technology:

- **Neon Cyan**: `#00ffff` - Pure energy and innovation
- **Neon Magenta**: `#ff00ff` - Creativity and human touch
- **Neon Accent**: `#00ccaa` - Harmony and balance

These colors are used throughout our platform to create a cohesive cyberpunk aesthetic that represents the fusion of technology and life.

For detailed color guidelines, see [BRAND_COLORS.md](BRAND_COLORS.md).

## 🎨 Customization

### Colors
- Primary Neon: `#00ffff` (cyan)
- Secondary Neon: `#ff00ff` (magenta)
- Accent Neon: `#00ccaa` (accent)
- Dark Background: `#0a0a0a`
- Secondary Dark: `#1a1a1a`

### Fonts
- Primary: `Courier New` (monospace)
- Tech: `Orbitron` (display font)

## 🔒 Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- SQL injection protection
- XSS protection headers
- Rate limiting
- CORS configuration

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interfaces
- Optimized animations
- Flexible grid layouts

## 🚀 Deployment

### Production
```bash
# Build and start
cd server
npm start

# Configure Nginx proxy to port 3000
sudo systemctl reload nginx
```

### Environment
- Production: Port 80 via Nginx
- Development: Port 3000 direct

## 🤖 Philosophy

At Animatech, we believe that technology isn't just code and circuits—it's alive. We approach robotics, software development, and artificial intelligence as living entities with soul and personality. Our mission is to breathe life into technology, creating solutions that not only function but feel, adapt, and evolve.

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

Animatech - [ovishchuk.duckdns.org](https://ovishchuk.duckdns.org)

---

**Built with ❤️ and living technology!**
