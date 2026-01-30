#!/bin/bash

# ============================================
# Netlify Deployment Script for Vibe Holidays Frontend
# ============================================

set -e  # Exit on error

echo "🚀 Starting Netlify deployment for Vibe Holidays Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI is not installed. Installing...${NC}"
    npm install -g netlify-cli
fi

# Check if logged in to Netlify
if ! netlify status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Netlify. Please log in.${NC}"
    netlify login
fi

echo -e "${GREEN}✓ Netlify CLI ready${NC}"

# Get backend API URL
read -p "Enter your backend API URL (e.g., https://api.vibeholidays.com/api): " API_URL

# Check if site is already initialized
if [ ! -f ".netlify/state.json" ]; then
    echo -e "${YELLOW}📦 Initializing Netlify site...${NC}"
    netlify init
fi

# Set environment variables
echo -e "${YELLOW}🔧 Setting environment variables...${NC}"
netlify env:set VITE_API_URL "$API_URL"

# Optional: Set other environment variables
read -p "Enter Google Maps API Key (or press Enter to skip): " MAPS_KEY
if [ -n "$MAPS_KEY" ]; then
    netlify env:set VITE_GOOGLE_MAPS_API_KEY "$MAPS_KEY"
fi

read -p "Enter Google Analytics ID (or press Enter to skip): " GA_ID
if [ -n "$GA_ID" ]; then
    netlify env:set VITE_GA_MEASUREMENT_ID "$GA_ID"
fi

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# Deploy to production
echo -e "${YELLOW}📤 Deploying to Netlify...${NC}"
netlify deploy --prod --dir=dist

echo -e "${GREEN}✓ Deployment complete!${NC}"

# Get site URL
SITE_URL=$(netlify status | grep -o 'https://[^ ]*' | head -1)

if [ -n "$SITE_URL" ]; then
    echo -e "${GREEN}🌐 Your site is live at: $SITE_URL${NC}"
    
    # Verify deployment
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
    sleep 5  # Wait for deployment to propagate
    
    if curl -f -s "$SITE_URL" > /dev/null; then
        echo -e "${GREEN}✓ Site is accessible${NC}"
    else
        echo -e "${RED}❌ Site verification failed${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Configure custom domain in Netlify dashboard"
echo "2. Set up redirects if needed (netlify.toml)"
echo "3. Test all pages and functionality"
echo "4. Verify forms are submitting correctly"
echo "5. Check that images are loading"
echo ""
echo -e "${GREEN}✓ Deployment script complete!${NC}"
