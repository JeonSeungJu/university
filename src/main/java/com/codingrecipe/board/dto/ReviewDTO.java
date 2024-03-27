package com.codingrecipe.board.dto;

import com.codingrecipe.board.entity.BoardEntity;
import com.codingrecipe.board.entity.ReviewEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ReviewDTO {
    private Long id;
    private String title;
    private String goalContent;
    private String mentorContent;

    private String reviewContent;
    private MultipartFile file;
    private String imagePath;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") // 날짜 형식 지정
    private Date createdAt;
    public static ReviewDTO toDTO(ReviewEntity reviewEntity) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(reviewEntity.getRid());
        reviewDTO.setTitle(reviewEntity.getTitle());
        reviewDTO.setGoalContent(reviewEntity.getGoalContent());
        reviewDTO.setMentorContent(reviewEntity.getMentorContent());
        reviewDTO.setReviewContent(reviewEntity.getReviewContent());
        reviewDTO.setCreatedAt(reviewEntity.getCreatedAt());
        return reviewDTO;
    }
}
