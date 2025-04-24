# ---- Stage 1: Build ----
FROM maven:3.9.9-eclipse-temurin-21 AS builder

# Set working directory
WORKDIR /app

# Copy Maven files first (for caching dependencies)
COPY ./fct-backend/pom.xml ./
RUN mvn dependency:go-offline

# Copy the rest of the project
COPY ./fct-backend/ ./

COPY ./api-spec/openapi.yaml ./src/main/resources/openapi/openapi.yaml

# Build the application
RUN mvn clean package -DskipTests

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:21-jre AS runtime

# Set working directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar
# COPY ./wait-for-it.sh /wait-for-it.sh

EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
