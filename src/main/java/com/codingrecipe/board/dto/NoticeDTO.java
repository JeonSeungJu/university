package com.codingrecipe.board.dto;
import com.codingrecipe.board.entity.NoticeEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class NoticeDTO {
    private String title;
    private String writer;
    private String content;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") // 날짜 형식 지정
    private Date createdAt;
    private int likes;
    private int views;

    public static NoticeDTO toDTO(NoticeEntity noticeEntity) {
        NoticeDTO noticeDTO = new NoticeDTO();
        noticeDTO.setTitle(noticeEntity.getTitle());
        noticeDTO.setWriter(noticeEntity.getWriter());
        noticeDTO.setContent(noticeEntity.getContent());
        noticeDTO.setCreatedAt(noticeEntity.getCreatedAt());
        noticeDTO.setLikes(noticeEntity.getLikes());
        noticeDTO.setViews(noticeEntity.getViews());
        return noticeDTO;
    }

    // Constructors, getters, setters, and other methods...
}
