package com.codingrecipe.board.dto;

import com.codingrecipe.board.entity.MemberEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class MemberDTO {
    private String email;

    private String name;

    private String phone;

    private String password;

    private String managerName;

    private List<String> roles;
    public static MemberDTO toMemberDTO(MemberEntity memberEntity) {
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setEmail(memberEntity.getEmail());
        memberDTO.setName(memberEntity.getName());
        memberDTO.setPhone(memberEntity.getPhone());
        memberDTO.setPassword(memberEntity.getPassword());
        memberDTO.setRoles(memberEntity.getRoles());
        return memberDTO;
    }

}
