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
public class NutritionRecommendationDTO {
    private String petId;
    private String recommendation;
}
