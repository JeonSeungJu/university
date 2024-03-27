package com.codingrecipe.board.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

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
    private String date;
    private String imagePath; // 이미지 경로
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") // 날짜 형식 지정
    private Date createdAt;

}