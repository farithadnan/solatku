#!/bin/bash

# Variables
IMAGE_NAME="solatku-image"
CONTAINER_NAME="solatku-container"
PORT=8080

# Ansi codes
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}📦 Starting Deployment...${NC}"

# Stop the existing container
echo ""
echo -e "${YELLOW}🛑 Stopping the existing container...${NC}"
docker stop $CONTAINER_NAME

# Remove the existing container
echo ""
echo -e "${YELLOW}🗑️\u00A0 Removing the existing container...${NC}"
docker rm $CONTAINER_NAME

# Remove the existing image
echo ""
echo -e "${YELLOW}🗑️\u00A0 Removing the existing image...${NC}"
docker rmi $IMAGE_NAME

# Build the new image
echo ""
echo -e "${YELLOW}🔨 Building the new image...${NC}"
docker build -t $IMAGE_NAME .

# Run the new container
echo ""
echo -e "${YELLOW}🚀 Running the new container...${NC}"
docker run -d -p $PORT:8080 --name $CONTAINER_NAME $IMAGE_NAME

# Done
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
