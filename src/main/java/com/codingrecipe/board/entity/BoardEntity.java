package com.codingrecipe.board.entity;

import com.codingrecipe.board.dto.BoardDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "board_table")
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long cid;
    @Column(columnDefinition = "TINYINT(1)")
    private boolean secret;
    @Column
    private String title;
    @Column
    private String writer;
    @Column
    private String password;
    @Column
    private String content;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    public static BoardEntity toSaveEntity(BoardDTO boardDTO) {
        BoardEntity boardEntity = new BoardEntity();
        boardEntity.setTitle(boardDTO.getTitle());
        boardEntity.setSecret(boardDTO.isSecret());
        boardEntity.setWriter(boardDTO.getWriter());
        boardEntity.setPassword(boardDTO.getPassword());
        boardEntity.setContent(boardDTO.getContent());
        boardEntity.setCreatedAt(boardDTO.getCreatedAt());
        return boardEntity;
    }

    @OneToMany(mappedBy = "boardEntity", fetch = FetchType.EAGER)
    private List<BoardFileEntity> boardFileEntityList;

    @OneToMany(mappedBy = "boardEntity", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CommentEntity> commentEntityList = new ArrayList<>();
}
