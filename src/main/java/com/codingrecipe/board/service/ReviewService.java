package com.codingrecipe.board.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.codingrecipe.board.dto.ReviewDTO;
import com.codingrecipe.board.entity.*;
import com.codingrecipe.board.respository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewFileRepository reviewFileRepository;
    private final AmazonS3 amazonS3;
    private final String bucketName;



    @Autowired
    public ReviewService(AmazonS3 amazonS3, @Value("${cloud.aws.s3.bucket}") String bucketName, ReviewRepository reviewRepository
            ,ReviewFileRepository reviewFileRepository) {
        this.amazonS3 = amazonS3;
        this.bucketName = bucketName;
        this.reviewRepository = reviewRepository;
        this.reviewFileRepository = reviewFileRepository;
    }


    public void saveReview(ReviewDTO reviewDTO,  MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("파일이 없습니다.");
            ReviewEntity reviewEntity = ReviewEntity.toSaveEntity(reviewDTO);
            System.out.println("boardEntity: " + reviewEntity);
            reviewRepository.save(reviewEntity);
        } else {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + extension;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            try (InputStream inputStream = file.getInputStream()) {
                amazonS3.putObject(new PutObjectRequest(bucketName, storedFileName, inputStream, metadata));
            }

            String imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();

            ReviewEntity reviewEntity = ReviewEntity.toSaveEntity(reviewDTO);
            reviewRepository.save(reviewEntity);

            ReviewFileEntity reviewFileEntity = ReviewFileEntity.toBoardFileEntity(reviewEntity, originalFilename, imageUrl);
            reviewFileRepository.save(reviewFileEntity);

            File localFile = new File(storedFileName);
            if (localFile.exists()) {
                localFile.delete();
            }
        }
    }
    public Page<ReviewEntity> getReviews(String searchQuery, String searchType, Pageable pageable) {
        switch (searchType) {
            case "title":
                return reviewRepository.findByTitleContainingIgnoreCase(searchQuery, pageable);
            case "content":
                return reviewRepository.findByReviewContentContainingIgnoreCase(searchQuery, pageable);
            case "all":
            default:
                return reviewRepository.findByTitleContainingIgnoreCaseOrReviewContentContainingIgnoreCase(searchQuery, searchQuery, pageable);
        }
    }

    public List<Map<String, Object>> convertToContentList(Page<ReviewEntity> reviewPage) {
        List<Map<String, Object>> contentList = new ArrayList<>();
        for (ReviewEntity review : reviewPage.getContent()) {
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("rid", review.getRid());
            contentMap.put("title", review.getTitle());
            contentMap.put("goalContent", review.getGoalContent());
            contentMap.put("mentorContent", review.getMentorContent());
            contentMap.put("content", review.getReviewContent());
            contentMap.put("createdat", review.getCreatedAt());

            List<ReviewFileEntity> fileEntities = reviewFileRepository.findByReviewEntity(review);
            if (!fileEntities.isEmpty()) {
                ReviewFileEntity fileEntity = fileEntities.get(0);
                String storedFileName = fileEntity.getStoredFileName();

                String imageUrl = storedFileName.startsWith("http") ? storedFileName : amazonS3.getUrl(bucketName, storedFileName).toString();
                contentMap.put("ImagePath", imageUrl);
            }
            contentList.add(contentMap);
        }
        return contentList;
    }



    public ReviewDTO getReviewDetails(String id) {
        ReviewEntity reviewEntity = reviewRepository.findById(Long.parseLong(id)).orElse(null);
        if (reviewEntity != null) {
            ReviewDTO reviewDTO = ReviewDTO.toDTO(reviewEntity);
            List<ReviewFileEntity> fileEntities = reviewFileRepository.findByReviewEntity(reviewEntity);
            if (!fileEntities.isEmpty()) {
                ReviewFileEntity fileEntity = fileEntities.get(0);
                String storedFileName = fileEntity.getStoredFileName();

                // URL 중복 여부를 검사
                String imageUrl;
                if (storedFileName.startsWith("http")) {
                    imageUrl = storedFileName;
                } else {
                    imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();
                }

                reviewDTO.setImagePath(imageUrl);
            }

            return reviewDTO;
        }
        return null;
    }
    @Transactional
    public void updateReview(Long id, ReviewDTO reviewDTO, MultipartFile file) throws IOException {
        Optional<ReviewEntity> existingReviewOptional = reviewRepository.findById(id);

        if (!existingReviewOptional.isPresent()) {
            throw new IllegalArgumentException("Review with the given ID not found");
        }

        ReviewEntity existingReview = existingReviewOptional.get();
        existingReview.setTitle(reviewDTO.getTitle());
        existingReview.setMentorContent(reviewDTO.getMentorContent());
        existingReview.setGoalContent(reviewDTO.getGoalContent());
        existingReview.setReviewContent(reviewDTO.getReviewContent());

        if (file != null && !file.isEmpty()) {
            List<ReviewFileEntity> fileEntities = reviewFileRepository.findByReviewEntity(existingReview);

            for (ReviewFileEntity fileEntity : fileEntities) {
                String storedFileName = fileEntity.getStoredFileName();
                amazonS3.deleteObject(bucketName, storedFileName);
                reviewFileRepository.delete(fileEntity);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + extension;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            try (InputStream inputStream = file.getInputStream()) {
                amazonS3.putObject(new PutObjectRequest(bucketName, storedFileName, inputStream, metadata));
            }

            String imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();

            ReviewFileEntity reviewFileEntity = ReviewFileEntity.toBoardFileEntity(existingReview, originalFilename, imageUrl);
            reviewFileRepository.save(reviewFileEntity);

            File localFile = new File(storedFileName);
            if (localFile.exists()) {
                localFile.delete();
            }
        }

        reviewRepository.save(existingReview);
    }

    public void deleteReview(Long id) {
        Optional<ReviewEntity> existingReviewOptional = reviewRepository.findById(id);

        if (!existingReviewOptional.isPresent()) {
            throw new IllegalArgumentException("Review with the given ID not found");
        }

        ReviewEntity existingReview = existingReviewOptional.get();

        List<ReviewFileEntity> fileEntities = reviewFileRepository.findByReviewEntity(existingReview);

        for (ReviewFileEntity fileEntity : fileEntities) {
            String storedFileName = fileEntity.getStoredFileName();
            amazonS3.deleteObject(bucketName, storedFileName);
            reviewFileRepository.delete(fileEntity);
        }

        reviewRepository.delete(existingReview);
    }

}