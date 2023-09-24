import React, { useState } from 'react';
import './authentication.scss'
import image from './image.jpg';
const Signup = () => {
  const [firstname,setFirstname] = useState("")
  const [lastname,setLastname] = useState("")
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
    <input type='text'
     placeholder='First Name'
     value={firstname}
     onChange={
      (e)=>{
      
      setFirstname(e.target.value)
    }
  }
     />
     <input type='text'
     placeholder='Last Name'
     value={lastname}
     onChange={
      (e)=>{
      
      setLastname(e.target.value)
    }
  }
     />
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
      <button className="button">Signup</button>
      <a href="#">Already have an account? <span className="click-here">Click here</span></a>

    </section>
    </section>
    </section>
    </section>
  )
}
export default Signup

