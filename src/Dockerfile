# Use base node 12-slim image from Docker hub
FROM node:17-slim

WORKDIR /kubewatch

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the application csource code
COPY . .

# Run index.ts
ENTRYPOINT ["npm", "run", "start"]
