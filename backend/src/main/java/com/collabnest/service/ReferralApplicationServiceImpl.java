package com.collabnest.service;

import com.collabnest.dto.ReferralApplicationDTO;
import com.collabnest.model.*;
import com.collabnest.repository.ReferralRepository;
import com.collabnest.repository.ReferralApplicationRepository;
import com.collabnest.repository.AlumniRepository;
import com.collabnest.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReferralApplicationServiceImpl implements ReferralApplicationService {
    private final ReferralApplicationRepository applicationRepository;
    private final ReferralRepository referralRepository;
    private final AlumniRepository alumniRepository;
    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ReferralApplicationDTO applyForReferral(Integer referralId, Integer studentId) {
        Referrals referral = referralRepository.findById(referralId)
            .orElseThrow(() -> new RuntimeException("Referral not found"));
        Alumni alumni = referral.getAlumni();
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        // Only allow one application per student per referral
        if(applicationRepository.findByReferral_ReferralId(referralId).stream().anyMatch(a -> a.getStudent().getStudentId().equals(studentId))) {
            throw new RuntimeException("Already applied");
        }
        ReferralApplication app = ReferralApplication.builder()
            .referral(referral)
            .alumni(alumni)
            .student(student)
            .status(ReferralApplication.ApplicationStatus.PENDING)
            .build();
        applicationRepository.save(app);
        ReferralApplicationDTO dto = new ReferralApplicationDTO();
        dto.setApplicationId(app.getApplicationId());
        dto.setAlumniId(app.getAlumni().getAlumniId());
        dto.setStudentId(app.getStudent().getStudentId());
        dto.setReferralId(app.getReferral().getReferralId());
        dto.setStatus(app.getStatus().name());
        dto.setName(app.getStudent().getUser().getName());
        dto.setEmail(app.getStudent().getUser().getEmail());
        return dto;
    }

    @Override
    public List<ReferralApplicationDTO> getApplicantsByReferral(Integer referralId) {
        return applicationRepository.findByReferral_ReferralId(referralId).stream()
            .map(a -> {
                ReferralApplicationDTO dto = new ReferralApplicationDTO();
                dto.setApplicationId(a.getApplicationId());
                dto.setAlumniId(a.getAlumni().getAlumniId());
                dto.setStudentId(a.getStudent().getStudentId());
                dto.setReferralId(a.getReferral().getReferralId());
                dto.setStatus(a.getStatus().name());
                dto.setName(a.getStudent().getUser().getName());
                dto.setEmail(a.getStudent().getUser().getEmail());
                return dto;
            }).collect(Collectors.toList());
    }

    @Override
    public List<ReferralApplicationDTO> getApplicationsByStudent(Integer studentId) {
        return applicationRepository.findByStudent_StudentId(studentId).stream()
            .map(a -> {
                ReferralApplicationDTO dto = new ReferralApplicationDTO();
                dto.setApplicationId(a.getApplicationId());
                dto.setAlumniId(a.getAlumni().getAlumniId());
                dto.setStudentId(a.getStudent().getStudentId());
                dto.setReferralId(a.getReferral().getReferralId());
                dto.setStatus(a.getStatus().name());
                dto.setName(a.getStudent().getUser().getName());
                dto.setEmail(a.getStudent().getUser().getEmail());
                return dto;
            }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveApplicant(Integer applicationId) {
        ReferralApplication app = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        Integer referralId = app.getReferral().getReferralId();
        // Approve this application
        app.setStatus(ReferralApplication.ApplicationStatus.APPROVED);
        applicationRepository.save(app);
        // Reject all other applications for this referral
        List<ReferralApplication> others = applicationRepository.findByReferral_ReferralId(referralId);
        for(ReferralApplication other : others) {
            if(!other.getApplicationId().equals(applicationId)) {
                other.setStatus(ReferralApplication.ApplicationStatus.REJECTED);
                applicationRepository.save(other);
            }
        }
    }
}
