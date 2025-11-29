package com.example.trackermicroservice.service;


import com.example.trackermicroservice.DTO.HealthInsightsDTO;
import com.example.trackermicroservice.entity.ActivityLog;
import com.example.trackermicroservice.entity.NutrionLog;
import com.example.trackermicroservice.repository.ActivityLogRepository;
import com.example.trackermicroservice.repository.NutritionLogRepository;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;


@Service
public class HealthInsightsService {

    private final ActivityLogRepository activityLogRepository;
    private final NutritionLogRepository nutritionLogRepository;
    @Autowired
    public HealthInsightsService(ActivityLogRepository activityLogRepository, NutritionLogRepository nutritionLogRepository) {
        this.activityLogRepository = activityLogRepository;
        this.nutritionLogRepository = nutritionLogRepository;
    }
    public boolean validateUser(String authorizationToken) throws Exception{
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://a487d8b00bc6542ca91c2dd298684952-1223040857.us-east-1.elb.amazonaws.com/api/users/verify-token";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authorizationToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getStatusCode().is2xxSuccessful();
    }

    public HealthInsightsDTO getHealthInsights(String petId, String authorizationToken) throws Exception{
        if(validateUser(authorizationToken)&&activityLogRepository.getActivityLogs(petId) != null && nutritionLogRepository.getNutritionLogs(petId) != null) {
            List<ActivityLog> activityLogs = activityLogRepository.getActivityLogs(petId);
            List<NutrionLog> nutritionLogs = nutritionLogRepository.getNutritionLogs(petId);


            int numberOfActivityLogs = activityLogs.size();
            int numberOfNutritionLogs = nutritionLogs.size();
            double totalActivityDuration = 0;
            double totalActivityDistance = 0;
            for(ActivityLog activityLog : activityLogs){
                totalActivityDuration += Integer.parseInt(activityLog.getDuration().replaceAll("[^0-9]", ""));
                totalActivityDistance += Integer.parseInt(activityLog.getDistance().replaceAll("[^0-9]", ""));
            }
            double totalCaloriesConsumed = nutritionLogs.stream()
                    .mapToDouble(NutrionLog::getCalories)
                    .sum();

            String nutritionRecommendation = deriveNutritionRecommendation(totalCaloriesConsumed, numberOfNutritionLogs);
            String activityRecommendation = deriveActivityRecommendation(totalActivityDuration, totalActivityDistance, numberOfActivityLogs);

            HealthInsightsDTO healthInsightsDTO = new HealthInsightsDTO();
            healthInsightsDTO.setPetId(petId);
            healthInsightsDTO.setTotalActivityDays(numberOfActivityLogs);
            healthInsightsDTO.setTotalNutritionDays(numberOfNutritionLogs);
            healthInsightsDTO.setTotalActivityDuration(totalActivityDuration);
            healthInsightsDTO.setTotalActivityDistance(totalActivityDistance);
            healthInsightsDTO.setTotalCaloriesConsumed(totalCaloriesConsumed);
            healthInsightsDTO.setNutritionRecommendation(nutritionRecommendation);
            healthInsightsDTO.setActivityRecommendation(activityRecommendation);

            return healthInsightsDTO;
        }
        else
            throw new IllegalArgumentException("Pet not found");
    }
    private String deriveNutritionRecommendation(double totalCaloriesConsumed, int numberOfNutritionLogs) {
        double averageCaloriesPerLog = totalCaloriesConsumed / numberOfNutritionLogs;

        if (averageCaloriesPerLog < 200) {
            return "Increase calorie intake to ensure proper nutrition.";
        } else if (averageCaloriesPerLog >= 200 && averageCaloriesPerLog <= 500) {
            return "Calorie intake is within the normal range. Maintain current diet.";
        } else {
            return "Reduce calorie intake to avoid overfeeding.";
        }
    }


    private String deriveActivityRecommendation(double totalActivityDuration, double totalActivityDistance, int numberOfActivityLogs) {
        double averageDurationPerLog = (double) totalActivityDuration / numberOfActivityLogs;
        double averageDistancePerLog = (double) totalActivityDistance / numberOfActivityLogs;

        if (averageDurationPerLog < 30) {
            return "Increase activity duration to at least 30 minutes per session.";
        } else if (averageDistancePerLog < 2) {
            return "Increase activity distance to at least 2 kilometers per session.";
        } else {
            return "Activity levels are adequate. Maintain current routine.";
        }
    }

    public List<HealthInsightsDTO> getUserDashBoard(String authorizationToken, String userId) throws Exception{
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://a487d8b00bc6542ca91c2dd298684952-1223040857.us-east-1.elb.amazonaws.com/api/pets";
        HttpHeaders headers = new HttpHeaders();
         headers.setBearerAuth(authorizationToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> ids = new ArrayList<>();
        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            for (JsonNode node : rootNode) {
                String id = node.get("_id").asText();
                ids.add(id);
            }
        } catch (JacksonException e) {
            throw new IllegalArgumentException("Invalid response from user service");
        }
        List<HealthInsightsDTO> healthInsightsDTOS = new ArrayList<>();
        for (String id : ids) {
            healthInsightsDTOS.add(getHealthInsights(id,authorizationToken));
        }
        return healthInsightsDTOS;
    }
}
