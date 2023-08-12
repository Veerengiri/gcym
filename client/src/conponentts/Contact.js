import React, { createContext, useDebugValue } from "react";
import { useEffect, useState } from "react";

import { Routes, BrowserRouter, Route, useNavigate, useNavigation } from "react-router-dom";
import Trans from "../conponentts/Trans";
import AddtoContact from "./AddtoContact";
import CDetails from "./CDetails";
import Changepass from "./Changepass";
import Login from "./Login";
import Navbar from "./Navbar";
import Register from "./Register";
import Spends from "./Spends";
import Split from "./Split";
import Alert from "./Alert";
import Homepage from "./Homepage";


// export const  MyContext = createContext();
function Contact() {
  
  const [rid,setRid]=useState("");
  const [amt,setAmt]=useState(0);
  const [uid,setUid]=useState("");
  const [ic,setIc]=useState(false);
  const [isChanged,setIsChanged]=useState(-1);
  const [mainuser,setMainuser]=useState(null);
  
  // const url =  "https://cymserver.vercel.app";
  // const url = "http://localhost:7000";
  const url = "https://cym2023-veerengiri.vercel.app";

  const logout = ()=>{
    // window.localStorage.removeItem('uid');
    window.localStorage.clear();
    setUid("");
    setIc(false);
  }
  const fetchuser= async (userid)=>{
    const response = await fetch(
      `${url}/api/userFindById/${userid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    
    const data = await response.json();
    if(data.status=="ok"){
      setMainuser(data.user)
    }else{
      setMainuser(null)
    }
  }
  useEffect(()=>{
    const userid  = window.localStorage.getItem('uid');
    if(userid){
      fetchuser(userid);
      setUid(userid);
      setIc(true);
    }else{
      setUid("");
    }
  },[]);
  
  return (
    
    <BrowserRouter>
    <div className="homepage" >
      <div>
        <Navbar logout = {logout} ic={ic} url={url} uid={uid}/>
      </div>
      <Alert title= "alert"/>
      <div>
        <Routes>
          <Route path="login" element={<Login setUid = {setUid} setIc={setIc} url={url} />}/>
          <Route path="register" element={<Register url = {url}/>}/>
          <Route path="cp" element={<Changepass url = {url}/>}/>
          <Route path="/home" element={<Homepage ic={ic}/>} />
          <Route path="/" element={<CDetails mainuser={mainuser} setMainuser={setMainuser} url = {url} uid={uid} rid={rid} setIsChanged={setIsChanged} isChanged={isChanged} setRid={setRid} setAmt={setAmt}/>} />
          <Route path="tran" element={<Trans ic={ic} url = {url} setIsChanged={setIsChanged} sid={uid} rid={rid} />}/>
          <Route path='atc' element = {<AddtoContact ic={ic} url= {url} uid={uid}/>}/>
          <Route path='split' element = {<Split ic={ic} url= {url} uid={uid}/>}/>
          <Route path='spends' element = {<Spends ic={ic} url= {url} uid={uid}/>}/>
        </Routes>
      </div>
      
    </div>
        {/* <Footer ic={ic}/> */}
      </BrowserRouter>
  );
}


export default Contact;