package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository  extends JpaRepository<NoticeEntity, Long> {
}
