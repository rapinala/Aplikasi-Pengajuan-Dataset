#!/bin/bash

# Dashboard Portal Dataset - VPS Deployment Script
# This script automates deployment to Ubuntu 22.04 VPS

set -e  # Exit on error

echo "🚀 Dashboard Portal Dataset - VPS Deployment"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/10]${NC} Updating system packages..."
apt update && apt upgrade -y

echo -e "${YELLOW}[2/10]${NC} Installing Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo "✓ Node.js $(node -v) installed"

echo -e "${YELLOW}[3/10]${NC} Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    apt install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
fi
echo "✓ PostgreSQL installed"

echo -e "${YELLOW}[4/10]${NC} Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo "✓ PM2 installed"

echo -e "${YELLOW}[5/10]${NC} Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
fi
echo "✓ Nginx installed"

echo -e "${YELLOW}[6/10]${NC} Setting up PostgreSQL database..."
read -p "Enter database name [dataset_portal]: " DB_NAME
DB_NAME=${DB_NAME:-dataset_portal}

read -p "Enter database user [dataset_user]: " DB_USER
DB_USER=${DB_USER:-dataset_user}

read -sp "Enter database password: " DB_PASS
echo ""

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE ${DB_NAME};
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};
EOF

echo "✓ Database created"

echo -e "${YELLOW}[7/10]${NC} Setting up application directory..."
APP_DIR="/var/www/dataset-portal"
mkdir -p $APP_DIR
cd $APP_DIR

read -p "Enter Git repository URL: " GIT_REPO
if [ ! -z "$GIT_REPO" ]; then
    git clone $GIT_REPO .
else
    echo -e "${YELLOW}Please upload your application files to $APP_DIR${NC}"
    read -p "Press Enter when files are ready..."
fi

echo -e "${YELLOW}[8/10]${NC} Installing dependencies..."
npm install

echo -e "${YELLOW}[9/10]${NC} Setting up environment..."
cat > .env <<EOF
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
NODE_ENV=production
PORT=3000
EOF

echo "✓ Environment configured"

echo -e "${YELLOW}[10/10]${NC} Building application..."
npm run build

echo ""
echo -e "${GREEN}✓ Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Push database schema: npx drizzle-kit push"
echo "2. Seed data (optional): npx ts-node scripts/seed.ts"
echo "3. Start app: pm2 start npm --name dataset-portal -- start"
echo "4. Save PM2: pm2 save && pm2 startup"
echo "5. Configure Nginx (see DEPLOYMENT_GUIDE.md)"
echo "6. Setup SSL with certbot (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "App directory: $APP_DIR"
echo "Database: $DB_NAME"
echo "Database URL: postgresql://${DB_USER}:***@localhost:5432/${DB_NAME}"
