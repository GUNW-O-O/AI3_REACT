package com.aloha.board.service;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.board.domain.Files;
import com.aloha.board.mapper.FileMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileServiceImpl implements FileService {

    @Autowired FileMapper fileMapper;
    
    @Value("${upload.path}")
    private String uploadPath;

    @Override
    public List<Files> list() {
        return fileMapper.list();
    }

    @Override
    public PageInfo<Files> list(int page, int size) {
        PageHelper.startPage(page,size);
        List<Files> list = fileMapper.list();
        PageInfo<Files> pageInfo = new PageInfo<>(list);
        return pageInfo;
    }

    @Override
    public Files select(Long no) {
        return fileMapper.select(no);
    }

    @Override
    public Files selectById(String id) {
        return fileMapper.selectById(id);
    }

    @Override
    public boolean insert(Files entity) {
        return fileMapper.insert(entity) > 0;
    }

    @Override
    public boolean update(Files entity) {
        return fileMapper.update(entity) > 0;
    }

    @Override
    public boolean updateById(Files entity) {
        return fileMapper.updateById(entity) > 0;
    }

    // 파일 시스템의 파일 삭제
    public boolean delete(Files file) {
        if( file == null ) {
            log.info("파일이 없습니다.");
            return false;
        }
        
        String filePath = file.getFilePath();
        File deleteFile = new File(filePath);

        if( !deleteFile.exists() ) {
            log.error("파일이 존재하지 않습니다.");
            return false;
        }

        // 파일 삭제
        boolean deleted = deleteFile.delete();
        if(deleted) {
            log.info("파일이 삭제되었습니다");
            log.info("-" + filePath);
        }
        return true;
    }

    @Override
    public boolean delete(Long no) {
        Files file = fileMapper.select(no);         // 파일정보 조회
        delete(file);                               // 파일 삭제
        return fileMapper.delete(no) > 0;           // DB 데이터 삭제
    }

    @Override
    public boolean deleteById(String id) {
        Files file = fileMapper.selectById(id);         // 파일정보 조회
        delete(file);                                   // 파일 삭제
        return fileMapper.deleteById(id) > 0;           // DB 데이터 삭제
    }

    @Override
    public boolean upload(Files file) throws Exception {
        boolean result = false;
        MultipartFile multipartFile = file.getData();
        // 파일이 없을 때
        if( multipartFile.isEmpty() ) {
            return false;
        }

        // 1. 파일 시스템에 등록 (파일 복사)
        // - 파일 정보 : 원본파일명, 파일 용량, 파일 데이터
        //              파일명, 파일경로
        String originName = multipartFile.getOriginalFilename();
        long fileSize = multipartFile.getSize();
        byte[] fileData = multipartFile.getBytes();
        String fileName = UUID.randomUUID().toString() + "_" + originName;
        String filePath = uploadPath + "/" + fileName;
        File uploadFile = new File(filePath);
        FileCopyUtils.copy(fileData, uploadFile);       // 파일복사 (업로드)

        // DB 에 등록
        file.setOriginName(originName);
        file.setFileName(fileName);
        file.setFilePath(filePath);
        file.setFileSize(fileSize);

        result = fileMapper.insert(file) > 0;
        return result;
    }

    @Override
    public int upload(List<Files> fileList) throws Exception {
        int result = 0;
        if( fileList == null || fileList.isEmpty() )
            return result;
        for(Files files : fileList) {
            result += (upload(files) ? 1 : 0);
        }
        return result;
    }

    @Override
    public boolean download(String id, HttpServletResponse response) throws Exception {
        Files file = fileMapper.selectById(id);

        // 파일이 없으면
        if( file == null ) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return false;
        }

        // 파일 입력
        String fileName = file.getOriginName();     // 파일명 (다운로드시-원본파일명)
        String filePath = file.getFilePath();       // 파일 경로
        File downloadFile = new File(filePath);
        FileInputStream fis = new FileInputStream(downloadFile);

        // 파일 출력
        ServletOutputStream sos = response.getOutputStream();

        // 파일 다운로드를 위한 응답 헤더 세팅
        // - Content-Type           : application/octet-stream
        // - Content-Disposition    : attachment; filename="파일명.확장자"
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader("Content-Disposition",
                                "attachment; filename\"" + fileName + "\"");

        // 다운로드
        boolean result = FileCopyUtils.copy(fis, sos) > 0;
        fis.close();
        sos.close();
        
        return result;
    }

    @Override
    public List<Files> listByParent(Files file) {
        return fileMapper.listByParent(file);
    }

    @Override
    public int deleteByParent(Files file) {
        List<Files> fileList = fileMapper.listByParent(file);

        // 파일 삭제
        for (Files deleteFile : fileList) {
            delete(deleteFile);
        }

        // DB 삭제
        return fileMapper.deleteByParent(file);
    }

    @Override
    public int deleteFiles(String noList) {
        if( noList == null || noList.isEmpty() ) return 0;

        int count = 0;
        // 파일 삭제
        String[] nos = noList.split(",");
        for (String noStr : nos) {
            int no = Integer.parseInt(noStr);
            count += (delete((long)no) ? 1 : 0 );
        }
        log.info("파일" + count + "개를 삭제 하였습니다");

        return count;
    }

    @Override
    public int deleteFileById(String idList) {
        if( idList == null || idList.isEmpty() ) return 0;

        // 파일 삭제
        int count = 0;
        String[] ids = idList.split(",");
        for (String id : ids) {
            count += (deleteById(id) ? 1 : 0);
        }
        log.info("파일" + count + "개를 삭제 하였습니다");

        // DB 삭제
        return count;
    }

    @Override
    public int deleteFileList(List<Long> noList) {
        if ( noList == null || noList.isEmpty() ) return 0;

        // 파일 삭제
        for (Long no : noList) {
            Files file = select(no);
            delete(file);
        }
        int count = fileMapper.deleteFileList(noList);

        log.info("파일" + count + "개를 삭제 하였습니다");

        return count;
    }

    @Override
    public int deleteFileListById(List<String> idList) {
        if ( idList == null || idList.isEmpty() ) return 0;

        // 파일 삭제
        for (String id : idList) {
            Files file = selectById(id);
            delete(file);
        }
        int count = fileMapper.deleteFileListById(idList);
        log.info("파일" + count + "개를 삭제 하였습니다");

        return count;
    }

    @Override
    public Files SelectByType(Files file) {
        return fileMapper.selectByType(file);
    }

    @Override
    public List<Files> listByType(Files file) {
        return fileMapper.listByType(file);
    }

    
}
