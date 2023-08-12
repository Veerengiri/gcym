import React, { useEffect, useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
let code = Math.round(1000000 * Math.random()).toString();

function Changepass(props) {
  const {url}=props;
  const nav= useNavigate();
  const [email,setEmail]= useState("");
  const [password,setPassword]= useState("");
  const [phoneNo,setPhoneNo]= useState("");
  const [cp,setCp]= useState("");    
  const [ecode,setEcode]= useState("");
  const form = useRef();

  const sendEmail = () => {
    // e.preventDefault();
    emailjs.sendForm('service_z80kdsc', 'template_pkan5j9', form.current, "tAnIMRTGjOth0eHFS")
    .then((result) => {
        // console.log(result.text);
        alert("code is send to your email...");
        document.getElementById('cverify').style.display='flex';
        document.getElementById('cp').style.display='none'; 
        document.getElementById('cpimage').style.height = '200px';
    }, (error) => {
        console.log(error.text);
        alert("error");
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
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
    //   Body: "your verification code : " + code,
    // }).then(() => {
    //   document.getElementById('cverify').style.display='flex';
    //   document.getElementById('cp').style.display='none';
    //   document.getElementById('cpimage').style.height = '200px';
    // });
    sendEmail();
    // alert("code is send to your email");
  };
  const handleverify = async (e) => {
    e.preventDefault();
    if(ecode == code){
      
        const res= await fetch(`${url}/api/changepass`,{
          method:"POST",
          headers:{
            "content-type":"application/json"
          },
          body:JSON.stringify({
            phoneNo,
            email,
            password
          })
        })
        const data = await res.json();
        alert(data.status);
        if(data.status=="ok"){
          nav("/login");
        }
      }else{
        alert("invalid code");
      }
  };
    useEffect(()=>{
      document.getElementById('cverify').style.display='none';
      document.getElementById('cp').style.display='flex';
    },[])
  return (
    <div className="loginform">
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
        <div id="cpimage" className="cpimage"></div>
        <div  className="lform">
          <h1>Forget Password</h1>
          {/* <Link to="/login">🔙</Link> */}
          <form id="cp" className="rform" onSubmit={handlesubmit}>
            <input placeholder="enter your email" type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
            
            <input placeholder="enter your phoneno" type="text" required value={phoneNo} onChange={(e)=>{setPhoneNo(e.target.value)}} />
            <input placeholder="enter your password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required/>
            
            <input placeholder="confirm password" type="password" value={cp} onChange={(e)=>{setCp(e.target.value)}} required/>
            <div className="lbotton">
            <button type="submit" className="btns">Submit</button>
            <Link  className="reg" to="/login">back</Link>
            </div>
          </form>
          <form id="cverify" className="rform" onSubmit={handleverify}>
            <input placeholder="enter code here" type="text" value={ecode} onChange={(e)=>{ setEcode(e.target.value)}} />
            <div className="lbotton">
              <button type="submit" className="btns">Verify</button>
              <Link className="reg" to="/login">back</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Changepass;
