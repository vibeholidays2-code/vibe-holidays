#!/bin/bash

# ============================================
# Production Deployment Verification Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Production Deployment Verification       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Get deployment URLs
read -p "Enter your backend URL (e.g., https://api.vibeholidays.com): " BACKEND_URL
read -p "Enter your frontend URL (e.g., https://vibeholidays.com): " FRONTEND_URL

# Remove trailing slashes
BACKEND_URL=${BACKEND_URL%/}
FRONTEND_URL=${FRONTEND_URL%/}

echo ""
echo -e "${YELLOW}🔍 Starting verification tests...${NC}"
echo ""

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

# ============================================
# Backend Tests
# ============================================
echo -e "${BLUE}═══ Backend Tests ═══${NC}"
echo ""

# Test 1: Health Check
echo -n "1. Health check endpoint... "
if curl -f -s "${BACKEND_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "   Backend health check failed. Is the server running?"
    ((FAILED++))
fi

# Test 2: API Packages Endpoint
echo -n "2. Packages API endpoint... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/packages")
if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (HTTP $RESPONSE)"
    echo "   Packages endpoint returned $RESPONSE (may be expected if no data)"
    ((WARNINGS++))
fi

# Test 3: CORS Headers
echo -n "3. CORS configuration... "
CORS_HEADER=$(curl -s -I -H "Origin: ${FRONTEND_URL}" "${BACKEND_URL}/api/packages" | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_HEADER" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "   CORS headers not found. Frontend may not be able to access API."
    ((FAILED++))
fi

# Test 4: SSL Certificate
echo -n "4. SSL certificate... "
if curl -s -I "${BACKEND_URL}" | grep -q "HTTP/2 200\|HTTP/1.1 200"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "   SSL verification had issues"
    ((WARNINGS++))
fi

# ============================================
# Frontend Tests
# ============================================
echo ""
echo -e "${BLUE}═══ Frontend Tests ═══${NC}"
echo ""

# Test 5: Homepage
echo -n "5. Homepage loads... "
if curl -f -s "${FRONTEND_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "   Homepage failed to load"
    ((FAILED++))
fi

# Test 6: Packages Page
echo -n "6. Packages page... "
if curl -f -s "${FRONTEND_URL}/packages" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "   Packages page may not be accessible"
    ((WARNINGS++))
fi

# Test 7: Admin Login Page
echo -n "7. Admin login page... "
if curl -f -s "${FRONTEND_URL}/admin/login" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "   Admin login page may not be accessible"
    ((WARNINGS++))
fi

# Test 8: SSL Certificate
echo -n "8. Frontend SSL... "
if curl -s -I "${FRONTEND_URL}" | grep -q "HTTP/2 200\|HTTP/1.1 200"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "   SSL verification had issues"
    ((WARNINGS++))
fi

# ============================================
# Security Tests
# ============================================
echo ""
echo -e "${BLUE}═══ Security Tests ═══${NC}"
echo ""

# Test 9: HTTPS Redirect
echo -n "9. HTTPS redirect... "
HTTP_URL="${FRONTEND_URL/https:/http:}"
REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" -L "${HTTP_URL}" 2>/dev/null || echo "000")
if [ "$REDIRECT" = "200" ] || [ "$REDIRECT" = "301" ] || [ "$REDIRECT" = "308" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "   HTTPS redirect may not be configured"
    ((WARNINGS++))
fi

# Test 10: Security Headers
echo -n "10. Security headers... "
HEADERS=$(curl -s -I "${FRONTEND_URL}" | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security" || echo "")
if [ -n "$HEADERS" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "   Some security headers may be missing"
    ((WARNINGS++))
fi

# ============================================
# Performance Tests
# ============================================
echo ""
echo -e "${BLUE}═══ Performance Tests ═══${NC}"
echo ""

# Test 11: Response Time
echo -n "11. Backend response time... "
START_TIME=$(date +%s%N)
curl -s "${BACKEND_URL}/health" > /dev/null
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
if [ $RESPONSE_TIME -lt 1000 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (${RESPONSE_TIME}ms)"
    ((PASSED++))
elif [ $RESPONSE_TIME -lt 3000 ]; then
    echo -e "${YELLOW}⚠ WARNING${NC} (${RESPONSE_TIME}ms)"
    echo "   Response time is acceptable but could be improved"
    ((WARNINGS++))
else
    echo -e "${RED}✗ FAILED${NC} (${RESPONSE_TIME}ms)"
    echo "   Response time is too slow (> 3 seconds)"
    ((FAILED++))
fi

# Test 12: Frontend Load Time
echo -n "12. Frontend load time... "
START_TIME=$(date +%s%N)
curl -s "${FRONTEND_URL}" > /dev/null
END_TIME=$(date +%s%N)
LOAD_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
if [ $LOAD_TIME -lt 3000 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (${LOAD_TIME}ms)"
    ((PASSED++))
elif [ $LOAD_TIME -lt 5000 ]; then
    echo -e "${YELLOW}⚠ WARNING${NC} (${LOAD_TIME}ms)"
    echo "   Load time is acceptable but could be improved"
    ((WARNINGS++))
else
    echo -e "${RED}✗ FAILED${NC} (${LOAD_TIME}ms)"
    echo "   Load time is too slow (> 5 seconds)"
    ((FAILED++))
fi

# ============================================
# Summary
# ============================================
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Verification Summary               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASSED"
echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "  ${RED}Failed:${NC}   $FAILED"
echo ""

TOTAL=$((PASSED + WARNINGS + FAILED))
SCORE=$((PASSED * 100 / TOTAL))

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Deployment is healthy. 🎉${NC}"
elif [ $FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠ Deployment is functional but has some warnings.${NC}"
    echo "  Review warnings above and address if needed."
else
    echo -e "${RED}✗ Deployment has critical issues that need attention.${NC}"
    echo "  Review failed tests above and fix before going live."
fi

echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo "  1. Fix failed tests (critical)"
    echo "  2. Review deployment logs"
    echo "  3. Check environment variables"
    echo "  4. Re-run verification"
elif [ $WARNINGS -gt 0 ]; then
    echo "  1. Review warnings (optional improvements)"
    echo "  2. Test manually in browser"
    echo "  3. Set up monitoring"
    echo "  4. Announce deployment"
else
    echo "  1. Test manually in browser"
    echo "  2. Set up monitoring (run: bash scripts/setup-monitoring.sh)"
    echo "  3. Configure custom domain (if not done)"
    echo "  4. Announce deployment to team"
fi

echo ""
echo -e "${YELLOW}🔗 Useful Links:${NC}"
echo "  - Frontend: ${FRONTEND_URL}"
echo "  - Backend API: ${BACKEND_URL}/api"
echo "  - Admin Dashboard: ${FRONTEND_URL}/admin"
echo "  - API Health: ${BACKEND_URL}/health"
echo ""
echo -e "${YELLOW}📊 Performance Testing:${NC}"
echo "  - PageSpeed: https://pagespeed.web.dev/?url=${FRONTEND_URL}"
echo "  - SSL Test: https://www.ssllabs.com/ssltest/analyze.html?d=${FRONTEND_URL#https://}"
echo "  - Security Headers: https://securityheaders.com/?q=${FRONTEND_URL}"
echo ""

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
