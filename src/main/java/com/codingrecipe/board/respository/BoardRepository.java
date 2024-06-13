package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface  BoardRepository  extends JpaRepository<BoardEntity, Long> {
    Page<BoardEntity> findByTitleContaining(String value, Pageable pageable);

    Page<BoardEntity> findByContentContaining(String value, Pageable pageable);

    Page<BoardEntity> findByWriterContaining(String value, Pageable pageable);

    Page<BoardEntity> findByTitleContainingOrContentContainingOrWriterContaining(String title, String content, String writer, Pageable pageable);

}
