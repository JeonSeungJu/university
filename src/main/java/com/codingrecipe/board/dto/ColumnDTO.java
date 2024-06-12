package com.codingrecipe.board.dto;

import com.codingrecipe.board.entity.ColumnEntity;
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
public class ColumnDTO {
    private Long id;
    private String title;
    private String category;
    private String author;
    private String content;
    private String imagePath;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date createdAt;

    public static ColumnDTO toDTO(ColumnEntity entity) {
        ColumnDTO columnDTO = new ColumnDTO();
        columnDTO.setId(entity.getColid());
        columnDTO.setTitle(entity.getTitle());
        columnDTO.setCategory(entity.getCategory());
        columnDTO.setAuthor(entity.getAuthor());
        columnDTO.setContent(entity.getContent());
        columnDTO.setCreatedAt(entity.getCreatedAt());
        return columnDTO;
    }

    public static void setImagePath(ColumnDTO columnDTO, String imageUrl) {
        columnDTO.setImagePath(imageUrl);
    }
}
