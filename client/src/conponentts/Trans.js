import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import sound from "../Imagess/Notification.mp3"
import deletesound from "../Imagess/delete.mp3"
import sound2 from "../Imagess/tab.wav"

function Trans(props) {
  const tabs = new Audio(sound2);
  const oksound = new Audio(sound);
  const deletes= new Audio(deletesound);
  deletes.volume = 0.5;
  const { sid, rid, url, ic ,setIsChanged} = props;
  const [trans, setTrans] = useState([]);
  const [camount, setCamount] = useState(null);
  const [tamount, setTamount] = useState(0);
  const [note, setNote] = useState("");
  const [isgave, setIsgave] = useState(true);
  const [cid, setCid] = useState("");
  const [cname, setCName] = useState("");
  const [isnagative,setIsnagative]=useState(false);
  const [call,setCall]=useState(false);
  const nav = useNavigate();
  const [isprocess,setIsprocess]=useState(false);
  const [curbalance,setCurbalance]=useState([]);
  const [reciver,setReciver]=useState(null);
  // const isAndroid = /(android)/i.test(navigator.userAgent);
  // const isiOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
  // let paymentId="";
  const getuserinfo = async () => {
    const res = await fetch(`${url}/api/userFindById/${rid}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    const users = await res.json();
    if (users.status == "ok") {
      setCName(users.user.name);
    }
  };
  const getdata = async () => {
    setIsprocess(true);
    let curamoutn = null;
    const re = await fetch(
      `${url}/api/contactupdateamount/${sid}/${rid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const dt = await re.json();
    dt ? setCamount(dt.amount) : setCamount(0.0);
    curamoutn=dt.amount;
    const response = await fetch(
      `${url}/api/gettra/${sid}/${rid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.status == "ok") {
      if(data.tra.length==0){
        setTrans([{
          note:'no transactions'
        }])
      }else{
        setReciver(data.user);
        // let reciver = data.user;
        // paymentId = `upi://pay?pa=${reciver.upi}&pn=${reciver.name}&am=${Math.abs((curamoutn.toFixed(2)))}&cu=INR`
        // paymentId=paymentId.toString();
        // console.log(paymentId);
        let st=data.tra ;
        let n= st.length;
        setTrans(st);
        // alert(curamoutn)
        let aTB =[];
        aTB.push(curamoutn);
        for(let i=0;i<n-1;i++){
          if(st[i].name==="you"){
            curamoutn=curamoutn- st[i].amount;
          }else{
            curamoutn=curamoutn+st[i].amount;
          }
          aTB.push(curamoutn);
        }
        setCurbalance(aTB);
      }
      clearNotify();
    } else {
      setTrans(["not found"]);
    }
    setIsprocess(false);
  };

  const getdata2 = async () => {
    setIsprocess(true);
    let curamoutn = null;
    const re = await fetch(
      `${url}/api/contactupdateamount/${sid}/${rid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const dt = await re.json();
    dt ? setCamount(dt.amount) : setCamount(0.0);
    curamoutn=dt.amount;
    const response = await fetch(
      `${url}/api/getlastTra/${sid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.status == "ok") {
      if(data.tra.length==0){
        setTrans([{
          note:'no transactions'
        }])
      }else{
        let st=data.tra;
        setTrans([st,...trans]);
        st = [st,...trans]
        console.log(st)
        // alert(curamoutn)
        let aTB =[];
        aTB.push(curamoutn);
        for(let i=0;i<st.length;i++){
          if(st[i].name==="you"){
            curamoutn=curamoutn- st[i].amount;
          }else{
            curamoutn=curamoutn+st[i].amount;
          }
          aTB.push(curamoutn);
        }
        setCurbalance(aTB);
        console.log(aTB)
        clearNotify();
      }
    } else {
      setTrans(["not found"]);
    }
    setIsprocess(false);
  };
  
  const getalldata = async (props) => {
    setCall(true);
    setTrans([]);
    const response = await fetch(
      `${url}/api/getalltra/${sid}/${rid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.status == "ok") {

      if(data.tra.length==0){
        setTrans([{
          note:'no transactions'
        }])
      }else{
        let st=data.tra ;
        let n= st.length;
        
        setTrans(st);
        let aTB =[];
        let curamoutn= camount
        aTB.push(curamoutn);
        for(let i=0;i<n-1;i++){
          if(st[i].name==="you"){
            curamoutn=curamoutn- st[i].amount;
          }else{
            curamoutn=curamoutn+st[i].amount;
          }
          aTB.push(curamoutn);
        }
        setCurbalance(aTB);
      }
    } else {
      setTrans(["not found"]);
    }
  };
  const notify = async ()=>{
    await fetch(
      `${url}/api/notify/${rid}/${sid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
  const clearNotify = async ()=>{
    await fetch(
      `${url}/api/clearnotify/${sid}/${rid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
  
  const getamount = async () => {
    const response = await fetch(
      `${url}/api/contactupdateamount/${sid}/${rid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    data ? setCamount(data.amount) : setCamount(0.0);
    
  };
  const medtra = async (isYougave) => {
    await tabs.play()
    await setIsgave(isYougave);
    await setTamount(0);
    await setNote("");
    document.getElementById("form").style.display = "unset";
    document.getElementById("tradiv1").style.animationName = "showform";
  };
  const submithandle = async (e) => {
    e.preventDefault();
    await tabs.play();
    if(isprocess){
      return;
    }
    if (tamount < 0) {
      alert("nagative value not allowed");
      return;
    }
    if(note.length>=50){
      alert("50 charactars are allowed");
      return;
    }
    setIsprocess(true);
    const d = new Date();
    const date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    const time = d.getHours() + ":" + d.getMinutes();
    const fulltime = Date.now();
    let isdebt;
    // if(!isgave){setTamount(0-tamount)}
    // tamount<0?isdebt=true:isdebt=false;

    const res = await fetch(`${url}/api/addtra/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        senderId: sid,
        recId: rid,
        amount: !isgave ? 0 - tamount : tamount,
        date,
        time,
        fulltime,
        isdebt: !isgave,
        note:note==""?"-":note,
      }),
    });
    const data = await res.json();
    if(data.status=="transaction added successfully"){
      document.getElementById("tradiv1").style.animationName = "endform";
      setTimeout(() => {
        document.getElementById("form").style.display = "none";
      }, 400);
      localStorage.setItem("isCnt","false");
      await getdata();
      oksound.play()
      timeupdate();
      setTamount(0);
      setIsChanged(1);
      setNote("");
      
    }else{
      alert(data.status); 
    }
    setIsprocess(false);
  };
  const delettra = async (id) => {
    if (!window.confirm("delete!")) {
      return;
    }
    const a = await fetch(`${url}/api/deletetran/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await a.json();
    if(data.status=="transaction deleted"){
      localStorage.setItem("isCnt","false");
      await getdata();
      deletes.play()
      // getamount();
      timeupdate()
      setIsChanged(1);
    }else{
      alert(data.status);
    }
  };
  const handlechange = async (e) => {
    e.preventDefault();
    await tabs.play();
    if(note.length>50){
      alert("50 charactars are allowed");
      return;
    }
    setIsprocess(true);
    if (tamount < 0) {
      alert("nagative value not allowed");
      return;
    }
    const res = await fetch(`${url}/api/changetra`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cid,
        tamount: isnagative?0-tamount:tamount,
        note,
      }),
    });
    const data = await res.json();
    if(data.status=="change successfully"){
      document.getElementById("tradiv").style.animationName = "endform";
      setTimeout(() => {
        document.getElementById("form1").style.display = "none";
      }, 400);
      localStorage.setItem("isCnt","false");
      await getdata();
      oksound.play()
      // getamount();
      timeupdate();
      setTamount(0);
      setIsChanged(1);
      setNote("");
    }else{
      setIsprocess(false);
      alert(data.status);
    }
  };
  const changetra = (id, amnt, not) => {
    setCid(id);
    if(amnt<0){
      setTamount(0-amnt);
      setIsnagative(true);
    }else{
      setTamount(amnt);
    }
    setNote(not);
    document.getElementById("form1").style.display = "unset";
    document.getElementById("tradiv").style.animationName = "showform";
  };
  const timeupdate = async () => {
    notify()
    await fetch(`${url}/api/updatetime/${sid}/${rid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // alert(data.status);
  };
  
  window.addEventListener("beforeunload", function(event) {
    nav("/home");
  });
  // document.addEventListener("keydown", function(event) {
  //   if (event.keyCode === 116) { // 116 is the key code for F5
  //     nav("/home")
  //   }
  // });
  useEffect(() => {
    if (ic) {
      // getamount();
      getdata();
      getuserinfo();
      document.getElementById("form").style.display = "none";
      document.getElementById("form1").style.display = "none";
    } else {
      nav("/home");
    }
  }, []);
  
  return (
    <div  className="trans">
    
  
      {/* {(isAndroid || isiOS) && reciver && (camount<0) && reciver.upi!="null" && 
        <a href={`upi://pay?pa=${reciver.upi}&pn=${reciver.name}&am=${Math.abs((camount.toFixed(2)))}&cu=INR`} className="addcus" style={{scale:'.8',bottom: "100px",right:'10px'}} > 
          <img style={{width:'40px'}} src="https://cdn-icons-png.flaticon.com/128/483/483742.png" alt="" /> 
        </a>
      } */}
      {isprocess && <div style={{position:'absolute',top:'40vh',right:'35vw',scale:'1.5',zIndex:'10'}}>
        <Loading/>
      </div> }
      <div className="cntname">
          <div style={{display:"flex",alignItems:'center',gap:"10px"}}>
            <Link to="/" className="backbtn"></Link>
            <h1>{cname?cname:"Loading..."} </h1>
          </div>
          <h2> total: {camount!=null?camount:"Loading..."}</h2>
      </div>
      <div className="cnthed">
        <div id="df">
          <p>you gave</p>
          <p>you got</p>
        </div>
      </div>
      {/* <p >You will get</p>
        <p >You will give</p> */}
      <div>
        {trans.length != 0 ? (
          trans.map((t,i) => {
            let a = false;
            if (
              (t.amount < 0 && t.name == "you") ||
              (t.amount > 0 && t.name != "you")
            ) {
              a = true;
            }

            return (
                <div key={t.id} className="ptra">
                  <div>
                    <p style={{ fontWeight: "300" }}>{t.name}</p>
                    <div>
                      <button
                        className=" btns2"
                        style={{
                          display: `${t.name == "you" ? "unset" : "none"}`,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          delettra(t.id);
                        }}
                      >
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>{" "}
                      </button>
                      <button
                        id="change"
                        className=" btns2"
                        style={{
                          display: `${t.name == "you" ? "unset" : "none"}`,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          tabs.play()
                          changetra(t.id, t.amount, t.note);
                        }}
                      >
                        {" "}
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
                          alt="I"
                        />{" "}
                      </button>
                    </div>
                  </div>
                  <div style={{ margin: "5px 0" }}>
                    <p style={{ marginLeft: "5vw",marginRight:"2vw",overflowY:'auto' }}>{t.note}</p>
                    <p
                      style={{
                        width: "20vw",
                        marginRight: "5vw",
                        fontWeight: "bold",
                        fontSize: "1.4rem",
                        textAlign: `${a ? "end" : "start"}`,
                        color: `${a ? "green" : "red"}`,
                      }}
                    >
                      {Math.abs(t.amount)}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "rgba(0, 0, 0, 0.416)" }}>Balace: {curbalance[i]}</p>
                    <p style={{ color: "rgba(0, 0, 0, 0.416)" }}>
                      {t.time}
                    </p>
                    <p style={{ color: "rgba(0, 0, 0, 0.416)" }}>
                      {t.date}
                    </p>
                  </div>
                </div>
            );
          })
        ) : (
          <div className="cdloading">Loading...</div>
        )}
        <div style={{display:`${!call?"flex":"none"}`,justifyContent:'center',alignItems:'center',gap:"10px"}}>
         
          <label htmlFor="loadmore">Load more</label>
          <button  className="reloadbtn" name="loadmore" onClick={getalldata}></button>
        </div>
      </div>
      <div className="gavegot">
        <button
          id="yougave"
          onClick={() => {
            medtra(true);
          }}
        >
          you gave
        </button>
        <button
          id="yougot"
          onClick={() => {
            medtra(false);
          }}
        >
          you got
        </button>{" "}
      </div>
      <form id="form" className="traform" onSubmit={submithandle}>
        <div id="tradiv1" className="tradiv">
          <div>
            <h1>{isgave ? "You gave" : "You got"}</h1>
            <input
              type="number"
              value={tamount == 0 ? "" : tamount}
              placeholder="Enter Amount Here"
              onChange={(e) => {
                setTamount(e.target.value);
              }}
            />

            <input
              type="text"
              value={note}
              placeholder="Enter Note Here"
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
            <div className="lbotton">
              <button className="btns" type="submit">
                {isprocess?"please wait...":"submit"}
              </button>
              <p
                className="reg"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tradiv1").style.animationName = "endform";
                  setTimeout(() => {
                    document.getElementById("form").style.display = "none";
                  }, 400);
                }}
              >
                back
              </p>
            </div>
          </div>
        </div>
      </form>
      <form id="form1" className="traform" onSubmit={handlechange}>
        <div id="tradiv" className="tradiv">
          <div>
            <div>
              <p>Amount: </p>
              <input
                type="number"
                value={tamount}
                onChange={(e) => {
                  setTamount(e.target.value);
                }}
              />
            </div>
            <div>
              <p>Note: </p>
              <input
                type="text"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
            <span className="lbotton">
              <button className="btns" type="submit">
              {isprocess?"please wait...":"submit"}
              </button>
              <p
                className="reg"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tradiv").style.animationName = "endform";
                  setTimeout(() => {
                    document.getElementById("form1").style.display = "none";
                  }, 400);
                }}
              >
                back
              </p>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Trans;
