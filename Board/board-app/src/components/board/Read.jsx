import React from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './css/Read.module.css'
// ckeditor5
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Read = ({ board, fileList, onDownload }) => {

  // const fileList = [
  //   {id : 'id1', originName: '파일명1', type:'MAIN', fileSize : '2048'},
  //   {id : 'id2', originName: '파일명2', type:'SUB', fileSize : '4096'},
  //   {id : 'id3', originName: '파일명3', type:'SUB', fileSize : '10048'},
  // ]

  const { id } = useParams()

  return (
    <div className="container">
      <h1 className="title">게시글 조회</h1>
      {/* <table className="table" border={1}> */}
      <table className={styles.table} border={1}>
        <tbody>
          <tr>
            <th>제목</th>
            <td>
              {/* 
              value vs defaultValue 
              - Controllered Component (상태관리 컴포넌트)
              * 상태들이 변경되면 UI 에 업데이트
              * value 값의 변경을 UI 업데이트 가능
              - Uncontrollered Component (컴포넌트)
              * 상태 변경 감지 안함
              * defaultValue 값은 초기에만 세팅
            */}
              <input type='text' defaultValue={board.title ?? ''} className={styles['form-input']} readOnly />
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
              <input type='text' defaultValue={board.writer ?? ''} className={styles['form-input']} readOnly />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              {/* <textarea className={styles['form-input']} cols="40" rows="10" readOnly
                defaultValue={board.content ?? ''}></textarea> */}
              <CKEditor editor={ClassicEditor}
                data={board.content}           // 조회할 데이터 컨텐츠 
                disabled={true}
                config={{
                  toolbar: [],
                }}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              {
                fileList.map((file) => (
                  <div className="flex-box" key={file.id}>
                    <div className="item">
                      <div className="item-img">
                        {file.type == 'MAIN' && <span className="badge">대표</span>}
                        <img src={`/api/files/img/${file.id}`} alt={file.originName}
                          className='file-img' />
                      </div>
                      <span>{file.originName} ({file.fileSize})</span>
                    </div>
                    <div className="item">
                      <button className="btn" onClick={() => onDownload(file.id, file.originName)}>다운로드</button>
                    </div>
                  </div>
                ))
              }
            </td>
          </tr>
        </tbody>
      </table>
      <div className="btn-box">
        <Link to="/boards" className="btn">목록</Link>
        <Link to={`/boards/update/${id}`} className="btn">수정</Link>
      </div>
    </div>
  )
}

export default Read