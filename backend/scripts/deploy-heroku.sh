#!/bin/bash

# ============================================
# Heroku Deployment Script for Vibe Holidays Backend
# ============================================

set -e  # Exit on error

echo "🚀 Starting Heroku deployment for Vibe Holidays Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}❌ Heroku CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Heroku. Please log in.${NC}"
    heroku login
fi

# Get app name
read -p "Enter Heroku app name (or press Enter to create new): " APP_NAME

if [ -z "$APP_NAME" ]; then
    read -p "Enter new app name: " APP_NAME
    echo -e "${YELLOW}📦 Creating new Heroku app: $APP_NAME${NC}"
    heroku create "$APP_NAME"
else
    echo -e "${GREEN}✓ Using existing app: $APP_NAME${NC}"
fi

# Set environment variables
echo -e "${YELLOW}🔧 Setting environment variables...${NC}"

read -p "Enter MongoDB URI: " MONGODB_URI
read -p "Enter JWT Secret (or press Enter to generate): " JWT_SECRET

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}✓ Generated JWT Secret${NC}"
fi

read -p "Enter Email Host (default: smtp.gmail.com): " EMAIL_HOST
EMAIL_HOST=${EMAIL_HOST:-smtp.gmail.com}

read -p "Enter Email Port (default: 587): " EMAIL_PORT
EMAIL_PORT=${EMAIL_PORT:-587}

read -p "Enter Email User: " EMAIL_USER
read -s -p "Enter Email Password: " EMAIL_PASSWORD
echo ""

read -p "Enter Email From Address: " EMAIL_FROM
read -p "Enter Admin Email: " ADMIN_EMAIL
read -p "Enter Frontend URL: " FRONTEND_URL

# Set all environment variables
heroku config:set \
    NODE_ENV=production \
    MONGODB_URI="$MONGODB_URI" \
    JWT_SECRET="$JWT_SECRET" \
    EMAIL_HOST="$EMAIL_HOST" \
    EMAIL_PORT="$EMAIL_PORT" \
    EMAIL_USER="$EMAIL_USER" \
    EMAIL_PASSWORD="$EMAIL_PASSWORD" \
    EMAIL_FROM="$EMAIL_FROM" \
    ADMIN_EMAIL="$ADMIN_EMAIL" \
    FRONTEND_URL="$FRONTEND_URL" \
    --app "$APP_NAME"

echo -e "${GREEN}✓ Environment variables set${NC}"

# Deploy to Heroku
echo -e "${YELLOW}📤 Deploying to Heroku...${NC}"
git push heroku main

# Run database migrations if needed
# heroku run npm run migrate --app "$APP_NAME"

# Open the app
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${YELLOW}🌐 Opening app...${NC}"
heroku open --app "$APP_NAME"

# Show logs
echo -e "${YELLOW}📋 Showing logs (Ctrl+C to exit)...${NC}"
heroku logs --tail --app "$APP_NAME"
