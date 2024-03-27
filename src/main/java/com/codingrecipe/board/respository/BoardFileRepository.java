package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.BoardEntity;
import com.codingrecipe.board.entity.BoardFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardFileRepository  extends JpaRepository<BoardFileEntity, Long> {

    List<BoardFileEntity> findByBoardEntity(BoardEntity boardEntity);
}
