package com.codingrecipe.board.service;

import com.codingrecipe.board.dto.BoardDTO;
import com.codingrecipe.board.dto.NoticeDTO;
import com.codingrecipe.board.entity.BoardEntity;
import com.codingrecipe.board.entity.BoardFileEntity;
import com.codingrecipe.board.entity.NoticeEntity;
import com.codingrecipe.board.respository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public void save(NoticeDTO noticeDTO) {
        NoticeEntity noticeEntity = NoticeEntity.toSaveEntity(noticeDTO);
        noticeRepository.save(noticeEntity);
    }

    public List<Map<String, Object>> getAllNotices(Pageable pageable) {
        Page<NoticeEntity> NoticePage = noticeRepository.findAll(pageable);
        List<Map<String, Object>> contentList = new ArrayList<>();

        for (NoticeEntity notice : NoticePage.getContent()) {
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("nid", notice.getNid());
            contentMap.put("title", notice.getTitle());
            contentMap.put("writer", notice.getWriter());
            contentMap.put("views", notice.getViews());
            contentMap.put("likes", notice.getLikes());
            contentMap.put("createdat", notice.getCreatedAt());
            contentMap.put("content", notice.getContent());
            contentList.add(contentMap);
        }

        return contentList;
    }

    public NoticeDTO getNoticeDetails(String id) {
        // 게시글 ID로 게시글 엔터티를 데이터베이스에서 가져옵니다.
        NoticeEntity noticeEntity = noticeRepository.findById(Long.parseLong(id)).orElse(null);
        if (noticeEntity != null) {
            // 가져온 엔터티를 DTO로 변환하여 반환합니다.
            NoticeDTO noticeDTO = NoticeDTO.toDTO(noticeEntity);


            return noticeDTO;
        }
        return null;
    }

    public void increaseViews(Long id) throws ChangeSetPersister.NotFoundException {
        NoticeEntity notice = getNoticeById(id);
        notice.setViews(notice.getViews() + 1);
        noticeRepository.save(notice);
    }

    public NoticeEntity getNoticeById(Long id) throws ChangeSetPersister.NotFoundException {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());
    }
    public int getViews(Long id) throws ChangeSetPersister.NotFoundException {
        return getNoticeById(id).getViews();
    }
}