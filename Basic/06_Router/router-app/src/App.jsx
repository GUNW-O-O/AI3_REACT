import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

// 🔗 / 
const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <Link to="/about">About</Link>
    </>
  )
}

// 🔗 /about 
const About = () => {
  return (
    <>
      <h1>About</h1>
      <Link to="/">Home</Link>
    </>
  )
}

export default App