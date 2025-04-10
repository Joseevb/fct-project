# ---- Stage 1: Build ----
FROM maven:3.9.9-eclipse-temurin-21 AS builder

# Set working directory
WORKDIR /app

# Copy Maven files first (for caching dependencies)
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the rest of the project
COPY . ./

# Build the application
RUN mvn clean package

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:21-jre AS runtime

# Set working directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Command to run the application
CMD ["java", "-jar", "app.jar"]
