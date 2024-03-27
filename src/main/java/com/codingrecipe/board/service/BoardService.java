package com.codingrecipe.board.service;

import com.codingrecipe.board.dto.BoardDTO;
import com.codingrecipe.board.entity.BoardEntity;
import com.codingrecipe.board.entity.BoardFileEntity;
import com.codingrecipe.board.entity.CommentEntity;
import com.codingrecipe.board.entity.NoticeEntity;
import com.codingrecipe.board.respository.BoardFileRepository;
import com.codingrecipe.board.respository.BoardRepository;
import com.codingrecipe.board.respository.CommentRepository;
import com.codingrecipe.board.respository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;

    private final BoardFileRepository boardFileRepository;
    private final CommentRepository commentRepository;

    public void saveBoard(BoardDTO boardDTO, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("저장");
            // 이미지가 없는 경우
            BoardEntity boardEntity = BoardEntity.toSaveEntity(boardDTO);
            boardRepository.save(boardEntity);
        } else {
            // 이미지가 있는 경우
            BoardEntity boardEntity = BoardEntity.toSaveEntity(boardDTO);
            boardEntity = boardRepository.save(boardEntity); // 글 저장
            String originalFilename = file.getOriginalFilename();

            String storedFileName = "D:/springboot_img/images/" + originalFilename; // 이미지 파일을 저장할 경로
            File files = new File(storedFileName);
            file.transferTo(files);
            // 이미지 정보를 생성하고 글과 연결
            BoardFileEntity boardFileEntity = BoardFileEntity.toBoardFileEntity(boardEntity, originalFilename, storedFileName);

            boardFileRepository.save(boardFileEntity);
        }
    }

    public List<Map<String, Object>> getAllPostsWithImages(Pageable pageable) {
        Page<BoardEntity> boardPage = boardRepository.findAll(pageable);
        List<Map<String, Object>> contentList = new ArrayList<>();

        for (BoardEntity board : boardPage.getContent()) {
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("cid", board.getCid());
            contentMap.put("title", board.getTitle());
            contentMap.put("isSecret", board.isSecret());
            contentMap.put("writer", board.getWriter());
            contentMap.put("content", board.getContent());
            contentMap.put("createdat", board.getCreatedAt());

            contentList.add(contentMap);
        }

        return contentList;
    }


    public BoardDTO getPostDetails(String id) {
        // 게시글 ID로 게시글 엔터티를 데이터베이스에서 가져옵니다.
        BoardEntity boardEntity = boardRepository.findById(Long.parseLong(id)).orElse(null);
        if (boardEntity != null) {
            // 가져온 엔터티를 DTO로 변환하여 반환합니다.
            BoardDTO boardDTO = BoardDTO.toDTO(boardEntity);

            List<BoardFileEntity> fileEntities = boardFileRepository.findByBoardEntity(boardEntity);
            System.out.println("asdddd"+fileEntities);
            if (!fileEntities.isEmpty()) {
                BoardFileEntity fileEntitys = fileEntities.get(0);
                String imageUrl = "http://localhost:8083/file/" + fileEntitys.getOriginalFileName();
                boardDTO.setImagePath(imageUrl);
            }

            return boardDTO;
        }
        return null;
    }
    @Transactional
    public void addComment(BoardDTO boardDTO) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setContent(boardDTO.getContent());
        commentEntity.setWriter(boardDTO.getWriter());
        commentEntity.setCreatedAt(boardDTO.getCreatedAt());
        // 게시물을 찾아서 연결
        BoardEntity boardEntity = boardRepository.findById(boardDTO.getId()).orElse(null);
        if (boardEntity != null) {
            System.out.println("yes");
            commentEntity.setBoardEntity(boardEntity);

        }
        System.out.println("yes" + commentEntity);
        commentRepository.save(commentEntity);

    }

    public List<BoardDTO> getPostDetailsComment(Long id) {
        List<CommentEntity> commentEntities = commentRepository.findByBoardEntity_Cid(id);
        List<BoardDTO> commentDTOs = new ArrayList<>();
        for (CommentEntity commentEntity : commentEntities) {
            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setId(commentEntity.getId());
            boardDTO.setWriter(commentEntity.getWriter());
            boardDTO.setCreatedAt(commentEntity.getCreatedAt());
            boardDTO.setContent(commentEntity.getContent());
            commentDTOs.add(boardDTO);
        }
        System.out.println("asd" + commentDTOs);
        return commentDTOs;
    }


}
