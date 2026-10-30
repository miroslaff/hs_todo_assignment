# Use official Playwright base image (pre-loaded with browsers)
FROM mcr.microsoft.com/playwright:v1.49.1-jammy

# Set container working directory
WORKDIR /app

# Install git so we can clone the target app repository
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Clone the external target application
RUN git clone https://github.com/cypress-io/cypress-example-kitchensink.git

# Install application dependencies and build target app
RUN cd cypress-example-kitchensink && npm ci

# Copy root dependency manifests for tests
COPY package*.json ./

# Install Playwright test dependencies
RUN npm ci

# Copy local Playwright test files and configuration
COPY . .

# Start the target app on port 8080 and execute Playwright tests
CMD ["sh", "-c", "cd cypress-example-kitchensink && npm start & npx wait-on http://localhost:8080 && cd .. && npx playwright test"]