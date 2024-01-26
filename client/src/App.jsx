import React from 'react'
import Register from './components/Register'
import "rabbitcss";
import {BrowserRouter as Router , Route , Routes} from "react-router-dom"
import Dashboard from './components/Dashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>

      </Routes>
    </Router>
  )
}

export default App
