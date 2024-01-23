package com.codingrecipe.board.dto;

import com.codingrecipe.board.entity.MemberEntity;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;

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

    public static MemberDTO toMemberDTO(MemberEntity memberEntity) {
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setEmail(memberEntity.getEmail());
        memberDTO.setName(memberEntity.getName());
        memberDTO.setPhone(memberEntity.getPhone());
        memberDTO.setPassword(memberEntity.getPassword());
        memberDTO.setManagerName(memberEntity.getManagerName());
        return memberDTO;
    }

}
