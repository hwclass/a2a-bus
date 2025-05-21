FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json tsconfig.json ./
RUN npm install

# Copy source files
COPY src ./src

# Build TypeScript
RUN npm run build

# Set the entrypoint to run the compiled JavaScript
ENTRYPOINT ["npm", "run", "start"]