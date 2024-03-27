package com.codingrecipe.board.controller;

import com.codingrecipe.board.dto.JwtToken;
import com.codingrecipe.board.dto.MemberDTO;
import com.codingrecipe.board.dto.SigninRequest;
import com.codingrecipe.board.entity.MemberEntity;
import com.codingrecipe.board.service.MemberService;
import com.codingrecipe.board.service.TemporaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService;

    private final TemporaryService temporaryService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberDTO memberDTO) {
        try {
            temporaryService.signUp(memberDTO);

            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (DuplicateKeyException e) {
            // 중복된 이메일 등의 예외 처리
            return ResponseEntity.badRequest().body("이미 가입된 회원입니다.");
        } catch (Exception e) {
            // 기타 예외 처리
            System.out.println("Signup failed with exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("회원가입에 실패하였습니다.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SigninRequest signinRequest) {
        try {
            System.out.println("Received login request: " + signinRequest.toString());
            String email = signinRequest.getEmail();
            String password = signinRequest.getPassword();

            JwtToken jwtToken = memberService.login(email, password);
            return ResponseEntity.ok(jwtToken);
        } catch (BadCredentialsException e) {
            // 비밀번호가 일치하지 않을 때의 예외 처리
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        } catch (UsernameNotFoundException e) {
            // 사용자를 찾을 수 없을 때의 예외 처리
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("해당 이메일로 가입된 사용자가 없습니다.");
        } catch (Exception e) {
            // 그 외의 예외 처리
            return ResponseEntity.badRequest().body("로그인에 실패하였습니다.");
        }
    }

}