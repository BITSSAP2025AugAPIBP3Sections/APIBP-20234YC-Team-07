package com.example.trackermicroservice.controller;


import com.example.trackermicroservice.DTO.ActivityLogDTO;
import com.example.trackermicroservice.DTO.ActivityRecommendationDTO;
import com.example.trackermicroservice.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/health/pet")
public class ActivityExerciseTrackingController {
    private final ActivityLogService activityLogService;
    @Autowired
    public ActivityExerciseTrackingController(ActivityLogService activityLogService){
        this.activityLogService = activityLogService;
    }
    @GetMapping("/{petId}/activity/logs")
    public ResponseEntity<?> getActivityLogs(@RequestHeader("Authorization") String authorizationToken,@PathVariable("petId") String petId) {
        try {
            return ResponseEntity.ok(activityLogService.getActivityLogs(petId, authorizationToken));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There are no logs with the given petId");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/{petId}/activity/recommendations")
    public ResponseEntity<?> getActivityRecommendations(@RequestHeader("Authorization") String authorizationToken,@PathVariable("petId") String petId) {
        try {
            return ResponseEntity.ok(activityLogService.getActivityRecommendations(petId, authorizationToken));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There are no logs with the given petId, so we can't give any recommendations");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/{petId}/activity/log")
    public ResponseEntity<?> addActivityLog(@RequestHeader("Authorization") String authorizationToken, @PathVariable("petId") String petId, @RequestBody ActivityLogDTO activityLogDTO) {
        try {
            return ResponseEntity.ok(activityLogService.addActivityLog(petId, authorizationToken, activityLogDTO));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pet not found");
        }
    }
    @PutMapping("/{petId}/activity/log/{logId}")
    public ResponseEntity<?> updateActivityLog(@RequestHeader("Authorization") String authorizationToken,@PathVariable("petId") String petId, @PathVariable("logId") UUID logId, @RequestBody ActivityLogDTO activityLogDTO) {
        try {
            return ResponseEntity.ok(activityLogService.updateActivityLog(petId, authorizationToken, logId, activityLogDTO));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There are no logs with the given petId and logId so we can't update the log");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("/{petId}/activity/log/{logId}")
    public ResponseEntity<?> deleteActivityLog(@RequestHeader("Authorization") String authorizationToken,@PathVariable("petId") String petId, @PathVariable("logId") UUID logId) {
        try {
            activityLogService.deleteActivityLog(petId, authorizationToken, logId);
            return ResponseEntity.ok("Log deleted Successfully");
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There are no logs with the given petId and logId so we can't delete the log");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
