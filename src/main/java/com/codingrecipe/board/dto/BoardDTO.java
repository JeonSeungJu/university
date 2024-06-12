package com.codingrecipe.board.dto;

import com.codingrecipe.board.entity.BoardEntity;
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
public class BoardDTO {
    private Long id;
    private String title;
    private boolean secret;
    private String writer;
    private String password;
    private String content;
    private MultipartFile file;
    private String imagePath;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date createdAt;
    public static BoardDTO toDTO(BoardEntity boardEntity) {
        BoardDTO boardDTO = new BoardDTO();
        boardDTO.setId(boardEntity.getCid());
        boardDTO.setTitle(boardEntity.getTitle());
        boardDTO.setSecret(boardEntity.isSecret());
        boardDTO.setWriter(boardEntity.getWriter());
        boardDTO.setPassword(boardEntity.getPassword());
        boardDTO.setContent(boardEntity.getContent());
        boardDTO.setCreatedAt(boardEntity.getCreatedAt());
        return boardDTO;
    }
}
