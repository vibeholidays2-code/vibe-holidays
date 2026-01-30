#!/bin/bash

# ============================================
# Full Stack Deployment Script for Vibe Holidays
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Vibe Holidays Full Stack Deployment      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Pre-deployment checks
echo -e "${YELLOW}📋 Running pre-deployment checks...${NC}"
echo ""

# Check if in project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Must run from project root directory${NC}"
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"

echo "  Backend tests..."
cd backend
if npm test -- --run > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Backend tests passed${NC}"
else
    echo -e "  ${RED}✗ Backend tests failed${NC}"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi
cd ..

echo "  Frontend tests..."
cd frontend
if npm test -- --run > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Frontend tests passed${NC}"
else
    echo -e "  ${YELLOW}⚠️  Frontend tests had issues${NC}"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi
cd ..

echo ""
echo -e "${GREEN}✓ Pre-deployment checks complete${NC}"
echo ""

# Deployment options
echo -e "${YELLOW}📦 Select deployment platform:${NC}"
echo "1. Heroku (Backend) + Vercel (Frontend)"
echo "2. DigitalOcean (Backend) + Netlify (Frontend)"
echo "3. Custom (Manual configuration)"
echo ""
read -p "Enter choice (1-3): " PLATFORM_CHOICE

case $PLATFORM_CHOICE in
    1)
        echo -e "${BLUE}Deploying to Heroku + Vercel...${NC}"
        
        # Backend deployment
        echo ""
        echo -e "${YELLOW}═══ Backend Deployment (Heroku) ═══${NC}"
        cd backend
        if [ -f "scripts/deploy-heroku.sh" ]; then
            bash scripts/deploy-heroku.sh
        else
            echo -e "${RED}❌ Heroku deployment script not found${NC}"
            exit 1
        fi
        cd ..
        
        # Get backend URL
        read -p "Enter deployed backend URL (e.g., https://your-app.herokuapp.com/api): " BACKEND_URL
        
        # Frontend deployment
        echo ""
        echo -e "${YELLOW}═══ Frontend Deployment (Vercel) ═══${NC}"
        cd frontend
        if [ -f "scripts/deploy-vercel.sh" ]; then
            bash scripts/deploy-vercel.sh
        else
            echo -e "${RED}❌ Vercel deployment script not found${NC}"
            exit 1
        fi
        cd ..
        ;;
        
    2)
        echo -e "${BLUE}Deploying to DigitalOcean + Netlify...${NC}"
        
        # Backend deployment
        echo ""
        echo -e "${YELLOW}═══ Backend Deployment (DigitalOcean) ═══${NC}"
        cd backend
        if [ -f "scripts/deploy-digitalocean.sh" ]; then
            bash scripts/deploy-digitalocean.sh
        else
            echo -e "${RED}❌ DigitalOcean deployment script not found${NC}"
            exit 1
        fi
        cd ..
        
        # Get backend URL
        read -p "Enter deployed backend URL (e.g., https://your-app.ondigitalocean.app/api): " BACKEND_URL
        
        # Frontend deployment
        echo ""
        echo -e "${YELLOW}═══ Frontend Deployment (Netlify) ═══${NC}"
        cd frontend
        if [ -f "scripts/deploy-netlify.sh" ]; then
            bash scripts/deploy-netlify.sh
        else
            echo -e "${RED}❌ Netlify deployment script not found${NC}"
            exit 1
        fi
        cd ..
        ;;
        
    3)
        echo -e "${YELLOW}Manual deployment selected${NC}"
        echo "Please follow the deployment guide in DEPLOYMENT.md"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Post-deployment verification
echo ""
echo -e "${YELLOW}🔍 Running post-deployment verification...${NC}"
echo ""

# Verify backend
echo -e "${YELLOW}Verifying backend...${NC}"
cd backend
if [ -f "scripts/verify-deployment.sh" ]; then
    bash scripts/verify-deployment.sh
fi
cd ..

# Verify frontend
echo ""
echo -e "${YELLOW}Verifying frontend...${NC}"
cd frontend
if [ -f "scripts/verify-deployment.sh" ]; then
    bash scripts/verify-deployment.sh
fi
cd ..

# Final summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Deployment Complete! 🎉            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Backend deployed and verified${NC}"
echo -e "${GREEN}✓ Frontend deployed and verified${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Configure custom domain"
echo "2. Set up monitoring (UptimeRobot, Sentry)"
echo "3. Configure database backups"
echo "4. Test all functionality manually"
echo "5. Update DNS records if needed"
echo "6. Notify team of deployment"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "  - Deployment Guide: DEPLOYMENT.md"
echo "  - Production Checklist: PRODUCTION_CHECKLIST.md"
echo "  - Monitoring Setup: docs/MONITORING_SETUP.md"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
