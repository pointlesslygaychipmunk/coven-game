#!/bin/bash
# Setup script for Coven development environment

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌙 Setting up Coven development environment 🌙${NC}"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo -e "${RED}Node.js is not installed. Please install Node.js v14+ before running this script.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}Node.js is installed: ${NODE_VERSION}${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo -e "${RED}npm is not installed. Please install npm before running this script.${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}npm is installed: ${NPM_VERSION}${NC}"

# Create missing directories if needed
echo -e "${BLUE}Creating directory structure if needed...${NC}"
mkdir -p shared/src
mkdir -p backend/src
mkdir -p frontend/src/components
mkdir -p frontend/src/utils
mkdir -p frontend/public/images/textures
mkdir -p frontend/public/images/plants
mkdir -p frontend/public/images/ingredients
mkdir -p frontend/public/images/potions
mkdir -p frontend/public/images/seeds
mkdir -p frontend/public/sounds

# Generate placeholder image for textures
echo -e "${BLUE}Creating placeholder textures...${NC}"
echo '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#f9f5ef" /><text x="50%" y="50%" font-family="serif" font-size="20" text-anchor="middle" fill="#d3b38e">Paper Texture</text></svg>' > frontend/public/images/textures/paper-texture.png

# Install root dependencies
echo -e "${BLUE}Installing root dependencies...${NC}"
npm init -y > /dev/null
npm install concurrently --save-dev > /dev/null

# Add scripts to package.json
echo -e "{\n  \"name\": \"coven-game\",\n  \"version\": \"1.0.0\",\n  \"private\": true,\n  \"scripts\": {\n    \"install:all\": \"npm install && cd shared && npm install && cd ../backend && npm install && cd ../frontend && npm install\",\n    \"build:shared\": \"cd shared && npm run build\",\n    \"build:backend\": \"cd backend && npm run build\",\n    \"build:frontend\": \"cd frontend && npm run build\",\n    \"build\": \"npm run build:shared && npm run build:backend && npm run build:frontend\",\n    \"dev\": \"concurrently \\\"cd backend && npm run dev\\\" \\\"cd frontend && npm run dev\\\"\"\n  },\n  \"devDependencies\": {\n    \"concurrently\": \"^8.2.0\"\n  }\n}" > package.json

# Install shared dependencies
echo -e "${BLUE}Installing shared dependencies...${NC}"
cd shared
npm init -y > /dev/null
npm install typescript --save-dev > /dev/null
cd ..

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm init -y > /dev/null
npm install express cors > /dev/null
npm install typescript @types/express @types/node @types/cors ts-node nodemon --save-dev > /dev/null
cd ..

# Install frontend dependencies (already fixed earlier)

# Create a sample placeholder image for testing
echo -e "${BLUE}Creating placeholder images...${NC}"
PLACEHOLDERS=("plants" "ingredients" "potions" "seeds")
for dir in "${PLACEHOLDERS[@]}"; do
  echo '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#e2ccb3" /><text x="50%" y="50%" font-family="serif" font-size="20" text-anchor="middle" fill="#4a201a">Placeholder</text><text x="50%" y="70%" font-family="serif" font-size="16" text-anchor="middle" fill="#4a201a">'$dir'</text></svg>' > frontend/public/images/$dir/unknown_item.png
done

# Create .env file for frontend
echo -e "VITE_API_URL=http://localhost:8080/api" > frontend/.env

# Setup nodemon.json for backend
echo -e "{\n  \"watch\": [\"src\", \"../shared/src\"],\n  \"ext\": \"ts,json\",\n  \"ignore\": [\"src/**/*.spec.ts\"],\n  \"exec\": \"ts-node --project tsconfig.json src/server.ts\"\n}" > backend/nodemon.json

# Add dev script to backend package.json
cd backend
npm pkg set scripts.dev="nodemon"
cd ..

echo -e "${GREEN}✅ Setup complete!${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Run ${BLUE}npm run install:all${NC} to install all dependencies"
echo -e "2. Run ${BLUE}npm run build:shared${NC} to build the shared types"
echo -e "3. Run ${BLUE}npm run dev${NC} to start the development servers"
echo
echo -e "${BLUE}Happy coding! 🌙${NC}"