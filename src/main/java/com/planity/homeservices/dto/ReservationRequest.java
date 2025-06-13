package com.planity.homeservices.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReservationRequest {
    private Long serviceId;
    private LocalDateTime appointmentDate;

    private String customName;
    private Integer customDuration;
    private BigDecimal customPrice;

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getCustomName() { return customName; }
    public void setCustomName(String customName) { this.customName = customName; }

    public Integer getCustomDuration() { return customDuration; }
    public void setCustomDuration(Integer customDuration) { this.customDuration = customDuration; }

    public BigDecimal getCustomPrice() { return customPrice; }
    public void setCustomPrice(BigDecimal customPrice) { this.customPrice = customPrice; }
}
