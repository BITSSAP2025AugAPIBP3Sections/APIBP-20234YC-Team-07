package com.example.trackermicroservice.DTO;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
public class ActivityRecommendationDTO {
    private String petId;
    private String recommendedDuration;
    private String recommendedDistance;
    private String activity;
}
