import React, { createContext, useEffect, useState } from 'react'



// 📦 컨텍스트 생성
export const LoginContext = createContext()

const LoginContextProvider = ({ children }) => {
    // 로그인 여부
    const [isLogin, setisLogin] = useState(false)

    // 로그아웃 함수
    const logout = () => {
        setisLogin(false)
    }

    // 임의로, 마운트 후 3초뒤 로그인 되도록
    useEffect(() => {
        // 3초 뒤 로그인 처리
        setTimeout(() => {
            setisLogin(true)
        }, 3000)
    }, [])


    return (
        // 컨텍스트 값 지정 -> value={?, ?}
        <LoginContext.Provider value={{ isLogin, logout }}>
            {children}
        </LoginContext.Provider>

    )
}

export default LoginContextProvider