# Stage 1: Builder
FROM node:23.9 AS builder

# Set working directory
WORKDIR /app

# Install Java (required for OpenAPI Generator CLI)
# Install OpenAPI Generator CLI globally
RUN apt-get update && \
    apt-get install -y openjdk-17-jre-headless && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g @openapitools/openapi-generator-cli

# Copy package.json and package-lock.json
COPY ./fct-frontend/package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application files
COPY ./fct-frontend/ .

# COPY ./api-spec/openapi.yaml /app/api-spec/openapi.yaml

# Generate API code
# Build the application
# RUN npm run generate-api && \
#     npm run build --legacy-peer-deps
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy build output to Nginx's html directory
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
