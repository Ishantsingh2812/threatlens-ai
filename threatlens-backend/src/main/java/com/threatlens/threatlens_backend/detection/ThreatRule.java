package com.threatlens.threatlens_backend.detection;


import com.threatlens.threatlens_backend.entity.Log;
import com.threatlens.threatlens_backend.entity.Threat;

public interface ThreatRule {

    Threat detect(Log log);
}