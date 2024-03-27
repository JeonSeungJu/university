package com.codingrecipe.board.entity;

import com.codingrecipe.board.dto.MemberDTO;
import com.sun.istack.NotNull;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
@NoArgsConstructor  // 기본 생성자를 public으로 사용
@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "email")
@Table(name = "member_table")
public class MemberEntity implements UserDetails {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @NotNull
        @Column(nullable = false)
        private String email;

        @NotNull
        @Column(nullable = false)
        private String name;

        @NotNull
        @Column(nullable = false)
        private String phone;

        @NotNull
        @Column(nullable = false)
        private String password;

        @ElementCollection(fetch = FetchType.EAGER)
        @Builder.Default
        private List<String> roles = new ArrayList<>();

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
                return getRolesFromAuthorities(roles);
        }

        private List<GrantedAuthority> getRolesFromAuthorities(List<String> roles) {
                return roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
        }

        @Override
        public String getUsername() {
                return this.email;
        }

        @Override
        public boolean isAccountNonExpired() {
                return true;
        }

        @Override
        public boolean isAccountNonLocked() {
                return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
                return true;
        }

        @Override
        public boolean isEnabled() {
                return true;
        }

        public static MemberEntity toSaveEntity(MemberDTO memberDTO) {
                MemberEntity memberEntity = new MemberEntity();
                memberEntity.setEmail(memberDTO.getEmail());
                memberEntity.setName(memberDTO.getName());
                memberEntity.setPhone(memberDTO.getPhone());
                memberEntity.setPassword(memberDTO.getPassword());
                return memberEntity;
        }
}
