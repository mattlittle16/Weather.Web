#!/bin/bash

##############################################################################
# Little Weather - Production Deployment Script
# 
# This script builds the React app and deploys it to AWS S3 + CloudFront
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TERRAFORM_DIR="$PROJECT_ROOT/terraform"
BUILD_DIR="$PROJECT_ROOT/dist"

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}  Little Weather Deployment${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

# Check if we're in the correct directory
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if terraform outputs are available
if [ ! -f "$TERRAFORM_DIR/terraform.tfstate" ]; then
    print_error "Terraform state not found. Please run 'terraform apply' first."
    exit 1
fi

print_info "Retrieving deployment configuration from Terraform..."

# Get values from Terraform outputs
cd "$TERRAFORM_DIR"
S3_BUCKET=$(terraform output -raw s3_bucket_id 2>/dev/null)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null)
SITE_URL=$(terraform output -raw site_url 2>/dev/null)

if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_ID" ]; then
    print_error "Failed to retrieve Terraform outputs. Ensure infrastructure is deployed."
    exit 1
fi

print_success "Deployment targets:"
echo "  S3 Bucket: $S3_BUCKET"
echo "  CloudFront: $CLOUDFRONT_ID"
echo "  Site URL: $SITE_URL"
echo ""

# Return to project root
cd "$PROJECT_ROOT"

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    print_info "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
    print_success "Previous build cleaned"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
fi

# Build the React app
print_info "Building React app for production..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_success "Build completed successfully"

# Check AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
print_info "Checking AWS credentials..."
if ! aws sts get-caller-identity --no-cli-pager &> /dev/null; then
    print_error "AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi
print_success "AWS credentials verified"

# Sync to S3
print_info "Uploading files to S3..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET/" \
    --delete \
    --no-cli-pager \
    --exclude ".DS_Store" \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.html"

# Upload HTML files with no-cache (for SPA updates)
print_info "Uploading HTML files with no-cache headers..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET/" \
    --no-cli-pager \
    --exclude "*" \
    --include "*.html" \
    --cache-control "public, max-age=0, must-revalidate"

print_success "Files uploaded to S3"

# Invalidate CloudFront cache
print_info "Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_ID" \
    --paths "/*" \
    --no-cli-pager \
    --query 'Invalidation.Id' \
    --output text)

print_success "CloudFront invalidation created: $INVALIDATION_ID"

# Wait for invalidation (optional - can be commented out if you don't want to wait)
print_info "Waiting for CloudFront invalidation to complete..."
echo "  (This may take 2-5 minutes. You can Ctrl+C to skip waiting.)"

aws cloudfront wait invalidation-completed \
    --distribution-id "$CLOUDFRONT_ID" \
    --id "$INVALIDATION_ID" \
    --no-cli-pager 2>/dev/null || {
    print_warning "Invalidation is processing in the background"
}

# Summary
echo ""
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}  Deployment Complete! 🎉${NC}"
echo -e "${GREEN}=================================${NC}"
echo ""
echo -e "Your app is now live at:"
echo -e "${BLUE}${SITE_URL}${NC}"
echo ""
echo -e "Deployment details:"
echo "  • Build files: $(du -sh "$BUILD_DIR" | cut -f1)"
echo "  • S3 Bucket: $S3_BUCKET"
echo "  • CloudFront: $CLOUDFRONT_ID"
echo "  • Invalidation: $INVALIDATION_ID"
echo ""
print_info "Note: CloudFront propagation may take 2-5 minutes."
echo ""
