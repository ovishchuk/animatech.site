#!/bin/bash

# =============================================================================
# Animatech Deployment Script for Ubuntu 25.04
# Domain: ovishchuk.duckdns.org
# Author: Cascade AI Assistant
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="ovishchuk.duckdns.org"
PROJECT_DIR="/var/www/ovishchuk.duckdns.org"
SERVICE_NAME="animatech"
NODE_VERSION="18.x"
REPO_URL="https://github.com/ovishchuk/ovishchuk.site.git"

# Logging
LOG_FILE="/var/log/animatech-deploy.log"
exec > >(tee -a "$LOG_FILE")
exec 2>&1

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

check_sudo() {
    if ! sudo -n true 2>/dev/null; then
        log "Requesting sudo privileges..."
        sudo -v || error "Sudo privileges required"
        # Keep sudo alive
        while true; do sudo -n true; sleep 60; kill -0 "$$" 2>/dev/null || exit; done 2>/dev/null &
    fi
}

check_ubuntu_version() {
    log "Checking Ubuntu version..."
    if ! grep -q "Ubuntu" /etc/os-release; then
        error "This script is designed for Ubuntu"
    fi
    
    local version=$(grep VERSION_ID /etc/os-release | cut -d'"' -f2 | cut -d'.' -f1)
    log "Ubuntu version: $version"
    
    if [ "$version" -lt "24" ]; then
        warn "This script is optimized for Ubuntu 25.04, but should work on $version"
    fi
}

install_system_dependencies() {
    log "Installing system dependencies..."
    
    # Update package lists
    sudo apt update
    
    # Install essential packages
    sudo apt install -y curl wget git nginx ufw software-properties-common \
        apt-transport-https ca-certificates gnupg lsb-release build-essential
    
    log "System dependencies installed successfully"
}

install_nodejs() {
    log "Installing Node.js $NODE_VERSION..."
    
    # Remove old Node.js if exists
    if command -v node >/dev/null 2>&1; then
        log "Removing existing Node.js installation..."
        sudo apt remove -y nodejs npm || true
        sudo rm -rf /usr/local/lib/node_modules || true
        sudo rm -rf /usr/local/bin/node || true
        sudo rm -rf /usr/local/bin/npm || true
    fi
    
    # Add NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | sudo -E bash -
    
    # Install Node.js
    sudo apt-get install -y nodejs
    
    # Verify installation
    local node_version=$(node --version)
    local npm_version=$(npm --version)
    log "Node.js installed: $node_version"
    log "npm installed: $npm_version"
}

setup_project_directory() {
    log "Setting up project directory..."
    
    # Create project directory
    sudo mkdir -p "$PROJECT_DIR"
    sudo mkdir -p "$PROJECT_DIR/logs"
    
    # Create project user if doesn't exist
    if ! id "www-data" &>/dev/null; then
        sudo useradd -r -s /bin/false www-data
    fi
    
    # Set permissions
    sudo chown -R www-data:www-data "$PROJECT_DIR"
    sudo chmod -R 755 "$PROJECT_DIR"
    
    log "Project directory created: $PROJECT_DIR"
}

clone_repository() {
    log "Cloning repository from GitHub..."
    
    # Temporarily change to project directory
    cd "$PROJECT_DIR"
    
    # Remove existing repository if exists
    if [ -d ".git" ]; then
        sudo rm -rf .git
    fi
    
    # Clone repository
    sudo -u www-data git clone "$REPO_URL" .
    
    # Install npm dependencies
    cd server
    sudo -u www-data npm install
    
    log "Repository cloned and dependencies installed"
}

setup_environment() {
    log "Setting up environment variables..."
    
    cd "$PROJECT_DIR/server"
    
    # Create .env file
    sudo -u www-data cat > .env << EOF
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=$(openssl rand -base64 32)
EOF
    
    # Set permissions
    sudo chmod 600 .env
    sudo chown www-data:www-data .env
    
    log "Environment configured"
}

setup_nginx() {
    log "Setting up Nginx configuration..."
    
    # Enable the existing site
    if [ ! -L "/etc/nginx/sites-enabled/ovishchuk" ]; then
        sudo ln -sf /etc/nginx/sites-available/ovishchuk /etc/nginx/sites-enabled/
    fi
    
    # Remove default site if exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    # Restart Nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    log "Nginx configured and restarted"
}

