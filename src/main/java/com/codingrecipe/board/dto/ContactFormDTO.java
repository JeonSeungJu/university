package com.codingrecipe.board.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;


@Getter
@Setter
@ToString
@NoArgsConstructor
public class ContactFormDTO {
    private String name;
    private String contact;
    private String kakaoId;
    private String contactTime;
    private String text;
    private String degreeProgram;
    private MultipartFile file;
    private boolean agree;

}