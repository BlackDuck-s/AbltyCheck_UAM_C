# Etapa 1: Construcción (Usamos Maven para compilar tu .jar)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copiamos tus archivos
COPY pom.xml .
COPY src ./src
# Compilamos saltando los tests para que sea más rápido
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución (Una imagen más ligera solo para correr Java)
FROM eclipse-temurin:17-jre
WORKDIR /app
# Traemos el .jar que se compiló en la etapa 1
COPY --from=build /app/target/*.jar app.jar
# Exponemos el puerto de Spring Boot
EXPOSE 8080
# Comando para encender el servidor
ENTRYPOINT ["java", "-jar", "app.jar"]