#!/bin/bash
###############################################################################
# DEPLOYMENT AUTOMATION SCRIPT
# Author: Hannes Mitterer
# Purpose: Automated deployment and verification of binary header system
###############################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BINARY_FILE="anchor_header.bin"
SCRIPTS_DIR="scripts"

# Print banner
echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}   BARBADOS-ROOT BINARY HEADER DEPLOYMENT SYSTEM${NC}"
echo -e "${BLUE}   Author: Hannes Mitterer${NC}"
echo -e "${BLUE}================================================================${NC}"
echo ""

# Check if binary file exists
if [ ! -f "$BINARY_FILE" ]; then
    echo -e "${RED}Error: Binary file '$BINARY_FILE' not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Binary file found: $BINARY_FILE${NC}"
echo ""

# Step 1: IPFS Validation
echo -e "${YELLOW}[STEP 1] Running IPFS Validation...${NC}"
echo "================================================================"
python3 "$SCRIPTS_DIR/ipfs_validation.py" "$BINARY_FILE"
echo ""

# Step 2: Blockchain Timestamp
echo -e "${YELLOW}[STEP 2] Creating Blockchain Timestamp...${NC}"
echo "================================================================"
python3 "$SCRIPTS_DIR/blockchain_timestamp.py" "$BINARY_FILE"
echo ""

# Step 3: Heartbeat Sync
echo -e "${YELLOW}[STEP 3] Synchronizing with Node Network...${NC}"
echo "================================================================"
python3 "$SCRIPTS_DIR/heartbeat_sync.py" "$BINARY_FILE"
echo ""

# Step 4: Final Verification
echo -e "${YELLOW}[STEP 4] Final Verification...${NC}"
echo "================================================================"

# Check if all output files were created
VALIDATION_REPORT="ipfs_validation_report.json"
BLOCKCHAIN_TIMESTAMP="blockchain_timestamp.json"
HEARTBEAT_SYNC="heartbeat_sync_report.json"

all_files_exist=true

if [ -f "$VALIDATION_REPORT" ]; then
    echo -e "${GREEN}✓ IPFS Validation Report: $VALIDATION_REPORT${NC}"
else
    echo -e "${RED}✗ Missing: $VALIDATION_REPORT${NC}"
    all_files_exist=false
fi

if [ -f "$BLOCKCHAIN_TIMESTAMP" ]; then
    echo -e "${GREEN}✓ Blockchain Timestamp: $BLOCKCHAIN_TIMESTAMP${NC}"
else
    echo -e "${RED}✗ Missing: $BLOCKCHAIN_TIMESTAMP${NC}"
    all_files_exist=false
fi

if [ -f "$HEARTBEAT_SYNC" ]; then
    echo -e "${GREEN}✓ Heartbeat Sync Report: $HEARTBEAT_SYNC${NC}"
else
    echo -e "${RED}✗ Missing: $HEARTBEAT_SYNC${NC}"
    all_files_exist=false
fi

echo ""
echo "================================================================"

if [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
    echo -e "${GREEN}All components deployed and verified.${NC}"
    echo ""
    echo "Generated Files:"
    echo "  - $VALIDATION_REPORT"
    echo "  - $BLOCKCHAIN_TIMESTAMP"
    echo "  - $HEARTBEAT_SYNC"
    echo ""
    echo "Binary Header: $BINARY_FILE"
    echo "SHA-256 Hash: $(sha256sum $BINARY_FILE | awk '{print $1}')"
    echo ""
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}   DEPLOYMENT COMPLETE - HANNES MITTERER${NC}"
    echo -e "${BLUE}================================================================${NC}"
    exit 0
else
    echo -e "${RED}❌ DEPLOYMENT FAILED!${NC}"
    echo -e "${RED}Some components are missing. Please check the logs above.${NC}"
    echo ""
    exit 1
fi
