package com.codingrecipe.board.service;

import com.codingrecipe.board.dto.JwtToken;
import com.codingrecipe.board.entity.MemberEntity;
import com.codingrecipe.board.jwt.JwtTokenProvider;
import com.codingrecipe.board.respository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

    private final PasswordEncoder passwordEncoder; // 추가
    @Transactional
    public MemberEntity saveMember(MemberEntity member) {
        // 비밀번호 해싱
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        // 저장
        return memberRepository.save(member);
    }
    @Transactional
    public JwtToken signIn(String email, String password) {
        // 1. email + password 를 기반으로 Authentication 객체 생성
        // 이때 authentication 은 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);

        // 2. 실제 검증. authenticate() 메서드를 통해 요청된 Member 에 대한 검증 진행
        // authenticate 메서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드 실행
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        return jwtToken;
    }
    @Transactional
    public JwtToken login(String email, String password) {
        // 1. email + password 유효성 검사
        // (생략: 필요에 따라 유효성 검사를 수행합니다.)

        // 2. 실제 로그인 로직 수행
        MemberEntity member = memberRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("Member not found with email: " + email));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }
        System.out.println(member);
        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        return jwtTokenProvider.generateToken(buildAuthentication(member));
    }

    private Authentication buildAuthentication(MemberEntity member) {
        return new UsernamePasswordAuthenticationToken(member.getUsername(), null, member.getAuthorities());
    }
}