#!/bin/bash

# ============================================
# Deployment Verification Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Vibe Holidays Backend Deployment Verification${NC}"
echo ""

# Get API URL
read -p "Enter your API URL (e.g., https://api.vibeholidays.com): " API_URL

# Remove trailing slash if present
API_URL=${API_URL%/}

echo ""
echo -e "${YELLOW}Testing endpoints...${NC}"
echo ""

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response, expected $expected_status)"
        ((FAILED++))
    fi
}

# Test health endpoint
test_endpoint "/health" "Health Check" 200

# Test public API endpoints
test_endpoint "/api/packages" "Packages List" 200
test_endpoint "/api/gallery" "Gallery List" 200

# Test 404 handling
test_endpoint "/api/nonexistent" "404 Handling" 404

# Test CORS headers
echo -n "Testing CORS headers... "
cors_header=$(curl -s -I -H "Origin: https://example.com" "$API_URL/api/packages" | grep -i "access-control-allow-origin" || echo "")
if [ -n "$cors_header" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (CORS headers not found)"
    ((FAILED++))
fi

# Test SSL certificate
echo -n "Testing SSL certificate... "
if [[ $API_URL == https://* ]]; then
    ssl_check=$(curl -s -I "$API_URL" 2>&1 | grep -i "SSL certificate" || echo "valid")
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
response_time=$(curl -o /dev/null -s -w '%{time_total}' "$API_URL/api/packages")
response_time_ms=$(echo "$response_time * 1000" | bc)
if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✓ PASSED${NC} (${response_time_ms}ms)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SLOW${NC} (${response_time_ms}ms, expected < 2000ms)"
fi

# Test security headers
echo -n "Testing security headers... "
security_headers=$(curl -s -I "$API_URL/api/packages" | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security" | wc -l)
if [ "$security_headers" -ge 2 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Some security headers missing)"
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Deployment looks good.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the deployment.${NC}"
    exit 1
fi
