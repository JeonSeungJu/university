package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    Page<ReviewEntity> findByTitleContainingIgnoreCase(String searchQuery, Pageable pageable);

    Page<ReviewEntity> findByReviewContentContainingIgnoreCase(String searchQuery, Pageable pageable);

    Page<ReviewEntity> findByTitleContainingIgnoreCaseOrReviewContentContainingIgnoreCase(String searchQuery, String searchQuery1, Pageable pageable);
}
