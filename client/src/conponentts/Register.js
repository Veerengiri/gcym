import React, { useState,useEffect ,useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import emailjs from '@emailjs/browser';
let code =Math.round(1000000 * Math.random()).toString();

function Register(props) {
  const {url}=props;
  const nav= useNavigate();
  const [name,setName]=useState("");
  const [phoneNo,setPhoneNo]=useState("");  
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [cp,setCp]=useState("");
  const [ecode,setEcode] = useState("");
  const form = useRef();
  
  const sendEmail = () => {
    // e.preventDefault();
    alert("code is sending to your email...");
    // console.log(form.current);
    emailjs.sendForm('service_z80kdsc', 'template_pkan5j9', form.current, "tAnIMRTGjOth0eHFS")
    .then((result) => {
      // console.log(result.text);
      alert("code is send to your email...");
      document.getElementById('rcode').style.display="flex";
      document.getElementById('register').style.display="none";
    }, (error) => {
      console.log(error.text);
      alert("error");
    });
  };

  const handlesubmit = async (e)=>{
    e.preventDefault();
    if(phoneNo.length!=10){
      alert("invalid phoneNo");
      return;
    }
    if(password!=cp){
      alert("password not mached");
      return;
    }
    // await window.Email.send({
    //   Host: "smtp.elasticemail.com",
    //   Username: "virengirigoswami3@gmail.com",
    //   Password: "28FB4AE2E314E380D52BBE1F1266C80D6AB3",
    //   To: email,
    //   From: "virengirigoswami3@gmail.com",
    //   Subject: "verify email",
    //   Body: "your verification code : " + code
    // }).then(
    //   () => { 
    //     document.getElementById('rcode').style.display="flex";
    //     document.getElementById('register').style.display="none";
    //    }
    //   );
    //   alert("code is send to your email")
    sendEmail();
  }
  const verify = async(e)=>{
    e.preventDefault();
    document.getElementById('verify').style.fontSize = ".8rem";
    document.getElementById('verify').innerText = "Verifying...";
    if(ecode == code){
      
      const res= await fetch(`${url}/api/register`,{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({
          name,
          phoneNo,
          email,
          password
        })
      })
      const data = await res.json();
      if(data.status=="register successfully"){
        nav("/login");
      }else{
        alert(data.status);
        document.getElementById('verify').style.fontSize = "unset";
        document.getElementById('verify').innerText = "Verify";
      }
    }else{
      alert("invalid code");
    }
  }
  useEffect(()=>{
    document.getElementById('rcode').style.display="none";
    document.getElementById('register').style.display="flex";
  },[]);
  return (
    <div className='loginform'>
      <form style={{display:"none"}} ref={form} onSubmit={sendEmail}>
        <label>Name</label>
        <input type="text" value={email} onChange={()=>{}} name="user_name" /><br />
        <label>Email</label>
        <input type="email" value={email} onChange={()=>{}} name="user_email" /><br />
        <label>Message</label>
        <textarea value={code} onChange={()=>{}} name="message" /><br />
        <input type="submit" value="Send" />
      </form>
      <div>
        <div className='rimage' ></div>
        <div className='lform' style={{gap:'25px',padding:'10px 30px'}}>
          <h1>Sign Up</h1>
          <form id='register' className='rform' onSubmit={handlesubmit}>
            <input placeholder='enter your name' type="text"  required value={name} onChange={(e)=>{setName(e.target.value)}}/>
            <input placeholder='enter your phoneno' type="text" required value={phoneNo} onChange={(e)=>{setPhoneNo(e.target.value)}}/>
            <input placeholder='enter your email' type="email" required value={email} onChange={(e)=>{setEmail(e.target.value)}}/> 
            <input placeholder='enter your password' type='password' required value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            <input placeholder='confirm password' type="password" required value={cp} onChange={(e)=>{setCp(e.target.value)}} />
            <div className='lbotton' style={{marginTop:'10px'}}>
              <button type="submit" className='btns' >Sign Up</button>
              <Link className='reg' to="/login">Login</Link>
            </div>
          </form>
          <form id='rcode' className='rform' style={{gap:'20px',height:'180px'}} >
            <input placeholder='enter code here' type="text" value={ecode} onChange={(e)=>{setEcode(e.target.value)}} required/>
            <div className="lbotton">
              <button onClick={verify} id='verify' className='btns'>Verify</button>
              <p onClick={()=>{
                document.getElementById('rcode').style.display="none";
                document.getElementById('register').style.display="flex";
              }} className='reg'>back</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
