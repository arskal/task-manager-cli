# Use the official lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install dependencies (none for now, but good practice)
RUN npm install

# Copy the rest of the app source code
COPY . .

# Default command: show help
CMD ["node", "index.js", "help"]
