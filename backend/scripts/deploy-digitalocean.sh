#!/bin/bash

# ============================================
# DigitalOcean Deployment Script for Vibe Holidays Backend
# ============================================

set -e  # Exit on error

echo "🚀 Starting DigitalOcean deployment for Vibe Holidays Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}❌ DigitalOcean CLI (doctl) is not installed.${NC}"
    echo "Install with: brew install doctl (macOS) or snap install doctl (Linux)"
    exit 1
fi

# Check if authenticated
if ! doctl auth list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated with DigitalOcean. Please authenticate.${NC}"
    doctl auth init
fi

echo -e "${GREEN}✓ DigitalOcean CLI ready${NC}"

# Instructions for App Platform deployment
echo ""
echo -e "${YELLOW}📋 DigitalOcean App Platform Deployment Instructions:${NC}"
echo ""
echo "1. Go to: https://cloud.digitalocean.com/apps"
echo "2. Click 'Create App'"
echo "3. Connect your GitHub repository"
echo "4. Select the 'backend' directory"
echo "5. Configure build settings:"
echo "   - Build Command: npm install && npm run build"
echo "   - Run Command: npm start"
echo "   - HTTP Port: 5000"
echo "6. Add environment variables (see .env.production.example)"
echo "7. Click 'Create Resources'"
echo ""
echo -e "${GREEN}Environment variables to configure:${NC}"
echo "  - NODE_ENV=production"
echo "  - MONGODB_URI=<your-mongodb-uri>"
echo "  - JWT_SECRET=<generate-with-openssl-rand-base64-32>"
echo "  - EMAIL_HOST=smtp.gmail.com"
echo "  - EMAIL_PORT=587"
echo "  - EMAIL_USER=<your-email>"
echo "  - EMAIL_PASSWORD=<your-password>"
echo "  - EMAIL_FROM=<from-address>"
echo "  - ADMIN_EMAIL=<admin-email>"
echo "  - FRONTEND_URL=<your-frontend-url>"
echo ""
echo -e "${YELLOW}💡 Tip: Generate JWT secret with: openssl rand -base64 32${NC}"
echo ""

read -p "Press Enter when deployment is complete to verify..."

# Verify deployment
read -p "Enter your app URL (e.g., https://your-app.ondigitalocean.app): " APP_URL

echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

# Test health endpoint
if curl -f -s "${APP_URL}/health" > /dev/null; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

# Test API endpoint
if curl -f -s "${APP_URL}/api/packages" > /dev/null; then
    echo -e "${GREEN}✓ API endpoint accessible${NC}"
else
    echo -e "${YELLOW}⚠️  API endpoint returned error (may be expected if no data)${NC}"
fi

echo ""
echo -e "${GREEN}✓ Deployment verification complete!${NC}"
echo -e "${YELLOW}🌐 Your API is available at: ${APP_URL}${NC}"
