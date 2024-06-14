package com.codingrecipe.board.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.codingrecipe.board.dto.*;
import com.codingrecipe.board.entity.*;
import com.codingrecipe.board.respository.BoardRepository;
import com.codingrecipe.board.respository.ColumnRepository;
import com.codingrecipe.board.respository.NoticeRepository;
import com.codingrecipe.board.respository.ReviewRepository;
import com.codingrecipe.board.service.BoardService;
import com.codingrecipe.board.service.NoticeService;
import com.codingrecipe.board.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {
    private final BoardRepository boardRepository;
    private final BoardService boardService;
    private final NoticeRepository noticeRepository;
    private final NoticeService noticeService;
    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final ColumnRepository columnRepository;
    private final AmazonS3 amazonS3;
    private final String bucketName;
    @Autowired
    public BoardController(AmazonS3 amazonS3, @Value("${cloud.aws.s3.bucket}") String bucketName, BoardRepository boardRepository,
                           BoardService boardService,  NoticeRepository noticeRepository, NoticeService noticeService,
                           ReviewService reviewService, ReviewRepository reviewRepository, ColumnRepository columnRepository) {
        this.amazonS3 = amazonS3;
        this.bucketName = bucketName;
        this.boardRepository = boardRepository;
        this.boardService = boardService;
        this.noticeRepository = noticeRepository;
        this.noticeService = noticeService;
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository;
        this.columnRepository = columnRepository;
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveBoard(@ModelAttribute BoardDTO boardDTO,
                                            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        System.out.println(boardDTO);
        boardDTO.setContent(removeHtmlTags(boardDTO.getContent()));
        boardService.saveBoard(boardDTO, file);
        return ResponseEntity.ok("Board saved successfully.");
    }

    private String removeHtmlTags(String content) {
        return content.replaceAll("<[^>]*>", ""); // 간단한 HTML 태그 제거
    }



    @GetMapping("/search-posts")
    public ResponseEntity<Map<String, Object>> searchPosts(
            @RequestParam String option,
            @RequestParam String value,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int pages = page - 1;
        System.out.println(option);
        System.out.println(value);
        Pageable pageable = PageRequest.of(pages, size, Sort.Direction.DESC, "cid");
        List<Map<String, Object>> contentList = boardService.searchPosts(option, value, pageable);
        Page<BoardEntity> boardPage = boardRepository.findAll(pageable);
        System.out.println(contentList);
        Map<String, Object> response = new HashMap<>();
        response.put("contents", contentList);
        response.put("currentPage", page);
        response.put("totalPages", boardPage.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-post/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        boardService.deletePost(id);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/delete-notice/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        try {
            noticeService.deleteNotice(id);
            return ResponseEntity.ok("Notice deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting notice: " + e.getMessage());
        }
    }

    // 검색 기능 구현
    @GetMapping("/search-notices")
    public ResponseEntity<Map<String, Object>> searchNotices(
            @RequestParam("option") String option,
            @RequestParam("value") String value,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        int pages = page - 1;
        System.out.println(option);
        System.out.println(value);
        Pageable pageable = PageRequest.of(pages, size, Sort.Direction.DESC, "nid");
        List<Map<String, Object>> notices = noticeService.searchNotices(option, value, pageable);
        Page<NoticeEntity> boardPage = noticeRepository.findAll(pageable);
        System.out.println(notices);
        Map<String, Object> response = new HashMap<>();
        response.put("contents", notices);
        response.put("currentPage", page);
        response.put("totalPages", boardPage.getTotalPages());
        return ResponseEntity.ok(response);

    }

    @PutMapping("/edit-notice/{id}")
    public ResponseEntity<NoticeDTO> editPost(@RequestBody NoticeDTO noticeDTO) {
        System.out.println(noticeDTO);
        noticeService.editPost(noticeDTO);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/verify-password")
    public ResponseEntity<Map<String, String>> verifyPassword(@RequestBody BoardDTO boardDTO) {
        try {
            // postId를 이용하여 해당 게시글의 저장된 비밀번호를 가져옵니다.
            BoardEntity boardEntity = boardRepository.findById(boardDTO.getId())
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
            System.out.println(boardDTO);
            Map<String, String> response = new HashMap<>();
            // 이 부분에서는 단순한 평문 비밀번호를 비교하고 있습니다.
            // 실제로는 저장된 비밀번호도 암호화하여 저장하고, 암호화된 비밀번호를 비교해야 합니다.
            if (boardDTO.getPassword().equals(boardEntity.getPassword())) {
                response.put("status", "ok");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping(value = "/get-post", produces = "application/json; charset=UTF-8")
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        int pages = page - 1;
        Pageable pageable = PageRequest.of(pages, size, Sort.Direction.DESC, "cid");
        List<Map<String, Object>> contentList = boardService.getAllPostsWithImages(pageable);
        Page<BoardEntity> boardPage = boardRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("contents", contentList);
        response.put("currentPage", page);
        response.put("totalItems", contentList.size()); // 전체 아이템 수를 가져오는 방법이 없으므로 리스트 크기로 대체
        response.put("totalPages", boardPage.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-post-details/{id}")
    public BoardDTO getPostDetails(@PathVariable String id) throws ChangeSetPersister.NotFoundException {
        System.out.println(boardService.getPostDetails(id));
        return boardService.getPostDetails(id);
    }

    @PostMapping("/add-comment")
    public ResponseEntity<String> addComment(@RequestBody  BoardDTO boardDTO) {
        try {
            System.out.println(boardDTO);
            boardService.addComment(boardDTO);
            return ResponseEntity.ok("Comment added successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding comment: " + e.getMessage());
        }
    }
    @GetMapping("/get-comments/{id}")
    public ResponseEntity<List<BoardDTO>> getPostDetailsComment(@PathVariable Long id) {
        List<BoardDTO> comments = boardService.getPostDetailsComment(id);

        return ResponseEntity.ok(comments);
    }

    @PutMapping("/update-comment/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody CommentDTO commentDTO) {
        Optional<CommentEntity> updatedComment = boardService.updateComment(id, commentDTO);
        if (updatedComment.isPresent()) {
            return ResponseEntity.ok(updatedComment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete-comment/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        boardService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/save-notice")
    public ResponseEntity<String> saveNotice(@RequestBody NoticeDTO noticeDTO) {
        try {

            System.out.println(noticeDTO);
            noticeService.save(noticeDTO);
            return ResponseEntity.ok("Board saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving board: " + e.getMessage());
        }
    }
    @GetMapping("/get-notices")
    public ResponseEntity<Map<String, Object>> getAllNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size
    ) {
        int pages = page - 1;
        Pageable pageable = PageRequest.of(pages, size, Sort.Direction.DESC, "nid");
        List<Map<String, Object>> contentList = noticeService.getAllNotices(pageable);
        Page<NoticeEntity> noticePage = noticeRepository.findAll(pageable);
        System.out.println("asd" + contentList);
        Map<String, Object> response = new HashMap<>();
        response.put("contents", contentList);
        response.put("currentPage", page);
        response.put("totalItems", contentList.size()); // 전체 아이템 수를 가져오는 방법이 없으므로 리스트 크기로 대체
        response.put("totalPages", noticePage.getTotalPages());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/get-notice-details/{id}")
    public NoticeDTO getNoticeDetails(@PathVariable String id) throws ChangeSetPersister.NotFoundException {

        return noticeService.getNoticeDetails(id);
    }
    @PutMapping("/increase-views/{id}")
    public ResponseEntity<Map<String, Integer>> increaseViews(@PathVariable Long id) {
        System.out.println("Increase views controller method called"); // 로그 추가

        try {
            // 조회수 증가
            noticeService.increaseViews(id);

            // 응답 생성
            Map<String, Integer> response = new HashMap<>();
            response.put("views", noticeService.getViews(id));
            System.out.println(noticeService.getViews(id));
            return ResponseEntity.ok(response);
        } catch (ChangeSetPersister.NotFoundException e) {
            // 해당 ID에 해당하는 게시물이 없을 경우 예외 처리
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/save-review")
    public ResponseEntity<String> saveReview(@ModelAttribute ReviewDTO reviewDTO,
                                             @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        try {
            reviewDTO.setReviewContent(removeHtmlTags(reviewDTO.getReviewContent()));
            System.out.println(reviewDTO);
            reviewService.saveReview(reviewDTO,file);
            return new ResponseEntity<>("Review saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error saving review: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
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
        System.out.println(imageUrl);
        File localFile = new File(storedFileName);
        if (localFile.exists()) {
            localFile.delete();
        }
        return new ResponseEntity<>(imageUrl, HttpStatus.OK);
    }


    @GetMapping(value = "/get-review", produces = "application/json; charset=UTF-8")

    public ResponseEntity<Map<String, Object>> getReviews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String searchType) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("rid").descending());
        Page<ReviewEntity> pageReviews = reviewService.getReviews(search, searchType, pageable);
        List<Map<String, Object>> contentList = reviewService.convertToContentList(pageReviews);

        Map<String, Object> response = new HashMap<>();
        response.put("contents", contentList);
        response.put("currentPage", pageReviews.getNumber() + 1);
        response.put("totalItems", pageReviews.getTotalElements());
        response.put("totalPages", pageReviews.getTotalPages());

        return ResponseEntity.ok(response);
    }


    @PutMapping("/update-review/{id}")
    public ResponseEntity<String> updateReview(@PathVariable("id") Long id, @ModelAttribute ReviewDTO reviewDTO,
                                               @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        System.out.println(id);
        reviewService.updateReview(id, reviewDTO, file);
        return ResponseEntity.ok("Board updated successfully.");
    }

    @DeleteMapping("/delete-review/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable("id") Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted successfully.");
    }

    @GetMapping("/get-review-detail/{id}")
    public ReviewDTO getReviewDetails(@PathVariable String id) throws ChangeSetPersister.NotFoundException {
        System.out.println(reviewService.getReviewDetails(id));
        return reviewService.getReviewDetails(id);
    }
    @PostMapping("/save-column")
    public ResponseEntity<String> saveColumn(@ModelAttribute ColumnDTO columnDTO,
                                             @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        try {
            System.out.println(columnDTO);
            boardService.saveColumn(columnDTO, file);
            return new ResponseEntity<>("Review saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error saving review: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/columns")
    public ResponseEntity<Map<String, Object>> getColumns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "all") String option,
            @RequestParam(defaultValue = "") String value) {

        int pages = page - 1;
        Pageable pageable = PageRequest.of(pages, size, Sort.Direction.DESC, "colid");
        List<Map<String, Object>> contentList = boardService.searchColumns(option, value, pageable);
        Page<ColumnEntity> columnPage = columnRepository.findAll(pageable);
        Map<String, Object> response = new HashMap<>();
        System.out.println(value+"asdsa"+contentList);
        response.put("contents", contentList);
        response.put("currentPage", page);
        response.put("totalItems", contentList.size());
        response.put("totalPages", columnPage.getTotalPages());
        return ResponseEntity.ok(response);
    }


    @GetMapping("/get-column-detail/{id}")
    public ColumnDTO getColumnDetails(@PathVariable String id) throws ChangeSetPersister.NotFoundException {
        System.out.println(boardService.getColumnDetails(id));
        return boardService.getColumnDetails(id);
    }
}


