package com.example.trackermicroservice.repository;



import com.example.trackermicroservice.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog,UUID> {
    @Query("SELECT a FROM ActivityLog a WHERE a.petId = :petId")
    List<ActivityLog> getActivityLogs(String petId);
    @Query("select count(*) from ActivityLog a where a.logId = :logId and a.petId = :petId")
    Integer getReferenceByLogIdAndPetId(UUID logId, String  petId);

}
