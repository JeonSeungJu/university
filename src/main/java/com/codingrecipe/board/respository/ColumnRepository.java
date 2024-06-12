package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.ColumnEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ColumnRepository extends JpaRepository<ColumnEntity, Long> {
    Page<ColumnEntity> findByTitleContaining(String value, Pageable pageable);

    Page<ColumnEntity> findByContentContaining(String value, Pageable pageable);

    Page<ColumnEntity> findByAuthorContaining(String value, Pageable pageable);
    @Query("SELECT b FROM ColumnEntity b WHERE b.title LIKE %:value% OR b.content LIKE %:value% OR b.author LIKE %:value%")
    Page<ColumnEntity> findByAllContaining(@Param("value") String value, Pageable pageable);

}
