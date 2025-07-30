import React, { useEffect, useState } from 'react'
import Update from '../../components/board/Update'
import { useNavigate, useParams } from 'react-router-dom'
import * as boards from '../../apis/boards'

const UpdateContainer = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  // state
  const [board, setBoard] = useState({})

  // 게시글 조회 요청
  const getBoard = async () => {
    const response = await boards.select(id)
    const data = await response.data
    console.log(`board : ${data}`)
    console.dir(data)
    setBoard(data)
  }

  // 게시글 수정 요청
  const onUpdate = async (data, headers) => {
    try {
      const response = await boards.update(data, headers)
      const msg = await response.data
      console.log(msg);
      alert('수정 완료')
      // 게시글 목록으로 이동
      navigate('/boards')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect( () => {
    getBoard()
  }, [])

  // 게시글 삭제 요청
  const onDelete = async (id) => {
    try {
      const response = await boards.remove(id)
      const data = await response.data
      console.log(data)
      alert('삭제 완료')
      navigate('/boards')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Update board={board} onUpdate={onUpdate} onDelete={onDelete} />
  )
}

export default UpdateContainer