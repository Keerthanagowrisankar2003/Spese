import React, { useState } from 'react'
import './authentication.scss'
import image from './image.jpg';
const Login = () => {
  const [email,setEmail] = useState("")
  const[password,setPassword]= useState("")
  return (
    <section className='images'>
      <section className="image-container">
        <h3 >Effortlessly track and<br></br> manage your expense</h3>
      <img src={image} alt="exp"className="image" />

      </section>

    <section className='page'>
    <section className='form'>
    <section className='input'>
     <input type='email'
     placeholder='E-mail'
     value={email}
     onChange={
      (e)=>{
     
      setEmail(e.target.value)
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
      <button className="button">Login</button>
      <a href="#"><span className="account">Forgot Password?</span></a> 
      <a href="#">Don't have an account? <span className="click-here">Click here</span></a>
    </section>
    </section>
    </section>
    </section>
  )
}
export default Login
