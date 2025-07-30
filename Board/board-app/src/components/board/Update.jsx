import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './css/Update.module.css'

const Update = ({ board, onUpdate, onDelete }) => {

  // state
  const [title, setTitle] = useState('')
  const [writer, setWriter] = useState('')
  const [content, setContent] = useState('')
  
  // 변경 이벤트 함수
  const changeTitle = (e) => { setTitle(e.target.value) }
  const changeWriter = (e) => { setWriter(e.target.value) }
  const changeContent = (e) => { setContent(e.target.value) }

  const { id } = useParams()

  // 수정 함수
  const onSubmit = () => {
    const data = {
      'id' : id,
      'title': title,
      'writer': writer,
      'content': content
    }
    const headers = { 'Content-Type': 'application/json' }

    // TODO : onInsert() 전달받아서 호출
    onUpdate(data, headers)
  }

  useEffect(() => {
    if(board) {
      setTitle(board.title)
      setWriter(board.writer)
      setContent(board.content)
    }
  
  }, [board])

  const handleDelete = () => {
    const check = window.confirm('정말로 삭제하시겠습니까?')
    if( check )
      onDelete(id)
  }
  

  return (
    <div className="container">
      <h1 className="title">게시글 수정</h1>
      {/* <table className="table" border={1}> */}
      <table className={styles.table} border={1}>
        <thead>
        <tr>
          <th>제목</th>
          <td>
            <input type='text' onChange={changeTitle} value={title} className={styles['form-input']} />
            {/* 
              CSS modules 의 클래스 선택자는 카멜케이스 쓰는 것이 관례
                                CSS                   JavaScript
              * 카멜케이스 : .formInput      : -> {styles.formInput}
              * 케밥케이스 : .form-input     : -> {styles[form-input]}
            */}
          </td>
        </tr>
        <tr>
          <th>작성자</th>
          <td>
            <input type='text' onChange={changeWriter} value={writer} className={styles['form-input']} />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <textarea className={styles['form-input']} onChange={changeContent} value={content} cols="40" rows="10"></textarea>
          </td>
        </tr>
        </thead>
      </table>
      <div className="btn-box">
        <div>
          <Link to="/boards" className="btn">목록</Link>
        </div>
        <div>
          <button className="btn" onClick={onSubmit}>수정</button>
          <button className="btn" onClick={handleDelete}>삭제</button>
        </div>
      </div>
    </div>
  )
}

export default Update