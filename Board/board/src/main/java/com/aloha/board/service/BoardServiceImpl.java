package com.aloha.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.board.domain.Boards;
import com.aloha.board.domain.Files;
import com.aloha.board.mapper.BoardMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BoardServiceImpl implements BoardService{

    @Autowired private BoardMapper boardsMapper;
    @Autowired private FileService fileService;

    @Override
    public List<Boards> list() {
        return boardsMapper.list();
    }

    @Override
    public PageInfo<Boards> list(int page, int size) {
        // ⭐ Page.Helper.startPage (현재 페이지, 페이지당 데이터 수)
        PageHelper.startPage(page,size); // 매퍼가 쿼리요청전에 먼저 페이징처리할 쿼리를 삽입
        List<Boards> list = boardsMapper.list();
        PageInfo<Boards> pageInfo = new PageInfo<>(list);
        return pageInfo;
    }

    @Override
    public Boards select(Long no) {
        return boardsMapper.select(no);
    }

    @Override
    public Boards selectById(String id) {
        return boardsMapper.selectById(id);
    }

    @Override
    public boolean insert(Boards boards) {
        // 게시글 등록
        int result = boardsMapper.insert(boards);
        // 파일 업로드
        result += upload(boards);
        return result > 0;
    }

    /**
     * 파일 업로드
     * @param board
     * @return
     */
    public int upload(Boards board) {
        int result = 0;
        String pTable = "boards";
        Long pNo = board.getNo();

        List<Files> uploadFileList = new ArrayList<>();
        MultipartFile mainFile = board.getMainFile();
        if( mainFile != null && !mainFile.isEmpty() ) {
            Files mainFileInfo = new Files();
            mainFileInfo.setPTable(pTable);
            mainFileInfo.setPNo(pNo);
            mainFileInfo.setData(mainFile);
            mainFileInfo.setType("MAIN");
            uploadFileList.add(mainFileInfo);
        }

        List<MultipartFile> files = board.getFiles();
        if( files != null && !files.isEmpty()) {
            for (MultipartFile multipartFile : files) {
                if(multipartFile.isEmpty())
                    continue;
                Files fileInfo = new Files();
                fileInfo.setPTable(pTable);
                fileInfo.setPNo(pNo);
                fileInfo.setData(multipartFile);
                fileInfo.setType("SUB");
                uploadFileList.add(fileInfo);
            }
        }
        try {
            result += fileService.upload(uploadFileList);
        } catch (Exception e) {
            log.error("게시글 파일 업로드 중 에러 발생");
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public boolean update(Boards boards) {
        // 게시글 수정
        int result = boardsMapper.updateById(boards);

        // 파일 업로드
        Boards oldBoard = boardsMapper.selectById(boards.getId());
        boards.setNo(oldBoard.getNo());
        result += upload(boards);
        return result > 0;
    }

    @Override
    public boolean updateById(Boards boards) {
        return boardsMapper.updateById(boards) > 0;
    }

    @Override
    public boolean delete(Long no) {
        // 게시글 삭제
        int result = boardsMapper.delete(no);
        // 종속된 첨부 파일 삭제
        Files file = new Files();
        file.setPTable("boards");
        file.setPNo(no);
        int deleteCount = fileService.deleteByParent(file);
        log.info(deleteCount + " 개의 파일이 삭제 되었습니다.");
        return result > 0;
    }

    @Override
    public boolean deleteById(String Id) {
        // 게시글 삭제
        int result = boardsMapper.deleteById(Id);
        // 종속된 첨부파일 삭제
        Boards board = boardsMapper.selectById(Id);
        Long no = board.getNo();
        Files file = new Files();
        file.setPTable("boards");
        file.setPNo(no);
        int deleteCount = fileService.deleteByParent(file);
        log.info(deleteCount + " 개의 파일이 삭제 되었습니다.");
        return result > 0;
    }
    
}
