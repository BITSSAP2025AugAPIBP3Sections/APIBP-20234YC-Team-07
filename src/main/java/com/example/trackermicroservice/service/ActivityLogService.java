package com.example.trackermicroservice.service;


import com.example.trackermicroservice.DTO.ActivityLogDTO;
import com.example.trackermicroservice.DTO.ActivityRecommendationDTO;
import com.example.trackermicroservice.entity.ActivityLog;
import com.example.trackermicroservice.repository.ActivityLogRepository;
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
import java.util.UUID;

@Service
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    @Autowired
    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
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
    public boolean checkPetExisistsOrNot(String petId, String authorizationToken) throws Exception{
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://a487d8b00bc6542ca91c2dd298684952-1223040857.us-east-1.elb.amazonaws.com/api/pets/"+petId;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authorizationToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getStatusCode().is2xxSuccessful();

    }
    public List<ActivityLogDTO> getActivityLogs(String petId, String authorizationTokern) throws Exception{
        if(validateUser(authorizationTokern) && activityLogRepository.getActivityLogs(petId).size() != 0){
            List<ActivityLog> activityLogs =  activityLogRepository.getActivityLogs(petId);
            List<ActivityLogDTO> activityLogDTOS = new ArrayList<>();
            for(ActivityLog activityLog : activityLogs){
                ActivityLogDTO activityLogDTO = new ActivityLogDTO(activityLog);
                activityLogDTOS.add(activityLogDTO);
            }
            return activityLogDTOS;
        }
        else
            throw new IllegalArgumentException("Pet not found");
    }

    public ActivityLogDTO addActivityLog(String petId, String authorizationToken, ActivityLogDTO activityLogDTO) throws Exception{
        ActivityLog activityLog = new ActivityLog(petId, activityLogDTO);
        if (checkPetExisistsOrNot(petId, authorizationToken) && activityLogRepository.save(activityLog) != null) {
            activityLogDTO.setLogId(activityLog.getLogId());
            return activityLogDTO;
        } else
            throw new IllegalArgumentException("Unable to add activity log, reason might be pet not found");
    }

    public ActivityLogDTO updateActivityLog(String petId, String authorizationTokern, UUID logId, ActivityLogDTO activityLogDTO) throws Exception{
        ActivityLog activityLog = new ActivityLog(petId, activityLogDTO);
        activityLog.setLogId(logId);
        activityLogDTO.setLogId(logId);
        if(validateUser(authorizationTokern) && activityLogRepository.getReferenceByLogIdAndPetId(logId,petId) != 0 && activityLogRepository.save(activityLog) != null) {
            return activityLogDTO;
        }
        else
            throw new IllegalArgumentException("Pet not found, if you want to add a new log use POST method");
    }

    public void deleteActivityLog(String petId, String authorizationTokern, UUID logId) throws Exception{
        if(validateUser(authorizationTokern) && activityLogRepository.getReferenceByLogIdAndPetId(logId,petId) != 0) {
            activityLogRepository.deleteById(logId);
        }
        else{
            throw new IllegalArgumentException("Pet not found");
        }
    }

    public List<ActivityRecommendationDTO> getActivityRecommendations(String  petId, String authorizationToken) throws Exception{
        validateUser(authorizationToken);
        List<ActivityLog> activityLogs = activityLogRepository.getActivityLogs(petId);
        List<ActivityRecommendationDTO> recommendations = new ArrayList<>();
        if(activityLogs.size() == 0){
            throw new IllegalArgumentException("No activity logs found for the pet");
        }
        for (ActivityLog log : activityLogs) {
            ActivityRecommendationDTO recommendation = new ActivityRecommendationDTO();
            recommendation.setPetId(log.getPetId());
            recommendation.setActivity(log.getActivity());

            // Generate recommendations based on past activity duration and distance
            double duration = Integer.parseInt(log.getDuration().replaceAll("[^0-9]", ""));
            double distance = Integer.parseInt(log.getDistance().replaceAll("[^0-9]", ""));

            if (duration < 30) {
                recommendation.setRecommendedDuration("Increase duration to 45 minutes for better health");
            } else {
                recommendation.setRecommendedDuration("Maintain duration at 30 minutes");
            }

            if (distance < 2) {
                recommendation.setRecommendedDistance("Increase distance to 3 km for better exercise");
            } else {
                recommendation.setRecommendedDistance("Maintain distance at 2 km");
            }

            recommendations.add(recommendation);
        }

        return recommendations;
    }
}
