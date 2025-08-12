package com.collabnest.repository;

import com.collabnest.model.Referrals;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReferralRepository extends JpaRepository<Referrals, Integer> {
    List<Referrals> findByAlumni_AlumniId(Integer alumniId);
    List<Referrals> findByIsActiveTrue();
}
