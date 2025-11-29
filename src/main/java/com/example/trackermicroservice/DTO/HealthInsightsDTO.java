package com.example.trackermicroservice.DTO;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class HealthInsightsDTO {
    private String petId;
    private double totalActivityDuration;
    private double totalActivityDistance;
    private double totalCaloriesConsumed;
    private String nutritionRecommendation;
    private String activityRecommendation;
    private int TotalActivityDays;
    private int TotalNutritionDays;
}
