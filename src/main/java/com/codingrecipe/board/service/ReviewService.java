package com.codingrecipe.board.service;

import com.codingrecipe.board.dto.BoardDTO;
import com.codingrecipe.board.dto.ReviewDTO;
import com.codingrecipe.board.entity.*;
import com.codingrecipe.board.respository.ReviewFileRepository;
import com.codingrecipe.board.respository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    private final ReviewFileRepository reviewFileRepository;



    public void saveReview(ReviewDTO reviewDTO, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("저장");
            // 이미지가 없는 경우
            ReviewEntity reviewEntity = ReviewEntity.toSaveEntity(reviewDTO);
            reviewRepository.save(reviewEntity);
        } else {
            // 이미지가 있는 경우
            ReviewEntity reviewEntity = ReviewEntity.toSaveEntity(reviewDTO);
            reviewEntity = reviewRepository.save(reviewEntity); // 글 저장
            String originalFilename = file.getOriginalFilename();

            String storedFileName = "D:/springboot_img/images/" + originalFilename; // 이미지 파일을 저장할 경로
            File files = new File(storedFileName);
            file.transferTo(files);
            // 이미지 정보를 생성하고 글과 연결
            ReviewFileEntity reviewFileEntity = ReviewFileEntity.toReviewFileEntity(reviewEntity, originalFilename, storedFileName);
            reviewFileRepository.save(reviewFileEntity);
        }
    }

    public List<ReviewDTO> getAllReview(Pageable pageable) {
        Page<ReviewEntity> reviewPage = reviewRepository.findAll(pageable);
        List<ReviewDTO> reviewDTOList = new ArrayList<>();

        for (ReviewEntity review : reviewPage.getContent()) {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setId(review.getRid());
            reviewDTO.setTitle(review.getTitle());
            reviewDTO.setMentorContent(review.getMentorContent());
            reviewDTO.setGoalContent(review.getGoalContent());
            reviewDTO.setReviewContent(review.getReviewContent());
            reviewDTO.setCreatedAt(review.getCreatedAt());

            // 파일 정보 가져오기
            List<ReviewFileEntity> fileEntities = reviewFileRepository.findByReviewEntity(review);
            if (!fileEntities.isEmpty()) {
                ReviewFileEntity fileEntity = fileEntities.get(0);
                String imageUrl = "http://localhost:8083/file/" + fileEntity.getOriginalFileName();
                reviewDTO.setImagePath(imageUrl);
            }

            reviewDTOList.add(reviewDTO);
        }

        return reviewDTOList;
    }

    public ReviewDTO getReviewDetails(String id) {
        ReviewEntity reviewEntity = reviewRepository.findById(Long.parseLong(id)).orElse(null);
        if (reviewEntity != null) {
            // 가져온 엔터티를 DTO로 변환하여 반환합니다.
            ReviewDTO reviewDTO = ReviewDTO.toDTO(reviewEntity);

            List<ReviewFileEntity> fileEntities = reviewFileRepository.findByReviewEntity(reviewEntity);
            System.out.println("asdddd"+fileEntities);
            if (!fileEntities.isEmpty()) {
                ReviewFileEntity fileEntitys = fileEntities.get(0);
                String imageUrl = "http://localhost:8083/file/" + fileEntitys.getOriginalFileName();
                reviewDTO.setImagePath(imageUrl);
            }

            return reviewDTO;
        }
        return null;
    }
}