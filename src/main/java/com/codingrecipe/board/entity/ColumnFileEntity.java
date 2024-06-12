package com.codingrecipe.board.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "column_file_table")
public class ColumnFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String originalFileName;

    @Column
    private String storedFileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id")
    private ColumnEntity columnEntity;

    public static ColumnFileEntity toColumnFileEntity(ColumnEntity columnEntity, String originalFileName, String storedFileName) {
        ColumnFileEntity columnFileEntity = new ColumnFileEntity();
        columnFileEntity.setOriginalFileName(originalFileName);
        columnFileEntity.setStoredFileName(storedFileName);
        columnFileEntity.setColumnEntity(columnEntity);
        return columnFileEntity;
    }
}