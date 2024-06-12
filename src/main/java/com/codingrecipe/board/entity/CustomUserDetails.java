package com.codingrecipe.board.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    // 기존 필드 및 생성자 등

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 권한을 반환
        return null;
    }

    @Override
    public String getPassword() {
        // 사용자의 비밀번호를 반환
        return null;
    }

    @Override
    public String getUsername() {
        // 사용자의 이름을 반환
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }

    // 나머지 UserDetails 인터페이스의 메서드들을 구현
}