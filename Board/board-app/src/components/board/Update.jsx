import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './css/Update.module.css'
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Checkbox from '@mui/material/Checkbox';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
// ckeditor5
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Update = ({
  board,
  fileList,
  onUpdate,
  onDelete,
  onDownload,
  onDeleteFile,
  deleteCheckedFiles }) => {

  // state
  const [form, setForm] = useState({
    title: '',
    writer: '',
    content: '',
  });
  const [fileIdList, setFileIdList] = useState([]) // 선택 삭제 id 목록
  const [mainFile, setMainFile] = useState(null)
  const [files, setFiles] = useState(null)

  const { title, writer, content } = form;

  // 변경 이벤트 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const { id } = useParams()

  // 수정 함수
  const onSubmit = () => {
    const data = { id, title, writer, content };
    const headers = { 'Content-Type': 'application/json' }

    // TODO : onInsert() 전달받아서 호출
    onUpdate(data, headers)
  }

  useEffect(() => {
    if (board) {
      setForm({
        title: board.title ?? '',
        writer: board.writer ?? '',
        content: board.content ?? '',
      });
    }

  }, [board])

  const handleDelete = () => {
    const check = window.confirm('정말로 삭제하시겠습니까?')
    if (check)
      onDelete(id)
  }

  // 선택 삭제 핸들러
  const handleCheckedFileDelete = (id) => {
    const check = window.confirm(`선택한 ${fileIdList.length} 정말로 삭제하시겠습니까?`)
    if (check)
      deleteCheckedFiles(fileIdList)
    setFileIdList([])
  }

  // 파일 선택 체크박스 핸들러
  const checkFileId = (id) => {
    console.log(id);

    let checked = false
    // 체크 여부 확인
    for (let i = 0; i < fileIdList.length; i++) {
      const fileId = fileIdList[i];
      // 체크면 체크박스를 해제
      if (fileId == id) {
        fileIdList.splice(i, 1)
        checked = true
      }
    }
    // 체크가 안되어있으면 체크
    if (!checked) {
      fileIdList.push(id)
    }
    console.log(`체크한 아이디 : ${fileIdList}`)
    setFileIdList(fileIdList)
  }

  // 파일 삭제 핸들러
  const handleFileDelete = (id) => {
    const check = window.confirm('파일을 삭제하시겠습니까?')
    if (check)
      onDeleteFile(id)
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
              <input type='text' name="title" onChange={handleChange} value={title} className={styles['form-input']} />
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
              <input type='text' name="writer" onChange={handleChange} value={writer} className={styles['form-input']} />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  placeholder: "내용을 입력하세요.",
                  language: 'ko',
                  toolbar: {
                    items: [
                      'undo', 'redo',
                      '|', 'heading',
                      '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                      '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                      '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent',
                      '|', 'link', 'uploadImage', 'blockQuote', 'codeBlock',
                      '|', 'mediaEmbed',
                    ],
                    shouldNotGroupWhenFull: false
                  },
                  alignment: {
                    options: ['left', 'center', 'right', 'justify'],
                  },
                }}
                data={content}         // ⭐ 기존 컨텐츠 내용 입력 (HTML)
                onReady={editor => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setForm(prevForm => ({
                    ...prevForm,
                    content: data
                  }));
                }}
                onBlur={(event, editor) => {
                  console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                  console.log('Focus.', editor);
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
                      {/* <input type="checkbox" onChange={() => checkFileId(file.id)}/> */}
                      <Checkbox onChange={() => checkFileId(file.id)} />
                      <div className="item-img">
                        {file.type == 'MAIN' && <span className="badge">대표</span>}
                        <img src={`/api/files/img/${file.id}`} alt={file.originName}
                          className='file-img' />
                      </div>
                      <span>{file.originName} ({file.fileSize})</span>
                    </div>
                    <div className="item">
                      <button className="btn" onClick={() => onDownload(file.id, file.originName)}>
                        <DownloadIcon /> </button>
                      <button className="btn" onClick={() => handleFileDelete(file.id)}>
                        <DeleteForeverIcon /></button>
                    </div>
                  </div>
                ))
              }
            </td>
          </tr>
        </thead>
      </table>
      <div className="btn-box">
        <div>
          <Link to="/boards" className="btn">목록</Link>
          <button className='btn' onClick={handleCheckedFileDelete}>선택삭제</button>
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