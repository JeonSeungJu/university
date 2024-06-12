package com.codingrecipe.board.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.codingrecipe.board.dto.BoardDTO;
import com.codingrecipe.board.dto.ColumnDTO;
import com.codingrecipe.board.entity.*;
import com.codingrecipe.board.respository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;

    private final BoardFileRepository boardFileRepository;
    private final CommentRepository commentRepository;
    private final ColumnRepository columnRepository;
    private final ColumnFileRepository columnFileRepository;
    private final AmazonS3 amazonS3;
    private final String bucketName;



    @Autowired
    public BoardService(AmazonS3 amazonS3, @Value("${cloud.aws.s3.bucket}") String bucketName,
                        BoardRepository boardRepository, BoardFileRepository boardFileRepository, CommentRepository commentRepository
            ,ColumnRepository columnRepository, ColumnFileRepository columnFileRepository) {
        this.amazonS3 = amazonS3;
        this.bucketName = bucketName;
        this.boardRepository = boardRepository;
        this.boardFileRepository = boardFileRepository;
        this.commentRepository = commentRepository;
        this.columnRepository = columnRepository;
        this.columnFileRepository = columnFileRepository;
    }

    public void saveBoard(BoardDTO boardDTO, MultipartFile file) throws IOException {
        System.out.println("boardDTO: " + boardDTO);
        System.out.println("file: " + file);

        if (file == null || file.isEmpty()) {
            System.out.println("파일이 없습니다.");
            BoardEntity boardEntity = BoardEntity.toSaveEntity(boardDTO);
            System.out.println("boardEntity: " + boardEntity);
            boardRepository.save(boardEntity);
        } else {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + extension;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            try (InputStream inputStream = file.getInputStream()) {
                amazonS3.putObject(new PutObjectRequest(bucketName, storedFileName, inputStream, metadata));
            }

            String imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();


            BoardEntity boardEntity = BoardEntity.toSaveEntity(boardDTO);
            boardEntity = boardRepository.save(boardEntity);

            BoardFileEntity boardFileEntity = BoardFileEntity.toBoardFileEntity(boardEntity, originalFilename, imageUrl);
            boardFileRepository.save(boardFileEntity);

            File localFile = new File(storedFileName);
            if (localFile.exists()) {
                localFile.delete();
            }
        }
    }


    public List<Map<String, Object>> getAllPostsWithImages(Pageable pageable) {
        Page<BoardEntity> boardPage = boardRepository.findAll(pageable);
        List<Map<String, Object>> contentList = new ArrayList<>();

        for (BoardEntity board : boardPage.getContent()) {
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("cid", board.getCid());
            contentMap.put("title", board.getTitle());
            contentMap.put("isSecret", board.isSecret());
            contentMap.put("writer", board.getWriter());
            contentMap.put("content", board.getContent());
            contentMap.put("createdat", board.getCreatedAt());

            contentList.add(contentMap);
        }

        return contentList;
    }


    public BoardDTO getPostDetails(String id) {
        // 게시글 ID로 게시글 엔터티를 데이터베이스에서 가져옵니다.
        BoardEntity boardEntity = boardRepository.findById(Long.parseLong(id)).orElse(null);
        if (boardEntity != null) {
            // 가져온 엔터티를 DTO로 변환하여 반환합니다.
            BoardDTO boardDTO = BoardDTO.toDTO(boardEntity);

            List<BoardFileEntity> fileEntities = boardFileRepository.findByBoardEntity(boardEntity);
            System.out.println("fileEntities: " + fileEntities);
            if (!fileEntities.isEmpty()) {
                BoardFileEntity fileEntity = fileEntities.get(0);
                String storedFileName = fileEntity.getStoredFileName();

                // URL 중복 여부를 검사
                String imageUrl;
                if (storedFileName.startsWith("http")) {
                    imageUrl = storedFileName;
                } else {
                    imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();
                }

                boardDTO.setImagePath(imageUrl);
            }

            return boardDTO;
        }
        return null;
    }


    @Transactional
    public void addComment(BoardDTO boardDTO) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setContent(boardDTO.getContent());
        commentEntity.setWriter(boardDTO.getWriter());
        commentEntity.setCreatedAt(boardDTO.getCreatedAt());
        // 게시물을 찾아서 연결
        BoardEntity boardEntity = boardRepository.findById(boardDTO.getId()).orElse(null);
        if (boardEntity != null) {
            System.out.println("yes");
            commentEntity.setBoardEntity(boardEntity);

        }
        System.out.println("yes" + commentEntity);
        commentRepository.save(commentEntity);

    }

    public List<BoardDTO> getPostDetailsComment(Long id) {
        List<CommentEntity> commentEntities = commentRepository.findByBoardEntity_Cid(id);
        List<BoardDTO> commentDTOs = new ArrayList<>();
        for (CommentEntity commentEntity : commentEntities) {
            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setId(commentEntity.getId());
            boardDTO.setWriter(commentEntity.getWriter());
            boardDTO.setCreatedAt(commentEntity.getCreatedAt());
            boardDTO.setContent(commentEntity.getContent());
            commentDTOs.add(boardDTO);
        }
        System.out.println("asd" + commentDTOs);
        return commentDTOs;
    }


    public void saveColumn(ColumnDTO columnDTO, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            ColumnEntity columnEntity = ColumnEntity.toSaveEntity(columnDTO);
            columnRepository.save(columnEntity);
        } else {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + extension;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            try (InputStream inputStream = file.getInputStream()) {
                amazonS3.putObject(new PutObjectRequest(bucketName, storedFileName, inputStream, metadata));
            }

            String imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();


            ColumnEntity columnEntity = ColumnEntity.toSaveEntity(columnDTO);
            columnRepository.save(columnEntity);

            ColumnFileEntity columnFileEntity = ColumnFileEntity.toColumnFileEntity(columnEntity, originalFilename, imageUrl);
            columnFileRepository.save(columnFileEntity);

            File localFile = new File(storedFileName);
            if (localFile.exists()) {
                localFile.delete();
            }
        }
    }


    public List<ColumnDTO> getAllColumns() {
        List<ColumnEntity> columns = columnRepository.findAll();
        List<ColumnDTO> columnDTOs = new ArrayList<>();

        for (ColumnEntity column : columns) {
            ColumnDTO columnDTO = new ColumnDTO();
            // Set other properties from columnEntity to columnDTO
            columnDTO.setId(column.getColid());
            columnDTO.setTitle(column.getTitle());
            columnDTO.setCategory(column.getCategory());
            columnDTO.setAuthor(column.getAuthor());
            columnDTO.setContent(column.getContent());
            columnDTO.setCreatedAt(column.getCreatedAt());

            List<ColumnFileEntity> fileEntities = columnFileRepository.findByColumnEntity(column);
            if (!fileEntities.isEmpty()) {
                ColumnFileEntity fileEntity = fileEntities.get(0);
                String storedFileName = fileEntity.getStoredFileName();
                String imageUrl;

                if (storedFileName.startsWith("http")) {
                    imageUrl = storedFileName;
                } else {
                    imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();
                }

                columnDTO.setImagePath(imageUrl);
            }

            columnDTOs.add(columnDTO);
        }

        return columnDTOs;
    }

    public ColumnDTO getColumnDetails(String id) {
        ColumnEntity columnEntity = columnRepository.findById(Long.parseLong(id)).orElse(null);
        if (columnEntity != null) {
            ColumnDTO columnDTO = ColumnDTO.toDTO(columnEntity);

            List<ColumnFileEntity> fileEntities = columnFileRepository.findByColumnEntity(columnEntity);
            if (!fileEntities.isEmpty()) {
                ColumnFileEntity fileEntity = fileEntities.get(0);
                String storedFileName = fileEntity.getStoredFileName();
                String imageUrl;
                if (storedFileName.startsWith("http")) {
                    imageUrl = storedFileName;
                } else {
                    imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();
                }

                columnDTO.setImagePath(imageUrl);
                System.out.println(imageUrl);
            }

            return columnDTO;
        }
        return null;
    }

    public List<Map<String, Object>> searchPosts(String option, String value, Pageable pageable) {
        Page<BoardEntity> boardPage = null;

        switch (option) {
            case "title":
                boardPage = boardRepository.findByTitleContaining(value, pageable);
                break;
            case "content":
                boardPage = boardRepository.findByContentContaining(value, pageable);
                break;
            case "writer":
                boardPage = boardRepository.findByWriterContaining(value, pageable);
                break;
            case "all":
                boardPage = boardRepository.findByAllContaining(value, pageable);
            default:
                break;
        }

        return boardPage != null ? convertBoardPageToMapList(boardPage) : null;
    }

    private List<Map<String, Object>> convertBoardPageToMapList(Page<BoardEntity> boardPage) {
        List<Map<String, Object>> contentList = new ArrayList<>();

        for (BoardEntity board : boardPage.getContent()) {
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("cid", board.getCid());
            contentMap.put("title", board.getTitle());
            contentMap.put("isSecret", board.isSecret());
            contentMap.put("writer", board.getWriter());
            contentMap.put("content", board.getContent());
            contentMap.put("createdat", board.getCreatedAt());
            contentList.add(contentMap);
        }

        return contentList;
    }


    public void deletePost(Long id) {
        boardRepository.deleteById(id);
    }

    public List<Map<String, Object>> getColumns(Pageable pageable) {
        Page<ColumnEntity> boardPage = columnRepository.findAll(pageable);
        List<Map<String, Object>> contentList = new ArrayList<>();
        for (ColumnEntity board : boardPage.getContent()) {
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("colid", board.getColid());
            contentMap.put("title", board.getTitle());
            contentMap.put("author", board.getAuthor());
            contentMap.put("category", board.getCategory());
            contentMap.put("content", board.getContent());
            contentMap.put("createdat", board.getCreatedAt());
            List<ColumnFileEntity> fileEntities = columnFileRepository.findByColumnEntity(board);
            if (!fileEntities.isEmpty()) {
                ColumnFileEntity fileEntity = fileEntities.get(0);
                String storedFileName = fileEntity.getStoredFileName();

                // URL 중복 여부를 검사
                String imageUrl;
                if (storedFileName.startsWith("http")) {
                    imageUrl = storedFileName;
                } else {
                    imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();
                }
                contentMap.put("ImagePath", imageUrl);
            }
            contentList.add(contentMap);
        }
        return contentList;
    }

    public List<Map<String, Object>> searchColumns(String option, String value, Pageable pageable) {
        Page<ColumnEntity> boardPage = null;
        switch (option) {
            case "title":
                boardPage =  columnRepository.findByTitleContaining(value, pageable);
            case "content":
                boardPage = columnRepository.findByContentContaining(value, pageable);
            case "author":
                boardPage = columnRepository.findByAuthorContaining(value, pageable);
            case "all":
                boardPage = columnRepository.findByAllContaining(value, pageable);
            default:
                break;
        }
        return boardPage != null ? convertColumnPageToMapList(boardPage) : null;
    }

    private List<Map<String, Object>> convertColumnPageToMapList(Page<ColumnEntity> boardPage) {
        List<Map<String, Object>> contentList = new ArrayList<>();
        for (ColumnEntity board : boardPage.getContent()) {
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("colid", board.getColid());
            contentMap.put("title", board.getTitle());
            contentMap.put("author", board.getAuthor());
            contentMap.put("category", board.getCategory());
            contentMap.put("content", board.getContent());
            contentMap.put("createdat", board.getCreatedAt());
            List<ColumnFileEntity> fileEntities = columnFileRepository.findByColumnEntity(board);
            if (!fileEntities.isEmpty()) {
                ColumnFileEntity fileEntity = fileEntities.get(0);
                String storedFileName = fileEntity.getStoredFileName();

                // URL 중복 여부를 검사
                String imageUrl;
                if (storedFileName.startsWith("http")) {
                    imageUrl = storedFileName;
                } else {
                    imageUrl = amazonS3.getUrl(bucketName, storedFileName).toString();
                }
                contentMap.put("ImagePath", imageUrl);
            }
            contentList.add(contentMap);
        }
        return contentList;
    }

}

