package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.BoardEntity;
import com.codingrecipe.board.entity.NoticeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoticeRepository  extends JpaRepository<NoticeEntity, Long> {
    Page<NoticeEntity> findByTitleContaining(String value, Pageable pageable);

    Page<NoticeEntity> findByContentContaining(String value, Pageable pageable);

    Page<NoticeEntity> findByWriterContaining(String value, Pageable pageable);
    @Query("SELECT b FROM BoardEntity b WHERE b.title LIKE %:value% OR b.content LIKE %:value% OR b.writer LIKE %:value%")
    Page<NoticeEntity> findByAllContaining(@Param("value") String value, Pageable pageable);
}
