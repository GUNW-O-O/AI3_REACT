
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Update from './pages/board/Update';
import Insert from './pages/board/Insert';
import Read from './pages/board/Read';
import List from './pages/board/List';
import Home from './pages/Home';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<List />} />
        <Route path="/boards/insert" element={<Insert />} />
        <Route path="/boards/:id" element={<Read />} />
        <Route path="/boards/update/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App