package com.aloha.board.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.board.domain.Boards;
import com.aloha.board.domain.Pagination;
import com.aloha.board.service.BoardService;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("/boards")
public class BoardController {

    @Autowired private BoardService boardService;

    
    @GetMapping()
    public ResponseEntity<?> getAll(
            @RequestParam(value = "page", defaultValue = "1", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size) {
        try {
            PageInfo<Boards> pageInfo = boardService.list(page, size);
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());
            Map<String, Object> reponse = new HashMap<>();
            List<Boards> list = pageInfo.getList();
            reponse.put("list", list);
            reponse.put("pagination", pagination);

            return new ResponseEntity<>(reponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") String id) {
        try {
            Boards board = boardService.selectById(id);
            if (id == null || board == null) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(board, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping()
    public ResponseEntity<?> create(@RequestBody Boards board) {
        try {
            boolean result = boardService.insert(board);
            if (result)
                return new ResponseEntity<>("SUCCESS", HttpStatus.CREATED);
            else
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping()
    public ResponseEntity<?> update(@RequestBody Boards board) {
        try {
            boolean result = boardService.updateById(board);
            if (result)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable("id") String id) {
        try {
            boolean result = boardService.deleteById(id);
            if (result)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
