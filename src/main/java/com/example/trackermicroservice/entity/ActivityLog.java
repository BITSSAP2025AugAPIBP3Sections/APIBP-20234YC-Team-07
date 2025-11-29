package com.example.trackermicroservice.entity;

import com.example.trackermicroservice.DTO.ActivityLogDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.context.annotation.Primary;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ActivityLog {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID logId;
    private String petId;
    private String activity;
    private String duration;
    private String distance;
    private String date;
    public ActivityLog(String petid, ActivityLogDTO activityLogDTO){
        this.petId = petid;
        this.logId = logId;
        this.activity = activityLogDTO.getActivity();
        this.duration = activityLogDTO.getDuration();
        this.distance = activityLogDTO.getDistance();
        this.date = activityLogDTO.getDate();
    }
}
