package com.codingrecipe.board.controller;

import com.codingrecipe.board.dto.JwtToken;
import com.codingrecipe.board.dto.SigninRequest;
import com.codingrecipe.board.entity.MemberEntity;
import com.codingrecipe.board.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberEntity member) {
        try {
            MemberEntity savedMember = memberService.saveMember(member);
            System.out.println(member);
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (DuplicateKeyException e) {
            // 중복된 이메일 등의 예외 처리
            return ResponseEntity.badRequest().body("이미 가입된 회원입니다.");
        } catch (Exception e) {
            // 기타 예외 처리
            return ResponseEntity.badRequest().body("회원가입에 실패하였습니다.");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SigninRequest signinRequest) {
        try {
            String email = signinRequest.getEmail();
            String password = signinRequest.getPassword();

            System.out.println(email);
            JwtToken jwtToken = memberService.login(email, password);
            System.out.println(jwtToken);
            return ResponseEntity.ok(jwtToken);
        } catch (Exception e) {

            // 로그인 실패 시 예외 처리
            return ResponseEntity.badRequest().body("로그인에 실패하였습니다.");
        }
    }
}