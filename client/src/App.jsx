import React, { useEffect, useState } from 'react'
import Register from './components/Register'
import "rabbitcss";
import {BrowserRouter as Router , Route , Routes} from "react-router-dom"
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthenticated(true);
    }
  }, []);
  return (
   
    <Router>
      <Routes>
        <Route path='/' element={<Register/>}/>
        <Route path='/dashboard' element={isAuthenticated ? <Dashboard/> : <Register/>}/>

      </Routes>
    </Router>
  )
}

export default App
