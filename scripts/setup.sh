#!/bin/bash

# SmartHire Frontend Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up SmartHire Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Create environment file
setup_env() {
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cat > .env << EOF
# SmartHire Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=10000
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=SmartHire
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_DEBUG_MODE=true
EOF
        print_success ".env file created"
    else
        print_warning ".env file already exists"
    fi
}

# Check if backend is running
check_backend() {
    print_status "Checking backend connection..."
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        print_success "Backend is running on http://localhost:5000"
    else
        print_warning "Backend is not running on http://localhost:5000"
        print_warning "Please start the Flask backend before running the frontend"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p public/images
    mkdir -p src/components
    mkdir -p src/utils
    mkdir -p src/hooks
    print_success "Directories created"
}

# Setup Git hooks (optional)
setup_git_hooks() {
    if [ -d .git ]; then
        print_status "Setting up Git hooks..."
        mkdir -p .git/hooks
        
        # Pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."
npm run lint
npm run test -- --watchAll=false
EOF
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configured"
    fi
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend server:"
    echo "   cd .. && python app.py"
    echo ""
    echo "2. Start the frontend development server:"
    echo "   npm start"
    echo ""
    echo "3. Open your browser and navigate to:"
    echo "   http://localhost:3000"
    echo ""
    echo "4. For Docker development:"
    echo "   docker-compose -f docker-compose.dev.yml up"
    echo ""
    echo "5. For production build:"
    echo "   npm run build"
    echo ""
    echo "📚 Documentation: README.md"
    echo "🐛 Issues: Check the console for any errors"
}

# Main setup function
main() {
    echo "=========================================="
    echo "    SmartHire Frontend Setup Script"
    echo "=========================================="
    echo ""
    
    check_node
    check_npm
    install_dependencies
    setup_env
    create_directories
    setup_git_hooks
    check_backend
    
    show_next_steps
}

# Run main function
main "$@" 