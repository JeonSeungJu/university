package com.codingrecipe.board.controller;

import com.codingrecipe.board.dto.MemberDTO;
import com.codingrecipe.board.entity.MemberEntity;
import com.codingrecipe.board.entity.TemporaryEntity;
import com.codingrecipe.board.respository.MemberRepository;
import com.codingrecipe.board.respository.TemporaryRepository;
import com.codingrecipe.board.service.EmailService;
import com.codingrecipe.board.service.MemberService;
import com.codingrecipe.board.service.TemporaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/manager")
public class ManagerController {
    private final MemberRepository memberRepository;
    private final TemporaryService temporaryService;
    private final TemporaryRepository temporaryRepository;
    private final MemberService memberService;

    @PostMapping("/temporary")
    public ResponseEntity<List<TemporaryEntity>> submitTemporarySignUp(@RequestBody MemberDTO memberDTO) {
        List<TemporaryEntity> temporaryUsers = temporaryService.getAllTemporaryData();
        return ResponseEntity.ok(temporaryUsers);
    }
    @PostMapping("/accept-user")
    public ResponseEntity<String> acceptUser(@RequestBody MemberDTO memberDTO) {
        System.out.println("수락");
        // 이메일을 기반으로 임시 데이터를 찾아옵니다.
        boolean success = temporaryService.approveOrRejectTemporaryUser(memberDTO.getEmail(), true);
        if (success) {
            return ResponseEntity.ok("완료되었습니다.");
        } else {
            // 임시 데이터가 없는 경우 처리
            return ResponseEntity.ok("임시 데이터가 존재하지 않습니다.");
        }
    }
    @PostMapping("/reject-user")
    public ResponseEntity<String> rejectUser(@RequestBody MemberDTO memberDTO) {
        // 이메일을 기반으로 임시 데이터를 찾아 삭제합니다.
        TemporaryEntity temporaryEntity = temporaryRepository.findByEmail(memberDTO.getEmail());
        System.out.println("삭제");
        if (temporaryEntity != null) {
            // 임시 데이터를 삭제합니다.
            temporaryRepository.delete(temporaryEntity);
            // 거부 성공 시
            return ResponseEntity.ok("삭제가 완료되었습니다.");
        } else {
            // 임시 데이터가 없는 경우 처리
            return ResponseEntity.ok("존재하지 않는 회원입니다.");
        }
    }
    @PostMapping("/members")
    public ResponseEntity<List<MemberDTO>> submitmemberSignUp(@RequestBody MemberDTO memberDTO) {
        List<MemberEntity> memberEntities = memberService.getAllMemberData();
        List<MemberDTO> responseDTOs = memberEntities.stream()
                .map(memberEntity -> MemberDTO.toMemberDTO(memberEntity))
                .collect(Collectors.toList());
        System.out.println(responseDTOs);
        System.out.println(responseDTOs.toString());
        return ResponseEntity.ok(responseDTOs);
    }

    @PostMapping("/member-drop")
    public ResponseEntity<String> memberdrop(@RequestBody MemberDTO memberDTO) {
        // 이메일을 기반으로 임시 데이터를 찾아 삭제합니다.
        MemberEntity memberEntity = memberRepository.findByEmail(memberDTO.getEmail()).get();
        if (memberEntity != null) {
            // 임시 데이터를 삭제합니다.
            memberRepository.delete(memberEntity);
            // 거부 성공 시
            return ResponseEntity.ok("삭제가 완료되었습니다.");
        } else {
            // 임시 데이터가 없는 경우 처리
            return ResponseEntity.ok("존재하지 않는 회원입니다.");
        }
    }
    @PostMapping("/update-member")
    public ResponseEntity<String> updateMember(@RequestBody MemberDTO memberDTO) {
        Optional<MemberEntity> memberEntityOptional = memberRepository.findByEmail(memberDTO.getEmail());
        if (memberEntityOptional.isPresent()) {
            MemberEntity memberEntity = memberEntityOptional.get();
            memberEntity.setEmail(memberDTO.getEmail());
            memberEntity.setName(memberDTO.getName());
            memberEntity.setPhone(memberDTO.getPhone());
            memberRepository.save(memberEntity);
            return ResponseEntity.ok("회원 정보가 업데이트되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없습니다.");
        }
    }
}