package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.BoardEntity;
import com.codingrecipe.board.entity.BoardFileEntity;
import com.codingrecipe.board.entity.ReviewEntity;
import com.codingrecipe.board.entity.ReviewFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewFileRepository extends JpaRepository<ReviewFileEntity, Long> {
    List<ReviewFileEntity> findByReviewEntity(ReviewEntity reviewEntity);
}
