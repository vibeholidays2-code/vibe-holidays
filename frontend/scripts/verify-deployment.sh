#!/bin/bash

# ============================================
# Frontend Deployment Verification Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Vibe Holidays Frontend Deployment Verification${NC}"
echo ""

# Get site URL
read -p "Enter your site URL (e.g., https://vibeholidays.com): " SITE_URL

# Remove trailing slash if present
SITE_URL=${SITE_URL%/}

echo ""
echo -e "${YELLOW}Testing pages and functionality...${NC}"
echo ""

# Test counter
PASSED=0
FAILED=0

# Function to test page
test_page() {
    local path=$1
    local description=$2
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$path")
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        ((FAILED++))
    fi
}

# Test main pages
test_page "/" "Homepage"
test_page "/packages" "Packages Page"
test_page "/gallery" "Gallery Page"
test_page "/contact" "Contact Page"
test_page "/about" "About Page"
test_page "/admin/login" "Admin Login Page"

# Test SSL certificate
echo -n "Testing SSL certificate... "
if [[ $SITE_URL == https://* ]]; then
    ssl_check=$(curl -s -I "$SITE_URL" 2>&1 | grep -i "SSL certificate" || echo "valid")
    if [[ $ssl_check != *"problem"* ]]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (SSL certificate issue)"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠ SKIPPED${NC} (Not HTTPS)"
fi

# Test response time
echo -n "Testing response time... "
response_time=$(curl -o /dev/null -s -w '%{time_total}' "$SITE_URL")
response_time_ms=$(echo "$response_time * 1000" | bc)
if (( $(echo "$response_time < 3.0" | bc -l) )); then
    echo -e "${GREEN}✓ PASSED${NC} (${response_time_ms}ms)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SLOW${NC} (${response_time_ms}ms, expected < 3000ms)"
fi

# Test security headers
echo -n "Testing security headers... "
security_headers=$(curl -s -I "$SITE_URL" | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security" | wc -l)
if [ "$security_headers" -ge 2 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Some security headers missing)"
fi

# Test meta tags
echo -n "Testing meta tags... "
meta_check=$(curl -s "$SITE_URL" | grep -i "<meta" | wc -l)
if [ "$meta_check" -ge 3 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Limited meta tags found)"
fi

# Test responsive viewport
echo -n "Testing viewport meta tag... "
viewport_check=$(curl -s "$SITE_URL" | grep -i "viewport" || echo "")
if [ -n "$viewport_check" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Viewport meta tag missing)"
    ((FAILED++))
fi

# Test favicon
echo -n "Testing favicon... "
favicon_response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/favicon.ico")
if [ "$favicon_response" -eq 200 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Favicon not found)"
fi

# Test robots.txt
echo -n "Testing robots.txt... "
robots_response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/robots.txt")
if [ "$robots_response" -eq 200 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (robots.txt not found)"
fi

# Test sitemap.xml
echo -n "Testing sitemap.xml... "
sitemap_response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/sitemap.xml")
if [ "$sitemap_response" -eq 200 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (sitemap.xml not found)"
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical tests passed! Deployment looks good.${NC}"
    echo ""
    echo -e "${YELLOW}📋 Recommended Manual Tests:${NC}"
    echo "  1. Test booking form submission"
    echo "  2. Test inquiry form submission"
    echo "  3. Test contact form submission"
    echo "  4. Test admin login and dashboard"
    echo "  5. Test package filtering and search"
    echo "  6. Test gallery image viewing"
    echo "  7. Test responsive design on mobile"
    echo "  8. Test cross-browser compatibility"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the deployment.${NC}"
    exit 1
fi
