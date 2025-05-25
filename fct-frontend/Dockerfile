# Example for a Node.js frontend
FROM node:23-alpine AS builder

WORKDIR /app

# Install Java Runtime Environment (JRE) - REQUIRED by openapi-generator-cli
RUN apk update && apk add --no-cache openjdk17-jre

# Copy the API spec from the shared location (relative to build context)
# This places openapi.yaml into /app/api-spec/openapi.yaml within the container.
COPY api-spec/openapi.yaml ./api-spec/openapi.yaml

# Copy package.json and lock file (relative to build context)
COPY fct-frontend/package.json ./
# Or yarn.lock
COPY fct-frontend/package-lock.json ./ 

# Copy generator configuration and tools (relative to build context)
COPY fct-frontend/openapitools.json ./
COPY fct-frontend/openapi-generator-config.json ./
COPY fct-frontend/ts-generator-axios.sh ./

# Ensure the script is executable
RUN chmod +x ./ts-generator-axios.sh && \
    # Install all dependencies
    npm install --legacy-peer-deps && \
    # Install the OpenAPI generator
    npm install @openapitools/openapi-generator-cli -g && \
    # Generate the API client
    npm run generate-api


# Run the code generation script.

# Copy the rest of the frontend source code (relative to build context)
COPY fct-frontend/public ./public
COPY fct-frontend/src ./src
COPY fct-frontend/index.html ./
COPY fct-frontend/vite.config.ts ./
COPY fct-frontend/tsconfig.json ./
COPY fct-frontend/tsconfig.app.json ./
COPY fct-frontend/tsconfig.node.json ./
COPY fct-frontend/components.json ./
COPY fct-frontend/eslint.config.js ./
# Add any other necessary files for the build

# Build the application
RUN npm run build --legacy-peer-deps

# --- Production Stage (example using Nginx) ---
FROM nginx:alpine

# 1) Remove the stock default.conf so it can’t override your settings
RUN rm -f /etc/nginx/conf.d/default.conf  

# 2) Copy in your custom default.conf 
COPY fct-frontend/default.conf /etc/nginx/conf.d/default.conf

# 3) Copy the built frontend application
COPY --from=builder /app/dist /usr/share/nginx/html 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
