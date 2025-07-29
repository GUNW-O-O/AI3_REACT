package com.aloha.board.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.board.domain.Boards;
import com.aloha.board.mapper.BoardsMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class BoardServiceImpl implements BoardService{

    @Autowired private BoardsMapper boardsMapper;

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
    public boolean insert(Boards entity) {
        return boardsMapper.insert(entity) > 0;
    }

    @Override
    public boolean update(Boards entity) {
        return boardsMapper.update(entity) > 0;
    }

    @Override
    public boolean updateById(Boards entity) {
        return boardsMapper.updateById(entity) > 0;
    }

    @Override
    public boolean delete(Long no) {
        return boardsMapper.delete(no) > 0;
    }

    @Override
    public boolean deleteById(String Id) {
        return boardsMapper.deleteById(Id) > 0;
    }
    
}
