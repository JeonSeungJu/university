package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  BoardRepository  extends JpaRepository<BoardEntity, Long> {
}
