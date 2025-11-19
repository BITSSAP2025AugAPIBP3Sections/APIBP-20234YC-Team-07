package com.example.trackermicroservice.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.trackermicroservice.service.HealthInsightsService;


@RestController
@RequestMapping("/api/health")
public class HealthInsightsController {
    private final HealthInsightsService healthInsightsService;

    @Autowired
    public HealthInsightsController(HealthInsightsService healthInsightsService) {
        this.healthInsightsService = healthInsightsService;
    }
    @GetMapping("/pet/{petId}/health/insights")
    public ResponseEntity<?> getHealthInsights(@RequestHeader("Authorization") String authorizationToken,@PathVariable("petId") String petId) {
        try{
            return ResponseEntity.ok(healthInsightsService.getHealthInsights(petId, authorizationToken));
        }
        catch(Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There are no logs with the given petId or authorization might be failed");
        }
    }
    @GetMapping("/user/{userId}/dashboard")
    public ResponseEntity<?> getUserDashBoard(@RequestHeader("Authorization") String authorizationToken, @PathVariable("userId") String userId) {
        try{
            return ResponseEntity.ok(healthInsightsService.getUserDashBoard(authorizationToken, userId));
        }
        catch(Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There are no pets with the given userId or authorization might be failed");
        }
    }
}
