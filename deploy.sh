#!/bin/bash

echo "🚀 KSAin PWA Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    print_error "manifest.json not found. Please run this script from the ksainPWA directory."
    exit 1
fi

print_status "Checking PWA structure..."

# Check required files
required_files=("index.html" "manifest.json" "flutter_service_worker.js" "main.dart.js")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file found"
    else
        print_error "✗ $file missing"
        exit 1
    fi
done

print_status "Checking icons directory..."
if [ -d "icons" ]; then
    icon_count=$(ls -1 icons/*.png 2>/dev/null | wc -l)
    print_success "✓ Icons directory found with $icon_count icon files"
else
    print_error "✗ Icons directory missing"
    exit 1
fi

echo ""
print_status "PWA is ready for deployment!"
echo ""

echo "Choose deployment option:"
echo "1) Vercel"
echo "2) Netlify" 
echo "3) Firebase Hosting"
echo "4) Local test server"
echo "5) Show manual deployment instructions"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        print_status "Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            print_error "Vercel CLI not installed. Install with: npm i -g vercel"
            exit 1
        fi
        ;;
    2)
        print_status "Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir .
        else
            print_error "Netlify CLI not installed. Install with: npm i -g netlify-cli"
            exit 1
        fi
        ;;
    3)
        print_status "Deploying to Firebase Hosting..."
        if command -v firebase &> /dev/null; then
            firebase deploy
        else
            print_error "Firebase CLI not installed. Install with: npm i -g firebase-tools"
            print_status "Then run: firebase init hosting"
            exit 1
        fi
        ;;
    4)
        print_status "Starting local test server..."
        if command -v python3 &> /dev/null; then
            print_success "Starting Python HTTP server on port 8080..."
            print_warning "Press Ctrl+C to stop the server"
            echo ""
            print_success "🌐 Open in browser: http://localhost:8080"
            echo ""
            python3 -m http.server 8080
        elif command -v node &> /dev/null; then
            if command -v serve &> /dev/null; then
                print_success "Starting Node.js serve on port 8080..."
                serve -s . -l 8080
            else
                print_error "Neither Python3 nor 'serve' found. Install serve with: npm i -g serve"
                exit 1
            fi
        else
            print_error "No suitable HTTP server found. Install Python3 or Node.js"
            exit 1
        fi
        ;;
    5)
        echo ""
        print_status "Manual Deployment Instructions:"
        echo ""
        echo "📁 Upload these files to your web hosting provider:"
        echo "   - All files in this directory"
        echo "   - Ensure HTTPS is enabled"
        echo "   - Set index.html as the default document"
        echo ""
        echo "🌍 Popular hosting options:"
        echo "   • GitHub Pages (free)"
        echo "   • Vercel (free tier)"
        echo "   • Netlify (free tier)" 
        echo "   • Firebase Hosting (free tier)"
        echo "   • Cloudflare Pages (free)"
        echo ""
        echo "📱 PWA Requirements:"
        echo "   • HTTPS connection (required for PWA features)"
        echo "   • All files accessible via web"
        echo "   • No server-side processing needed (static files only)"
        ;;
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

if [ "$choice" != "4" ] && [ "$choice" != "5" ]; then
    echo ""
    print_success "🎉 Deployment completed!"
    echo ""
    print_status "Next steps:"
    echo "1. Test the deployed PWA in a browser"
    echo "2. Verify the install prompt appears after ~30 seconds"
    echo "3. Test push notifications (if configured)"
    echo "4. Check offline functionality"
    echo ""
    print_warning "Note: PWA features require HTTPS and may take time to propagate"
fi