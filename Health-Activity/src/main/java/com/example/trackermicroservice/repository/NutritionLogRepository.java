package com.example.trackermicroservice.repository;


import com.example.trackermicroservice.entity.NutrionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NutritionLogRepository extends JpaRepository<NutrionLog, UUID> {
    @Query("SELECT n FROM NutrionLog n WHERE n.petId = :petId")
    List<NutrionLog> getNutritionLogs(String petId);
    @Query("select count(*) from NutrionLog n where n.logId = :logId and n.petId = :petId")
    int getReferenceByLogAndPetId(UUID logId, String petId);
}
