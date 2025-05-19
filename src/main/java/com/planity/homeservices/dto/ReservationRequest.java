package com.planity.homeservices.dto;

import java.time.LocalDateTime;

public class ReservationRequest {
    private Long serviceId;
    private LocalDateTime appointmentDate;

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }
}