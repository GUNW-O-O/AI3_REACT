import React, { useEffect, useState } from 'react'
import Card from './Card'

const List = ({todoList,onToggle,onRemove}) => {

  // 💾 state 선언
  const [page, setPage] = useState(1)
  const [newList, setNewList] = useState([])

  // 데이터 목록 추가 함수
  const addList = (page) => {
    // 할 일 목록 요청
    fetch(`http://localhost:8080/todos?page=${page}`)
      .then(reponse => reponse.json())
      .then(data => {
        console.log(data);
        // 마지막 페이지 여부 체크
        if ( page > data.pagination.last ) {
          alert('마지막 처럼 입니다.')
          return
        }
        // 기존 리스트에 새 페이지 목록 누적
        const newTodoList = [ ...newList, ...data.list ]
        setNewList(newTodoList)
        setPage(page)
      })
      .catch(error => {console.error(error)})
  }

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const todoListElement = document.querySelector('.todoList')
    const scrollHeight = todoListElement.scrollHeight // 스크롤 높이
    const scrollTop = todoListElement.scrollTop       // 스크롤 위치
    const clientHeight = todoListElement.clientHeight // 컨텐츠 높이
    // console.log(`scrollHeight : ${scrollHeight}`)
    // console.log(`scrollTop : ${scrollTop}`)
    // console.log(`clientHeight : ${clientHeight}`)
    // 스크롤 맨 마지막
    if ( clientHeight + scrollTop == scrollHeight) {
      // alert('마지막처럼')
      // 다음 페이지 목록 데이터 추가
      addList(page+1)
    }
  }


  useEffect( () => {
    // 스크롤 이벤트 등록
    const todoListElement = document.querySelector('.todoList')
    if ( todoListElement )
      todoListElement.addEventListener('scroll', handleScroll)
    // 스크롤 이벤트 제거
    return () => {
      if ( todoListElement ) {
        todoListElement.removeEventListener('scroll', handleScroll)
      }
    }
  })

  return (
    <div className="todoList">
      <ul>
        {
          todoList.map( (todo) => (
            <Card todo={todo} onToggle={onToggle} onRemove={onRemove} />
          ))
        }
      </ul>
      <ul id='new-list'>
        {
          newList.map( (todo) => (
            <Card todo={todo} onToggle={onToggle} onRemove={onRemove} />
          ))
        }
      </ul>
    </div>
  )
}

export default List