#!/bin/bash

# ============================================
# Monitoring and Logging Setup Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Vibe Holidays Monitoring Setup           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Get deployment URLs
read -p "Enter your backend URL (e.g., https://api.vibeholidays.com): " BACKEND_URL
read -p "Enter your frontend URL (e.g., https://vibeholidays.com): " FRONTEND_URL

echo ""
echo -e "${YELLOW}📊 Monitoring Setup Options:${NC}"
echo ""

# ============================================
# 1. UptimeRobot Setup
# ============================================
echo -e "${BLUE}1. UptimeRobot (Uptime Monitoring)${NC}"
echo "   - Free tier: 50 monitors, 5-minute intervals"
echo "   - Monitors website availability"
echo "   - Email/SMS alerts on downtime"
echo ""
echo "   Setup steps:"
echo "   1. Go to: https://uptimerobot.com"
echo "   2. Sign up for free account"
echo "   3. Add monitors:"
echo "      - Backend Health: ${BACKEND_URL}/health"
echo "      - Frontend: ${FRONTEND_URL}"
echo "   4. Configure email alerts"
echo ""
read -p "Press Enter when UptimeRobot is configured..."

# ============================================
# 2. Sentry Setup (Optional)
# ============================================
echo ""
echo -e "${BLUE}2. Sentry (Error Tracking) - Optional${NC}"
echo "   - Free tier: 5,000 errors/month"
echo "   - Real-time error tracking"
echo "   - Stack traces and context"
echo ""
read -p "Do you want to set up Sentry? (y/n): " SETUP_SENTRY

if [ "$SETUP_SENTRY" = "y" ]; then
    echo ""
    echo "   Setup steps:"
    echo "   1. Go to: https://sentry.io"
    echo "   2. Sign up for free account"
    echo "   3. Create new project: Node.js"
    echo "   4. Copy the DSN"
    echo ""
    read -p "   Enter Sentry DSN (or press Enter to skip): " SENTRY_DSN
    
    if [ -n "$SENTRY_DSN" ]; then
        echo ""
        echo "   Add this to your backend environment variables:"
        echo "   SENTRY_DSN=${SENTRY_DSN}"
        echo ""
        
        # If using Heroku
        read -p "   Are you using Heroku? (y/n): " USING_HEROKU
        if [ "$USING_HEROKU" = "y" ]; then
            read -p "   Enter Heroku app name: " HEROKU_APP
            heroku config:set SENTRY_DSN="${SENTRY_DSN}" --app "${HEROKU_APP}"
            echo -e "   ${GREEN}✓ Sentry DSN added to Heroku${NC}"
        fi
    fi
fi

# ============================================
# 3. Google Analytics Setup (Optional)
# ============================================
echo ""
echo -e "${BLUE}3. Google Analytics (User Analytics) - Optional${NC}"
echo "   - Free"
echo "   - Track user behavior"
echo "   - Page views, conversions, etc."
echo ""
read -p "Do you want to set up Google Analytics? (y/n): " SETUP_GA

if [ "$SETUP_GA" = "y" ]; then
    echo ""
    echo "   Setup steps:"
    echo "   1. Go to: https://analytics.google.com"
    echo "   2. Create account and property"
    echo "   3. Get Measurement ID (G-XXXXXXXXXX)"
    echo ""
    read -p "   Enter Google Analytics Measurement ID (or press Enter to skip): " GA_ID
    
    if [ -n "$GA_ID" ]; then
        echo ""
        echo "   Add this to your frontend environment variables:"
        echo "   VITE_GA_MEASUREMENT_ID=${GA_ID}"
        echo ""
        
        # If using Vercel
        read -p "   Are you using Vercel? (y/n): " USING_VERCEL
        if [ "$USING_VERCEL" = "y" ]; then
            cd frontend 2>/dev/null || true
            vercel env add VITE_GA_MEASUREMENT_ID production <<< "${GA_ID}"
            echo -e "   ${GREEN}✓ GA Measurement ID added to Vercel${NC}"
            echo "   Redeploy frontend to apply changes: vercel --prod"
            cd .. 2>/dev/null || true
        fi
    fi
fi

