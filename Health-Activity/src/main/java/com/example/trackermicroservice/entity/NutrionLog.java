package com.example.trackermicroservice.entity;


import com.example.trackermicroservice.DTO.NutritionLogDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class NutrionLog {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID logId;
    private String petId;
    private Date date;
    private String food;
    private double calories;
    private double protein;
    private double fat;
    private double fiber;
    private double carbohydrates;
    private double weight;
    public NutrionLog(String petId, NutritionLogDTO nutritionLogDTO){
        this.petId = petId;
        this.date = nutritionLogDTO.getDate();
        this.food = nutritionLogDTO.getFood();
        this.calories = nutritionLogDTO.getCalories();
        this.protein = nutritionLogDTO.getProtein();
        this.fat = nutritionLogDTO.getFat();
        this.fiber = nutritionLogDTO.getFiber();
        this.carbohydrates = nutritionLogDTO.getCarbohydrates();
        this.weight = nutritionLogDTO.getWeight();
    }
}
