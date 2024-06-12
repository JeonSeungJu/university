package com.codingrecipe.board.entity;

import com.codingrecipe.board.dto.ColumnDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "column_table")
public class ColumnEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long colid;

    @Column
    private String title;

    @Column
    private String category;

    @Column
    private String author;

    @Lob
    private String content;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @OneToMany(mappedBy = "columnEntity", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ColumnFileEntity> columnFileEntities;

    public static ColumnEntity toSaveEntity(ColumnDTO dto) {
        ColumnEntity columnEntity = new ColumnEntity();
        columnEntity.setTitle(dto.getTitle());
        columnEntity.setCategory(dto.getCategory());
        columnEntity.setAuthor(dto.getAuthor());
        columnEntity.setContent(dto.getContent());
        columnEntity.setCreatedAt(dto.getCreatedAt());
        return columnEntity;
    }
}
