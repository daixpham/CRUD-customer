# ── Stage 1: Build ─────────────────────────────────────────────────────────
FROM gradle:8-jdk17-alpine AS build

WORKDIR /app

COPY gradlew gradlew.bat settings.gradle build.gradle ./
COPY gradle ./gradle

RUN ./gradlew dependencies --no-daemon || true

COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

# ── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

