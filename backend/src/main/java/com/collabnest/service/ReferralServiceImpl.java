package com.collabnest.service;

import com.collabnest.dto.ReferralDTO;
import com.collabnest.model.Referrals;
import com.collabnest.model.Alumni;
import com.collabnest.model.Student;
import com.collabnest.repository.ReferralRepository;
import com.collabnest.repository.AlumniRepository;
import com.collabnest.repository.StudentRepository;
import com.collabnest.dto.AlumniSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReferralServiceImpl implements ReferralService {
    @Autowired
    private ReferralRepository referralRepository;
    @Autowired
    private AlumniRepository alumniRepository;
    @Autowired
    private StudentRepository studentRepository;

    @Override
    public ReferralDTO addReferral(Integer alumniId, ReferralDTO dto) {
        Alumni alumni = alumniRepository.findById(alumniId).orElseThrow();
        Referrals referral = new Referrals();
        referral.setTitle(dto.getTitle());
        referral.setCompany(dto.getCompany());
        referral.setReferralLink(dto.getReferralLink());
        referral.setDescription(dto.getDescription());
        referral.setLocation(dto.getLocation());
        referral.setIsActive(true);
        referral.setAlumni(alumni);
        referral.setCreatedAt(java.time.LocalDate.now());
        referral = referralRepository.save(referral);
        dto.setReferralId(referral.getReferralId());
        dto.setIsActive(referral.getIsActive());
        dto.setCreatedAt(referral.getCreatedAt());
        return dto;
    }

    @Override
    public ReferralDTO updateReferral(Integer referralId, Integer alumniId, ReferralDTO dto) {
        Referrals referral = referralRepository.findById(referralId).orElseThrow();
        if (!referral.getAlumni().getAlumniId().equals(alumniId)) throw new RuntimeException("Unauthorized");
        referral.setTitle(dto.getTitle());
        referral.setCompany(dto.getCompany());
        referral.setReferralLink(dto.getReferralLink());
        referral.setDescription(dto.getDescription());
        referral.setLocation(dto.getLocation());
        referral.setIsActive(dto.getIsActive());
        referral = referralRepository.save(referral);
        dto.setReferralId(referral.getReferralId());
        return dto;
    }

    @Override
    public void deleteReferral(Integer referralId, Integer alumniId) {
        Referrals referral = referralRepository.findById(referralId).orElseThrow();
        if (!referral.getAlumni().getAlumniId().equals(alumniId)) throw new RuntimeException("Unauthorized");
        referralRepository.delete(referral);
    }

    @Override
    public List<ReferralDTO> getReferralsByAlumni(Integer alumniId) {
        return referralRepository.findByAlumni_AlumniId(alumniId)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ReferralDTO> getAllReferrals() {
        return referralRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ReferralDTO> getAllActiveReferrals() {
        return referralRepository.findByIsActiveTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void applyForReferral(Integer referralId, Integer studentId) {
        // Implement logic for student application
        // e.g., create a join entity or status
    }

    @Override
    public List<ReferralDTO> getReferralsForStudent(Integer studentId) {
        // Implement logic to return referrals student applied for
        return List.of();
    }

    private ReferralDTO toDTO(Referrals referral) {
        AlumniSummaryDTO alumniSummary = null;
        if (referral.getAlumni() != null) {
            Alumni alumni = referral.getAlumni();
            // Use correct getter names as per Alumni model
            alumniSummary = AlumniSummaryDTO.builder()
                .alumniId(alumni.getAlumniId())
                .name(alumni.getUser() != null ? alumni.getUser().getName() : null)
                // If getImage() or getExpertise() do not exist, set image/expertise as null or use available fields
                .image(null) // TODO: Replace with alumni.getImage() if available
                .expertise(null) // TODO: Replace with alumni.getExpertise() if available
                .location(alumni.getLocation())
                .company(alumni.getCurrentCompany())
                .build();
        }
        return ReferralDTO.builder()
            .referralId(referral.getReferralId())
            .title(referral.getTitle())
            .company(referral.getCompany())
            .referralLink(referral.getReferralLink())
            .description(referral.getDescription())
            .location(referral.getLocation())
            .isActive(referral.getIsActive())
            .alumniId(referral.getAlumni() != null ? referral.getAlumni().getAlumniId() : null)
            .createdAt(referral.getCreatedAt())
            .alumni(alumniSummary)
            .build();
}
}