setup_firewall() {
    log "Configuring firewall..."
    
    # Allow SSH
    sudo ufw allow OpenSSH
    
    # Allow HTTP
    sudo ufw allow 80/tcp
    
    # Allow Node.js port (internal, but just in case)
    sudo ufw allow 3000/tcp
    
    # Enable firewall
    sudo ufw --force enable
    
    log "Firewall configured"
}

create_systemd_service() {
    log "Creating systemd service..."
    
    sudo cat > /etc/systemd/system/animatech.service << EOF
[Unit]
Description=Animatech Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$PROJECT_DIR/server
ExecStart=/usr/bin/node app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=animatech

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$PROJECT_DIR/logs

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd
    sudo systemctl daemon-reload
    
    # Enable and start service
    sudo systemctl enable animatech
    sudo systemctl start animatech
    
    log "Systemd service created and started"
}

setup_log_rotation() {
    log "Setting up log rotation..."
    
    sudo cat > /etc/logrotate.d/animatech << EOF
$PROJECT_DIR/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload animatech
    endscript
}
EOF
    
    log "Log rotation configured"
}

test_deployment() {
    log "Testing deployment..."
    
    # Wait for services to start
    sleep 5
    
    # Test Node.js service
    if sudo systemctl is-active --quiet animatech; then
        log "✓ Animatech service is running"
    else
        error "✗ Animatech service failed to start"
    fi
    
    # Test Nginx
    if sudo systemctl is-active --quiet nginx; then
        log "✓ Nginx is running"
    else
        error "✗ Nginx failed to start"
    fi
    
    # Test local connection
    if curl -s http://localhost:3000 >/dev/null; then
        log "✓ Node.js application responding on port 3000"
    else
        error "✗ Node.js application not responding"
    fi
    
    # Test external connection
    if curl -s "http://$DOMAIN" >/dev/null; then
        log "✓ External connection to $DOMAIN working"
    else
        warn "⚠ External connection test failed - DNS might need time to propagate"
    fi
    
    # Test port 80
    if curl -s http://localhost:80 >/dev/null; then
        log "✓ Nginx responding on port 80"
    else
        error "✗ Nginx not responding on port 80"
    fi
}

create_update_script() {
    log "Creating update script..."
    
    sudo cat > "$PROJECT_DIR/update.sh" << 'EOF'
#!/bin/bash

# Animatech Update Script
set -e

PROJECT_DIR="/var/www/ovishchuk.duckdns.org"
SERVICE_NAME="animatech"

echo "Updating Animatech..."

# Pull latest changes
cd "$PROJECT_DIR"
sudo -u www-data git pull origin main

# Install new dependencies
cd server
sudo -u www-data npm install

# Restart service
sudo systemctl restart "$SERVICE_NAME"

echo "Update completed successfully!"
EOF
    
    sudo chmod +x "$PROJECT_DIR/update.sh"
    sudo chown www-data:www-data "$PROJECT_DIR/update.sh"
    
    log "Update script created"
}

show_status() {
    log "Deployment completed successfully!"
    echo
    echo "=== DEPLOYMENT STATUS ==="
    echo "🌐 Website: http://$DOMAIN"
    echo "📱 Admin Panel: http://$DOMAIN/admin"
    echo "📁 Project Directory: $PROJECT_DIR"
    echo "📝 Logs: sudo journalctl -u animatech -f"
    echo "🔄 Update: $PROJECT_DIR/update.sh"
    echo
    echo "=== SERVICE STATUS ==="
    sudo systemctl status animatech --no-pager -l
    echo
    echo "=== PORT STATUS ==="
    sudo ss -tlnp | grep -E ':(80|3000)\s'
    echo
    echo "=== NEXT STEPS ==="
    echo "1. Configure DNS: Point $DOMAIN to this server IP"
    echo "2. Setup SSL: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo "3. Monitor: sudo journalctl -u animatech -f"
    echo "4. Update: $PROJECT_DIR/update.sh"
}

# Main execution
main() {
    log "Starting Animatech deployment for Ubuntu 25.04"
    log "Domain: $DOMAIN"
    log "Project Directory: $PROJECT_DIR"
    
    check_sudo
    check_ubuntu_version
    install_system_dependencies
    install_nodejs
    setup_project_directory
    clone_repository
    setup_environment
    setup_nginx
    setup_firewall
    create_systemd_service
    setup_log_rotation
    test_deployment
    create_update_script
    show_status
    
    log "Deployment completed successfully! 🚀"
}

# Run main function
main "$@"
