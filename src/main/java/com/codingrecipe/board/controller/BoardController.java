package com.codingrecipe.board.controller;

import com.codingrecipe.board.dto.BoardDTO;
import com.codingrecipe.board.dto.NoticeDTO;
import com.codingrecipe.board.dto.ReviewDTO;
import com.codingrecipe.board.entity.BoardEntity;
import com.codingrecipe.board.entity.NoticeEntity;
import com.codingrecipe.board.entity.ReviewEntity;
import com.codingrecipe.board.respository.BoardRepository;
import com.codingrecipe.board.respository.NoticeRepository;
import com.codingrecipe.board.respository.ReviewRepository;
import com.codingrecipe.board.service.BoardService;
import com.codingrecipe.board.service.NoticeService;
import com.codingrecipe.board.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    @PostMapping("/save")
    public ResponseEntity<String> saveBoard(@ModelAttribute BoardDTO boardDTO,
                                            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // HTML 태그 제거
            boardDTO.setContent(removeHtmlTags(boardDTO.getContent()));
            System.out.println(boardDTO);
            boardService.saveBoard(boardDTO, file);
            System.out.println("boardDTO");
            return ResponseEntity.ok("Board saved successfully.");
        } catch (Exception e) {
            System.out.println("sad");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving board: " + e.getMessage());
        }
    }

    private String removeHtmlTags(String content) {
        // Jsoup 라이브러리를 사용하여 HTML 태그 제거
        return Jsoup.parse(content).text();
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
            @RequestParam(defaultValue = "4") int size
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

    @PostMapping("/save-notice")
    public ResponseEntity<String> saveNotice(@RequestBody NoticeDTO noticeDTO) {
        try {
            // HTML 태그 제거
            noticeDTO.setContent(removeHtmlTags(noticeDTO.getContent()));
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
                                            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // HTML 태그 제거
            System.out.println(reviewDTO);
            reviewService.saveReview(reviewDTO, file);
            return ResponseEntity.ok("Board saved successfully.");
        } catch (Exception e) {
            System.out.println("sad");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving board: " + e.getMessage());
        }
    }
    @GetMapping("/get-review")
    public ResponseEntity<Map<String, Object>> getAllReview(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size
    ) {
        int pages = page - 1;
        Pageable pageable = PageRequest.of(pages, size, Sort.Direction.DESC, "rid");
        List<ReviewDTO> contentList = reviewService.getAllReview(pageable);
        Page<ReviewEntity> noticePage = reviewRepository.findAll(pageable);
        System.out.println("asd" + contentList);
        Map<String, Object> response = new HashMap<>();
        response.put("contents", contentList);
        response.put("currentPage", page);
        response.put("totalItems", contentList.size()); // 전체 아이템 수를 가져오는 방법이 없으므로 리스트 크기로 대체
        response.put("totalPages", noticePage.getTotalPages());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/get-review-details/{id}")
    public ResponseEntity<ReviewDTO> getReviewDetails(@PathVariable Long id) {
        ReviewDTO reviewDTO = reviewService.getReviewDetails(String.valueOf(id));
        return ResponseEntity.ok(reviewDTO);
    }
}

