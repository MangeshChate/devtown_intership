import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom';


function Register() {

    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successfull, setSuccessFull] = useState(false);
    const [error, setError] = useState(false);
    const [login, setLogin] = useState(false);
    
    const [message, setMessage] = useState('');

    const navigate = useNavigate();


    const refreshToken = async() => {
        try{
          const res = await axios.post("http://localhost:5500/api/refresh",{
            token:user.refreshToken
          });
          setUser({
            ...user,
            accessToken:res.data.accessToken,
            refreshToken:res.data.refreshToken
    
          });
          console.log(res.data)
          return res.data
        }catch(err){
          console.log(err);
        }
      }
      
      const axiosJWT = axios.create();
      axiosJWT.interceptors.request.use(
    
        async (config) =>{
          let currentDate = new Date();
          const decodedToken = jwtDecode(user.accessToken)
          if(decodedToken.exp *1000 < currentDate.getTime()){
            const data = await refreshToken();
            config.headers["authorization"] = data.accessToken;
    
          }
          return config;
        },(error)=>{
          return Promise.reject(error);
    
        }
      )

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(true);
            alert("password not matched")
            return;
        } else {
            try {
                const res = await axios.post("http://localhost:5500/api/register", { username, password });

                setMessage(res.data);
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                alert("Registration Successfufll !")
                setLogin(true);
            } catch (error) {
                console.log(error)
            }

        }
    }

    const handleLogin = async(e)=>{
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:5500/api/login",{username ,password});

            console.log(res.data)            
            navigate('/dashboard', {state:{ user: res.data }});
        }catch(err){
            console.log(err)
        }
    }

    


    return (
        <div className='h-[100vh] bg-[#f5f5f5]'>
            <div className='grid grid-cols-2 h-[100%]'>
                <div className='flex justify-center flex-col items-center object-cover bg-i  bg-[#252525]'>
                    <div>
                        <div className='text-7xl font-bold text-light'>Task <span className=' '>Management</span> </div>
                        <div className='text-7xl text-blue-700 font-bold'>{login ? "Login" : "Registration"}</div>

                    </div>
                </div>

                <div className='flex flex-col justify-center items-center'>
                    {login ? (
                        <form onSubmit={handleLogin} className='flex flex-col justify-center items-center gap-3 w-[500px]  rounded-lg  p-5'>
                            <span className='text-3xl text-center w-full mb-6 font-bold'>Sign In</span>
                            <div className='w-full flex  flex-col gap-3'>

                                <input type="text" placeholder='Enter Username' className='border p-3 w-full form-control ' onChange={(e)=>setUsername(e.target.value)} required />


                                <input type="password" placeholder='Enter password' className='border p-3 form-control' onChange={(e)=>setPassword(e.target.value)} required />

                            </div>
                            <div className='w-full text-start mt-4'>
                                <button className='bg-blue-500 font-bold  text-white p-2  w-full hover:bg-blue-600'>Sign In</button>
                            </div>

                            <span className='text-blue-600 cursor-pointer' onClick={() => setLogin(false)}>Sign Up </span>
                        </form>
                    ) : (


                        <form onSubmit={handleRegistration} className='flex flex-col justify-center items-center gap-3 w-[500px]  rounded-lg  p-5'>
                            <span className='text-3xl text-center w-full mb-6 font-bold'>Sign Up</span>
                            <div className='w-full flex  flex-col gap-3'>

                                <input type="text" placeholder='Enter Username' className='border p-3 w-full form-control 'onChange={(e)=>setUsername(e.target.value)} required />


                                <input type="password" placeholder='Enter password' className='border p-3 form-control' onChange={(e)=>setPassword(e.target.value)} required />


                                <input type="password" placeholder='Confirm password' className='border p-3 w-full' onChange={(e)=>setConfirmPassword(e.target.value)} required />


                            </div>
                            <div className='w-full text-start mt-4'>
                                <button className='bg-blue-500 font-bold  text-white p-2  w-full hover:bg-blue-600'>Register</button>
                            </div>
                            <span className='text-blue-600 cursor-pointer' onClick={() => setLogin(true)}>Sign In </span>

                            <span className='mt-5 text-blue-600'>
                                {message}
                            </span>

                        </form>
                    )}
                </div>


            </div>
        </div>
    )
}

export default Register
