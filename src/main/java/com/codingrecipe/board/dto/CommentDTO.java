package com.codingrecipe.board.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private String writer;
}
