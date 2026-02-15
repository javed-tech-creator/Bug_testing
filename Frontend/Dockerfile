# Use latest Node 20 Alpine (small and fast)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for caching npm install)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project
COPY . .

# Expose Vite default port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev"]
