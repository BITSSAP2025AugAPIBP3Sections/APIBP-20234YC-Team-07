package com.example.trackermicroservice.DTO;


import com.example.trackermicroservice.entity.ActivityLog;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Data
@Getter
@Setter
@NoArgsConstructor
public class ActivityLogDTO {
    private UUID logId;
    private String activity;
    private String duration;
    private String distance;
    private String date;
    public ActivityLogDTO(ActivityLog activityLog){
        this.logId = activityLog.getLogId();
        this.activity = activityLog.getActivity();
        this.duration = activityLog.getDuration();
        this.distance = activityLog.getDistance();
        this.date = activityLog.getDate();
    }
}