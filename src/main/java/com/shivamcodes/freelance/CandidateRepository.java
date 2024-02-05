package com.shivamcodes.freelance;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shivamcodes.freelance.entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    // You can add custom query methods if needed
}
