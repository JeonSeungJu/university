package com.codingrecipe.board.entity;

import com.codingrecipe.board.dto.NoticeDTO;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "notice_table")
public class NoticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nid;
    @NotNull
    @Column(nullable = false)
    private String title;
    @NotNull
    @Column(nullable = false)
    private String writer;
    @NotNull
    @Column(nullable = false)
    private String content;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    private int likes;

    private int views;

    public static NoticeEntity toSaveEntity(NoticeDTO noticeDTO) {
        NoticeEntity noticeEntity = new NoticeEntity();
        noticeEntity.setTitle(noticeDTO.getTitle());
        noticeEntity.setWriter(noticeDTO.getWriter());
        noticeEntity.setContent(noticeDTO.getContent());
        noticeEntity.setCreatedAt(noticeDTO.getCreatedAt()); // Set the current timestamp
        noticeEntity.setLikes(0); // Set initial likes to 0
        noticeEntity.setViews(0); // Set initial views to 0
        return noticeEntity;
    }
}