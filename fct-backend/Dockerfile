# Example for a Spring Boot application
FROM openjdk:21-jdk-slim AS builder

WORKDIR /app

# Copy the API spec from the shared location into where your backend build expects it.
# For example, if openapi-generator-maven-plugin expects it in src/main/resources/api
COPY api-spec/openapi.yaml /app/src/main/resources/api/openapi.yaml

# Copy Maven wrapper files (relative to build context)
COPY fct-backend/mvnw .
COPY fct-backend/mvnw.cmd .
COPY fct-backend/pom.xml .
# If you have a .mvn directory for wrapper configuration
COPY fct-backend/.mvn ./.mvn

# Copy the backend source code (relative to build context)
COPY fct-backend/src ./src

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Run the build (which might include code generation from the copied spec)
# Ensure your pom.xml's openapi-generator-maven-plugin <inputSpec> points to
# src/main/resources/api/openapi.yaml (relative to pom.xml) or /app/src/main/resources/api/openapi.yaml (absolute)
RUN ./mvnw package -DskipTests

# For the final image
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
