package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface  BoardRepository  extends JpaRepository<BoardEntity, Long> {
    Page<BoardEntity> findByTitleContaining(String title, Pageable pageable);
    Page<BoardEntity> findByContentContaining(String content, Pageable pageable);
    Page<BoardEntity> findByWriterContaining(String writer, Pageable pageable);

    @Query("SELECT b FROM BoardEntity b WHERE b.title LIKE %:value% OR b.content LIKE %:value% OR b.writer LIKE %:value%")
    Page<BoardEntity> findByAllContaining(@Param("value") String value, Pageable pageable);
}
