import React, { useEffect, useState } from 'react'
import Read from '../../components/board/Read'
import { useParams } from 'react-router-dom'
import * as boards from '../../apis/boards'

const ReadContainer = () => {

  const { id } = useParams()

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

  useEffect(() => {
    getBoard()
  }, [])
  

  return (
    <Read board={board} />
  )
}

export default ReadContainer