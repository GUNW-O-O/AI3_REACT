import React, { useEffect, useState } from 'react'
import List from '../../components/board/List'
import * as boards from '../../apis/boards'

const ListContainer = () => {

  // 💾 state
  const [pagination, setPagination] = useState({})
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  // 게시글 목록 데이터
  const getList = async () => {
    const response = await boards.list(page,size)
    const data = await response.data
    const list = data.list
    const pagination = data.pagination
    console.log(data)
    console.log(data.list)
    console.log(data.pagination)

    setList(list)
    setPagination(pagination)
  }

  // ?
  useEffect(() => {
    getList()
  }, [page,size])
  // 의존성배열 []
  // : page, size 가 바뀔 때 마다 getList() 재실행
  

  return (
    <>
      <List list={list} pagination={pagination} />
    </>
  )
}

export default ListContainer