FROM eclipse-temurin:17-jre
ADD target/healthactivityservice.jar healthactivityservice.jar
EXPOSE 80
ENTRYPOINT ["java", "-jar", "/healthactivityservice.jar"]
 