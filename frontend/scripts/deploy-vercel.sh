#!/bin/bash

# ============================================
# Vercel Deployment Script for Vibe Holidays Frontend
# ============================================

set -e  # Exit on error

echo "🚀 Starting Vercel deployment for Vibe Holidays Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI is not installed. Installing...${NC}"
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please log in.${NC}"
    vercel login
fi

echo -e "${GREEN}✓ Vercel CLI ready${NC}"

# Get backend API URL
read -p "Enter your backend API URL (e.g., https://api.vibeholidays.com/api): " API_URL

# Confirm deployment
echo ""
echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  - Backend API: $API_URL"
echo "  - Environment: Production"
echo ""
read -p "Continue with deployment? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi

# Set environment variables
echo -e "${YELLOW}🔧 Setting environment variables...${NC}"
vercel env add VITE_API_URL production <<< "$API_URL"

# Optional: Set other environment variables
read -p "Enter Google Maps API Key (or press Enter to skip): " MAPS_KEY
if [ -n "$MAPS_KEY" ]; then
    vercel env add VITE_GOOGLE_MAPS_API_KEY production <<< "$MAPS_KEY"
fi

read -p "Enter Google Analytics ID (or press Enter to skip): " GA_ID
if [ -n "$GA_ID" ]; then
    vercel env add VITE_GA_MEASUREMENT_ID production <<< "$GA_ID"
fi

# Deploy to production
echo -e "${YELLOW}📤 Deploying to Vercel...${NC}"
vercel --prod

echo -e "${GREEN}✓ Deployment complete!${NC}"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --prod | grep -o 'https://[^ ]*' | head -1)

if [ -n "$DEPLOYMENT_URL" ]; then
    echo -e "${GREEN}🌐 Your site is live at: $DEPLOYMENT_URL${NC}"
    
    # Verify deployment
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
    sleep 5  # Wait for deployment to propagate
    
    if curl -f -s "$DEPLOYMENT_URL" > /dev/null; then
        echo -e "${GREEN}✓ Site is accessible${NC}"
    else
        echo -e "${RED}❌ Site verification failed${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Configure custom domain in Vercel dashboard"
echo "2. Test all pages and functionality"
echo "3. Verify forms are submitting correctly"
echo "4. Check that images are loading"
echo "5. Test responsive design on mobile"
echo ""
echo -e "${GREEN}✓ Deployment script complete!${NC}"
