package com.codingrecipe.board.respository;

import com.codingrecipe.board.entity.TemporaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemporaryRepository extends JpaRepository<TemporaryEntity, Long> {

    TemporaryEntity findByEmail(String email);

    boolean existsByEmail(String email);
}
