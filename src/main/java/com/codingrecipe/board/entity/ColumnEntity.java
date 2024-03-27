package com.codingrecipe.board.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "board_table")
public class ColumnEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long coid;
    @Column
    private String title;
    @Column
    private String category;
    @Column
    private String author;
    @Column
    private String date;
    @Column
    private String imagePath; // 이미지 경로
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

}
