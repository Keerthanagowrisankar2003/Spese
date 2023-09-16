import React, { useState } from 'react'
import './Login.css'

const Login = () => {
  const [name,setName] = useState("")
  const[password,setPassword]= useState("")
  return (
    <div className='login-form'>
     <input type='text'
     placeholder='Name'
     value={name}
     onChange={
      (e)=>{
      console.log(name);
      setName(e.target.value)
    }
  }
     />
     <input
     type='password'
     placeholder='Password'
     value={password}
     onChange={(e)=>{
      setPassword(e.target.value)
     }}
     />
    </div>
  )
}
export default Login
