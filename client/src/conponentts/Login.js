import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";
import Loading from "./Loading";
function Login(props) {
  const [err,setErr]=useState(null);
  const { setUid, url, setIc } = props;
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [isprocess,setIsprocess]= useState(false);
  const [loginSuccess,setLoginSuccess]= useState(false);
  const onlyDigits = /^\d+$/;

  const nav = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    if(isprocess){
      return;
    }
    setIsprocess(true);
    setErr(null);
    if (phoneNo == "" || password == "" || phoneNo.length!=10 || !onlyDigits.test(phoneNo)) {
      setErr("Invalid credentials");
      setIsprocess(false);
      return
    }
    document.getElementById('loginbtn').style.fontSize = ".8rem";
    document.getElementById('loginbtn').innerText = "Just a Moment";
    setTimeout(() => {
      setIsprocess(false);
      setErr("Network error...")
      document.getElementById('loginbtn').innerText = "Login";
    }, 20000);
    const res = await fetch(`${url}/api/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        phoneNo,
        password,
      }),
    });
    const data = await res.json();
    if (data.status == "ok, user is login successfully") {
      setLoginSuccess(true);
      setTimeout(() => {
        setIc(true);
        setUid(data.id);
        window.localStorage.setItem("uid", data.id);
        window.localStorage.setItem("isCnt","false");
        setLoginSuccess(false);
        nav("/");
      }, 1000);
    } else {
      // alert(data.status);
      setErr(data.status);
      document.getElementById('loginbtn').style.fontSize = "unset";
      document.getElementById('loginbtn').innerText = "Login"
    }
    setIsprocess(false);
  };
  return (
    <div className="loginform">
      {isprocess && <div style={{position:'absolute',scale:'1.5',zIndex:'10'}}>
        <Loading/>
      </div> }
      {loginSuccess && <div className="loginSuccess" style={{position:'absolute',scale:'1.5',zIndex:'10'}}>
      </div> }
      {}
      <div>
        <div className="limage">
        </div>
        <form onSubmit={login} className="lform">
        <h1>Log In</h1>
          <input
            placeholder="Enter Your Number"
            type="text"
            value={phoneNo}
            onChange={(e) => {
                setPhoneNo(e.target.value);
            }}
            />{" "}
          
          <input
            placeholder="Enter Your Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            />
            { err && <p style={{color:"red",fontWeight:'bold',margin:'-15px'}} >{err}</p> }
          <div className="lbotton">
            <Link className="reg" to="/register">Sign Up</Link>
            <button id="loginbtn" className="btns" type="submit">
              Login
            </button>
            
            {/* <p onClick={()=>{nav("/register")}}>register</p> */}
            
          </div>
         <div style={{cursor:'pointer'}}><Link style={{color:'black',fontSize:'.9rem',textDecoration:"none"}} to="/cp">forget password </Link></div> 
          
        </form>
      </div>
    </div>
  );
}

export default Login;
