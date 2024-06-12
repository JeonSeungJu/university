package com.codingrecipe.board.controller;

import com.codingrecipe.board.dto.ContactFormDTO;
import com.codingrecipe.board.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> handleContactFormSubmission(
            @RequestParam("name") String name,
            @RequestParam("contact") String contact,
            @RequestParam("kakaoId") String kakaoId,
            @RequestParam("contactTime") String contactTime,
            @RequestParam("text") String text,
            @RequestParam("degreeProgram") String degreeProgram,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "agree", required = true) boolean agree) {

        // 파일이 제출되었는지 여부에 따라 다른 처리
        if (file != null && !file.isEmpty()) {
            // 파일이 제출된 경우
            // 파일 처리 및 이메일 전송
            ContactFormDTO form = new ContactFormDTO();
            form.setName(name);
            form.setContact(contact);
            form.setKakaoId(kakaoId);
            form.setContactTime(contactTime);
            form.setText(text);
            form.setDegreeProgram(degreeProgram);
            form.setFile(file);
            form.setAgree(agree);

            emailService.sendContactFormEmail(form);
            return ResponseEntity.ok("Form submitted successfully with file");
        } else {
            // 파일이 제출되지 않은 경우
            // 파일을 첨부하지 않았을 때의 처리
            ContactFormDTO form = new ContactFormDTO();
            form.setName(name);
            form.setContact(contact);
            form.setKakaoId(kakaoId);
            form.setContactTime(contactTime);
            form.setText(text);
            form.setDegreeProgram(degreeProgram);
            form.setAgree(agree);

            emailService.sendContactFormEmail(form);
            return ResponseEntity.ok("Form submitted successfully without file");
        }
    }

}
