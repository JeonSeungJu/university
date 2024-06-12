package com.codingrecipe.board.service;

import com.codingrecipe.board.dto.MemberDTO;
import com.codingrecipe.board.entity.MemberEntity;
import com.codingrecipe.board.entity.TemporaryEntity;
import com.codingrecipe.board.init.UserRoleConstants;
import com.codingrecipe.board.respository.MemberRepository;
import com.codingrecipe.board.respository.TemporaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TemporaryService {
    private final TemporaryRepository temporaryRepository;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final EmailService emailService;
    @Transactional
    public void signUp(MemberDTO memberDTO) {
        if (temporaryRepository.existsByEmail(memberDTO.getEmail())) {
            throw new DuplicateKeyException("이미 가입된 회원입니다.");
        }
        TemporaryEntity temporaryEntity = TemporaryEntity.toSaveEntity(memberDTO);

        String hashedPassword = passwordEncoder.encode(temporaryEntity.getPassword());
        temporaryEntity.setPassword(hashedPassword);
        // 데이터베이스에 저장
        temporaryRepository.save(temporaryEntity);
    }
    @Transactional
    public List<TemporaryEntity> getAllTemporaryData() {
        return temporaryRepository.findAll();
    }
    @Transactional
    public boolean approveOrRejectTemporaryUser(String email, boolean b) {
        TemporaryEntity temporaryUser = temporaryRepository.findByEmail(email);

        if (temporaryUser != null) {
            if (b) {
                // 승인 작업: 임시 데이터를 회원 데이터베이스에 저장하고 임시 데이터베이스에서 삭제
                saveMemberFromTemporary(temporaryUser);

                // 임시 데이터베이스에서 삭제
                temporaryRepository.delete(temporaryUser);
                emailService.sendEmail(email, "회원가입 성공", "회원가입이 성공적으로 완료되었습니다.");

                return true; // 승인 성공
            } else {
                // 거부 작업: 임시 데이터를 임시 데이터베이스에서 삭제
                temporaryRepository.delete(temporaryUser);
                emailService.sendEmail(email, "회원가입 거절", "회원가입이 거절되었습니다.");

                return true; // 거부 성공
            }
        } else {
            return false; // 해당 temporaryUserId에 대한 임시 데이터가 없음
        }
    }
    @Transactional
    public MemberEntity saveMemberFromTemporary(TemporaryEntity temporaryUser) {
        try {
            // 중복 이메일 체크
            if (memberRepository.existsByEmail(temporaryUser.getEmail())) {
                throw new DuplicateKeyException("이미 가입된 회원입니다.");
            }

            // TemporaryEntity에서 MemberEntity로 변환
            MemberEntity member = new MemberEntity();
            member.setPassword(temporaryUser.getPassword());
            member.setName(temporaryUser.getName());
            member.setEmail(temporaryUser.getEmail());
            member.setPhone(temporaryUser.getPhone());
            // 다른 필드들도 설정

            // 사용자 역할 설정 (예시: 기본 역할은 USER)
            member.getRoles().add(UserRoleConstants.ROLE_USER);

            // 저장
            return memberRepository.save(member);
        } catch (DuplicateKeyException e) {
            // 중복된 이메일 등의 예외 처리
            System.out.println("DuplicateKeyException: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            // 기타 예외 처리.
            System.out.println("Error during signup: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("회원가입에 실패하였습니다.", e);
        }
    }
}
