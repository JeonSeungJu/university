package com.codingrecipe.board.service;

import com.codingrecipe.board.dto.ContactFormDTO;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendContactFormEmail(ContactFormDTO form) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // true indicates multipart message
            helper.setTo("dlwdjwjn1114@gmail.com"); // replace with actual recipient email
            helper.setSubject("New Contact Form Submission");
            helper.setText(createEmailBody(form), true); // set to true if the content includes HTML

            // Attach the file if present
            if (form.getFile() != null && !form.getFile().isEmpty()) {
                helper.addAttachment(form.getFile().getOriginalFilename(), new ByteArrayResource(form.getFile().getBytes()));
            }

            mailSender.send(message);
        } catch (IOException | MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String createEmailBody(ContactFormDTO form) {
        return "<p>Name: " + form.getName() + "</p>" +
                "<p>Contact: " + form.getContact() + "</p>" +
                "<p>Kakao ID: " + form.getKakaoId() + "</p>" +
                "<p>Contact Time: " + form.getContactTime() + "</p>" +
                "<p>Text: " + form.getText() + "</p>" +
                "<p>Degree Program: " + form.getDegreeProgram() + "</p>" +
                "<p>Agreed to terms: " + (form.isAgree() ? "Yes" : "No") + "</p>";
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}