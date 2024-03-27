package com.codingrecipe.board.entity;

import com.codingrecipe.board.dto.MemberDTO;
import lombok.*;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "temporary_table")
public class TemporaryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String phone;

    public static TemporaryEntity toSaveEntity(MemberDTO memberDTO) {
        TemporaryEntity memberEntity = new TemporaryEntity();
        memberEntity.setEmail(memberDTO.getEmail());
        memberEntity.setName(memberDTO.getName());
        memberEntity.setPhone(memberDTO.getPhone());
        memberEntity.setPassword(memberDTO.getPassword());
        return memberEntity;
    }

}
