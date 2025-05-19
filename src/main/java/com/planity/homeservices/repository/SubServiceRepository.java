package com.planity.homeservices.repository;

import com.planity.homeservices.model.SubService;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubServiceRepository extends JpaRepository<SubService, Long> {
    List<SubService> findTop3ByServiceIdOrderByIdAsc(Long serviceId);

}
