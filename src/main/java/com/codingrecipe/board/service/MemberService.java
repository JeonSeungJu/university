package com.codingrecipe.board.service;
import com.codingrecipe.board.dto.JwtToken;
import com.codingrecipe.board.entity.AdminEntity;
import com.codingrecipe.board.entity.MemberEntity;
import com.codingrecipe.board.entity.TemporaryEntity;
import com.codingrecipe.board.init.UserRoleConstants;
import com.codingrecipe.board.jwt.JwtTokenProvider;
import com.codingrecipe.board.respository.AdminRepository;
import com.codingrecipe.board.respository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final AdminRepository adminRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder; // 추가

    @Transactional
    public MemberEntity saveMember(MemberEntity member) {
        try {
            // 중복 이메일 체크
            if (memberRepository.existsByEmail(member.getEmail())) {
                throw new DuplicateKeyException("이미 가입된 회원입니다.");
            }
            // 비밀번호 해싱
            member.setPassword(passwordEncoder.encode(member.getPassword()));
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

    @Transactional
    public JwtToken login(String email, String password) {
        Optional<MemberEntity> memberEntity = memberRepository.findByEmail(email);
        Optional<AdminEntity> adminEntity = adminRepository.findByEmail(email);
        if (memberEntity.isPresent()) {
            MemberEntity member = memberEntity.get();

            if (!passwordEncoder.matches(password, member.getPassword())) {
                throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
            }
            Authentication authentication = buildAuthentication(member);
            System.out.println("authentication login request: " + authentication.toString());
            return jwtTokenProvider.generateToken(authentication);
        } else if (adminEntity.isPresent()) {
            AdminEntity admin = adminEntity.get();
            if (!passwordEncoder.matches(password, admin.getPassword())) {
                throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
            }

            Authentication authentication = buildAuthentication(admin);
            System.out.println("authentication login request: " + authentication.toString());
            return jwtTokenProvider.generateToken(authentication);
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }

    private Authentication buildAuthentication(MemberEntity member) {
        UserDetails userDetails = new User(member.getEmail(), "", member.getAuthorities());
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    private Authentication buildAuthentication(AdminEntity admin) {
        UserDetails userDetails = new User(admin.getEmail(), "", admin.getAuthorities());
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
    @Transactional
    public List<MemberEntity> getAllMemberData() {
        return memberRepository.findAll();
    }
}
