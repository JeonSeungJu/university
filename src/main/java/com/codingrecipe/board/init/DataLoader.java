package com.codingrecipe.board.init;

import com.codingrecipe.board.entity.AdminEntity;
import com.codingrecipe.board.respository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DataLoader implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 시스템 초기화 시 관리자 계정 등록
        registerAdmin();
    }

    private void registerAdmin() {
        // 이미 등록된 경우 무시
        if (adminRepository.findByEmail("admin@gmail.com").isPresent()) {
            return;
        }

        // 새로운 관리자 계정 생성 및 등록
        AdminEntity admin = AdminEntity.builder()
                .email("admin@gmail.com")
                .name("Admin Name")
                .phone("010-1234-5678")  // 명시적으로 폰 번호를 지정
                .password(passwordEncoder.encode("123456"))
                .roles(Collections.singletonList("ROLE_ADMIN"))
                .build();

        adminRepository.save(admin);
    }
}
