package com.threatlens.threatlens_backend.repository;


import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.entity.ThreatStatus;
import com.threatlens.threatlens_backend.entity.ThreatType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThreatRepository extends JpaRepository<Threat, Long> {

    List<Threat> findByStatus(ThreatStatus status);

    List<Threat> findBySourceIp(String sourceIp);

    boolean existsByThreatTypeAndSourceIpAndStatus(
            ThreatType threatType,
            String sourceIp,
            ThreatStatus status
    );
}
