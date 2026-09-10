package com.threatlens.threatlens_backend.repository;

import com.threatlens.threatlens_backend.entity.Severity;
import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.entity.ThreatStatus;
import com.threatlens.threatlens_backend.entity.ThreatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ThreatRepository extends JpaRepository<Threat, Long> {

    List<Threat> findByStatus(ThreatStatus status);

    List<Threat> findBySourceIp(String sourceIp);

    boolean existsByThreatTypeAndSourceIpAndStatus(
            ThreatType threatType,
            String sourceIp,
            ThreatStatus status
    );

    long countBySeverity(Severity severity);

    long countByStatus(ThreatStatus status);

    @Query(value = """
            SELECT 
                DATE_FORMAT(detected_at, '%Y-%m-%d %H:00:00') AS hour,
                COUNT(*) AS threat_count
            FROM threats
            WHERE detected_at >= NOW() - INTERVAL 24 HOUR
            GROUP BY DATE_FORMAT(detected_at, '%Y-%m-%d %H:00:00')
            ORDER BY hour
            """, nativeQuery = true)
    List<Object[]> getThreatActivity();


    @Query("""
        SELECT t.threatType, COUNT(t)
        FROM Threat t
        GROUP BY t.threatType
        ORDER BY COUNT(t) DESC
        """)
    List<Object[]> getThreatTypeDistribution();

    List<Threat> findTop10ByOrderByDetectedAtDesc();

    @Query("""
    SELECT t.sourceIp, COUNT(t)
    FROM Threat t
    GROUP BY t.sourceIp
    ORDER BY COUNT(t) DESC
    """)
    List<Object[]> getTopAttackingIps();
}