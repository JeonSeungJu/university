package com.codingrecipe.board.entity;

import com.codingrecipe.board.dto.ReviewDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "review_table")
public class ReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long rid;
    @Column
    private String title;
    @Column
    private String goalContent;
    @Column
    private String mentorContent;

    @Column
    private String reviewContent;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    public static ReviewEntity toSaveEntity(ReviewDTO reviewDTO) {
        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setTitle(reviewDTO.getTitle());
        reviewEntity.setGoalContent(reviewDTO.getGoalContent());
        reviewEntity.setMentorContent(reviewDTO.getMentorContent());
        reviewEntity.setReviewContent(reviewDTO.getReviewContent());
        reviewEntity.setCreatedAt(reviewDTO.getCreatedAt());
        return reviewEntity;
    }

    @OneToMany(mappedBy = "reviewEntity", fetch = FetchType.EAGER)
    private List<ReviewFileEntity> reviewFileEntities;

}
