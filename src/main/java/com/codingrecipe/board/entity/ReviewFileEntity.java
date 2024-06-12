package com.codingrecipe.board.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "Review_file_table")
public class ReviewFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @Column
    private String originalFileName;

    @Column
    private String storedFileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private ReviewEntity reviewEntity;

    public static ReviewFileEntity toBoardFileEntity(ReviewEntity reviewEntity, String originalFileName, String storedFileName) {
        ReviewFileEntity reviewFileEntity = new ReviewFileEntity();
        reviewFileEntity.setOriginalFileName(originalFileName);
        reviewFileEntity.setStoredFileName(storedFileName);
        reviewFileEntity.setReviewEntity(reviewEntity);
        return reviewFileEntity;
    }
}