# ============================================
# 4. Log Management
# ============================================
echo ""
echo -e "${BLUE}4. Log Management${NC}"
echo ""
echo "   Platform-specific logging:"
echo ""
echo "   Heroku:"
echo "   - View logs: heroku logs --tail --app your-app-name"
echo "   - Add log drain: heroku drains:add <url> --app your-app-name"
echo ""
echo "   Vercel:"
echo "   - View logs in Vercel dashboard"
echo "   - Real-time logs during deployment"
echo ""
echo "   MongoDB Atlas:"
echo "   - View logs in Atlas dashboard"
echo "   - Set up alerts for slow queries"
echo ""

# ============================================
# 5. Database Monitoring
# ============================================
echo ""
echo -e "${BLUE}5. Database Monitoring${NC}"
echo ""
echo "   MongoDB Atlas provides built-in monitoring:"
echo "   1. Go to your cluster in Atlas"
echo "   2. Click 'Metrics' tab"
echo "   3. Monitor:"
echo "      - Connections"
echo "      - Operations per second"
echo "      - Query performance"
echo "      - Disk usage"
echo ""
echo "   Set up alerts:"
echo "   1. Go to 'Alerts' in Atlas"
echo "   2. Configure alerts for:"
echo "      - High connection count"
echo "      - Slow queries"
echo "      - Disk usage > 80%"
echo ""
read -p "Press Enter when database monitoring is configured..."

# ============================================
# 6. Backup Verification
# ============================================
echo ""
echo -e "${BLUE}6. Backup Verification${NC}"
echo ""
echo "   MongoDB Atlas automatic backups:"
echo "   1. Go to your cluster in Atlas"
echo "   2. Click 'Backup' tab"
echo "   3. Verify backup schedule is enabled"
echo "   4. Test restore procedure:"
echo "      - Download a backup"
echo "      - Restore to test cluster"
echo "      - Verify data integrity"
echo ""
read -p "Press Enter when backup is verified..."

# ============================================
# 7. Performance Monitoring
# ============================================
echo ""
echo -e "${BLUE}7. Performance Monitoring${NC}"
echo ""
echo "   Test your site performance:"
echo "   1. Google PageSpeed Insights:"
echo "      https://pagespeed.web.dev/?url=${FRONTEND_URL}"
echo ""
echo "   2. GTmetrix:"
echo "      https://gtmetrix.com/"
echo ""
echo "   3. WebPageTest:"
echo "      https://www.webpagetest.org/"
echo ""
echo "   Target metrics:"
echo "   - Page load time: < 3 seconds"
echo "   - Time to Interactive: < 5 seconds"
echo "   - Lighthouse score: > 90"
echo ""

# ============================================
# 8. Security Monitoring
# ============================================
echo ""
echo -e "${BLUE}8. Security Monitoring${NC}"
echo ""
echo "   Test your site security:"
echo "   1. SSL Labs:"
echo "      https://www.ssllabs.com/ssltest/analyze.html?d=${FRONTEND_URL#https://}"
echo ""
echo "   2. Security Headers:"
echo "      https://securityheaders.com/?q=${FRONTEND_URL}"
echo ""
echo "   3. Mozilla Observatory:"
echo "      https://observatory.mozilla.org/"
echo ""

# ============================================
# Summary
# ============================================
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Monitoring Setup Complete! 🎉     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Monitoring tools configured${NC}"
echo ""
echo -e "${YELLOW}📋 Monitoring Dashboard URLs:${NC}"
echo "  - UptimeRobot: https://uptimerobot.com/dashboard"
if [ -n "$SENTRY_DSN" ]; then
    echo "  - Sentry: https://sentry.io/organizations/your-org/issues/"
fi
if [ -n "$GA_ID" ]; then
    echo "  - Google Analytics: https://analytics.google.com"
fi
echo "  - MongoDB Atlas: https://cloud.mongodb.com"
echo ""
echo -e "${YELLOW}📊 Regular Monitoring Tasks:${NC}"
echo "  Daily:"
echo "    - Check UptimeRobot for downtime"
echo "    - Review error logs"
echo ""
echo "  Weekly:"
echo "    - Review analytics data"
echo "    - Check performance metrics"
echo "    - Review security logs"
echo ""
echo "  Monthly:"
echo "    - Update dependencies"
echo "    - Review database performance"
echo "    - Test backup restore"
echo ""
echo -e "${GREEN}Happy monitoring! 📊${NC}"
