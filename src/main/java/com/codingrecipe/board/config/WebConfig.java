package com.codingrecipe.board.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private String resoircePath = "/upload/**";// view 에서 접근할 경로
    private String savePath = "file:///D:springboot_img/"; // 실제 파일 저장 경로

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler(resoircePath)
                .addResourceLocations(savePath);
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://my-reacts.s3-website.ap-northeast-2.amazonaws.com") // 클라이언트 주소
                .allowedMethods("OPTIONS", "GET", "POST", "PUT", "DELETE");
    }
}
