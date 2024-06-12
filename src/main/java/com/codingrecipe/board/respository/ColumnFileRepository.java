package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.ColumnEntity;
import com.codingrecipe.board.entity.ColumnFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ColumnFileRepository extends JpaRepository<ColumnFileEntity, Long> {
    List<ColumnFileEntity> findByColumnEntity(ColumnEntity column);
}
