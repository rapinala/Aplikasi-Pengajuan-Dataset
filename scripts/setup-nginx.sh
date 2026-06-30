#!/bin/bash

# Nginx Configuration Script for Dataset Portal

set -e

echo "🔧 Nginx Configuration for Dataset Portal"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

read -p "Enter your domain name (e.g., portal.example.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "Domain name is required!"
    exit 1
fi

read -p "Enter app port [3000]: " APP_PORT
APP_PORT=${APP_PORT:-3000}

CONFIG_FILE="/etc/nginx/sites-available/dataset-portal"

echo "Creating Nginx configuration..."

cat > $CONFIG_FILE <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Client max body size (untuk upload file)
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:${APP_PORT};
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API route without caching
    location /api {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "✓ Configuration created"

# Enable site
ln -sf $CONFIG_FILE /etc/nginx/sites-enabled/dataset-portal

# Remove default if exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Test configuration
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Configuration is valid"
    
    # Restart Nginx
    echo "Restarting Nginx..."
    systemctl restart nginx
    
    echo ""
    echo "✓ Nginx configured successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure your DNS points to this server IP"
    echo "2. Install SSL certificate:"
    echo "   sudo apt install certbot python3-certbot-nginx"
    echo "   sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
    echo ""
    echo "Your site should be accessible at: http://${DOMAIN}"
else
    echo "✗ Configuration test failed!"
    exit 1
fi
