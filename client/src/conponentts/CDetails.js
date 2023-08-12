import React,{useEffect,useRef,useState} from "react";
import {useNavigate} from 'react-router-dom'
import Loading from "./Loading";
import sound from "../Imagess/tab.wav"


function CDetails(props) {
    const oksound = new Audio(sound);
    const [contact, setContact] = useState([]);
    const {setRid,uid,setAmt,url,rid,isChanged,setIsChanged,mainuser,setMainuser}=props;
    const [credit,setCredit]= useState(null);
    const [debt,setDebt] = useState(null);
    const [call,setCall]=useState(false);
    // const [upi,setUpi]=useState("");
    // const [isprocess,setIsprocess]=useState(false);
    // const [isref,setIsref]=useState(false);
    // let isstore = false;
    let userid;
    // if(uid!=""){
    //   userid =uid;
    // }
    const nav= useNavigate();
    const refbtn = useRef(null);
    const setdata = async (id , amt)=>{
        await oksound.play()
        await setRid(id); 
        await setAmt(amt);
        nav("/tran");
    }
    const showalldata = async (e)=>{
      e.preventDefault();
      await oksound.play()
      setCall(true);
      const response = await fetch(
        `${url}/api/getallcontact/${uid}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      
      const data = await response.json();
      // console.log(data.contact);
      // console.log("userId is: "+uid);
      if (data.status == "ok") {
        if(data.contact.length===0){
          setContact([{name:'no contact'}])
        }else{
          let cont = contact;
          let newcont = [...cont,...data?.contact]
          setContact(newcont);
        }
      }
    }
    const getdata = async (isref) => {
      setContact([])
      setCall(false);
      let isstore = localStorage.getItem("isCnt");
      if(isref===false && isstore==="true"){
        let cntres = JSON.parse(localStorage.getItem('contactdt'));
        let cnt = cntres?.contact;
        if(rid!=""){
          cnt.forEach(el => {
            if(el.id==rid){
              el.notify=0;
            }
          });
        }
        cntres.contact = cnt;
        localStorage.setItem('contactdt',JSON.stringify(cntres))
        if(cntres.totalcontact<=8){
          setCall(true)
        }
        setContact(cnt);
      }else{
        getonlyamt()
        let cururl  =`${url}/api/getcontact/${userid?userid:uid}`;
        const response = await fetch(cururl,{
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          }
        );
        
        const data = await response.json();
        let cont = data.contact;
        // console.log(data.contact);
        if (data.status == "ok") {
          if(cont.length===0){
            setContact([{name:'no contact'}])
          }else{
            setContact(cont);
            if(data.totalcontact<=8){
              setCall(true);
            }
            localStorage.setItem("isCnt","true");
            localStorage.setItem('contactdt',JSON.stringify(data) );
          }
        }
      }
    };

    const getsinglecontact  = async ()=>{
      getonlyamt();
      const response = await fetch(
        `${url}/api/getsinglecontact/${uid}/${rid}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      let newamt = data.cntamt;
      
      let cntres = JSON.parse(localStorage.getItem('contactdt'));
      let cnt = cntres?.contact;
      let indexToRemove = -1;
      cnt.forEach((el,i) => {
        if(el.id==rid){
          el.amount=newamt;
          indexToRemove =i;
          console.log(i)
        }
      });
      const removedObject = cnt.splice(indexToRemove, 1)[0];
      cnt.unshift(removedObject);
      setContact(cnt);
      cntres.contact = cnt;
      localStorage.setItem('contactdt',JSON.stringify(cntres))
    }
    const getonlyamt = async ()=>{
      setCredit(null);
      const response2 = await fetch(`${url}/api/updateamount/${userid?userid:uid}`,{
        method: "GET",
          headers: {
          "content-type": "application/json",
        },
      })
      const data2= await response2.json();
      if(data2.status=="ok"){
        setCredit(data2.credit);
        setDebt(data2.debt);
        window.localStorage.setItem("amt",`${data2.credit} ${data2.debt}`);
      }
    }

    const getamount = async ()=>{
      setCredit(null);
      setDebt(null);
      console.log(isChanged);
      if(isChanged==1){
        getsinglecontact();
        setIsChanged(0);
      }else if(isChanged==0){
        getdata(false);
        let camt = localStorage.getItem('amt');
        let amta = camt.split(" ");
        setCredit(parseInt(amta[0]))
        setDebt(parseInt(amta[1]))
      }else{
        // console.log(isChanged+" is changed")  
        refbtn.current.click();
        setIsChanged(0)
      }
    }

    // const submithandle = async (e)=>{
    //   e.preventDefault();
    //   if(upi.length<3 || upi.length>50){
    //     alert("Invalid UPI...");
    //     return;
    //   }
    //   setIsprocess(true)
    //   const response = await fetch(
    //     `${url}/api/addupi/${uid}/${upi}`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "content-type": "application/json",
    //       },
    //     }
    //     );
        
    //   const data = await response.json();
    //   if(data.status=="ok"){
    //     let mu = mainuser;
    //     mu.upi = upi;
    //     setUpi("");
    //     setMainuser(mu)
    //   }
    //   setIsprocess(false)
    // }
    // window.addEventListener("beforeunload", function(event) {
    //   nav("/home");
    // });
    
    useEffect( () => {
      userid = window.localStorage.getItem('uid');
      if(!userid){
        nav("/home");
        return;
      }else{
        // document.getElementById("form").style.display='none'
        getamount()
      }
    }, []);
  return (
    <div className="cdetails">
      <div className="chedder">
        {/* <h1 style={{color:"red"}}>You will get:   {credit==null?"...":credit}  </h1>
        <h1 style={{color:"blue"}}>you will give:  {debt==null?"...":debt} </h1> */}
        <h1>Net balance: {credit==null?"...":(credit-debt)} </h1>
        <button className="reloadbtn" name="reload" ref={refbtn} onClick={(e)=>{
          e.preventDefault()
          oksound.play()
          setIsChanged(-1);
          getdata(true)
        }}></button>
      </div>
      
      <div className="ched">
        <p className="cntnames" >Contact name</p>
        <p className="cdphoneNo" style={{width:'10vw',textAlign:'center'}}>phone No</p>
        <p className="cbalance" >balance</p>
      </div>
      <div>
        { contact.length!=0? contact.map((a,i) => {
          return (
            <div key={a.phoneNo} className="ucont"
              onClick={() => {
                setdata(a.id,a.amount);
              }}
            >
              <p className="cntnames" style={{fontWeight:`${a.notify && a.notify>0?"bold":"unset"}`}}>{a.name}</p>
              <p className="cdphoneNo" style={{width:'10vw',textAlign:'center',fontWeight:`${a.notify && a.notify>0?"bold":"unset"}`}}>{a.phoneNo}</p>
              <p className="cbalance" style={{color:`${a.amount>0?"blue":"red"}`,fontWeight:`${a.notify && a.notify>0?"bold":"unset"}`}}>{a.amount}</p>
              {/* {a.notify!=0 &&<p className="cntnames" style={{position:'relative',backgroundColor:'red',right:"20px",width:"20px"}} >{a.notify}</p>} */}
            </div>
          );
        }
        ): <div className="cdloading cld"><Loading/></div> }
        { !call &&  <div style={{display:"flex",justifyContent:'center',alignItems:'center',gap:'10px'}}>
          <label htmlFor="loadmore">Load more</label>
          <button  className="reloadbtn" name="loadmore" onClick={showalldata}></button>
        </div> }
        {/* {mainuser  && <div className="addcus" style={{scale:'.8',bottom: "115px",cursor:'pointer'}} onClick={(e)=>{
          e.preventDefault();
          // open add upi popup
          document.getElementById("tradiv1").style.animationName = "showform";
          document.getElementById("form").style.display='flex'
          // setHandleform(true);
          if(mainuser.upi!="null"){
            setUpi(mainuser.upi);
          }
        }}> <img src="https://cdn-icons-png.flaticon.com/128/10157/10157957.png" alt="" /> </div>} */}
        
        <div className="addcus" style={{scale:'.8',cursor:'pointer'}} onClick={(e)=>{
          e.preventDefault();
          oksound.play()
          nav('/atc');
        }}> <img src="https://cdn-icons-png.flaticon.com/128/3059/3059520.png" alt="" /> </div>

        {/* {<form id="form"  className="traform" onSubmit={submithandle}>
            <div id="tradiv1" className="tradiv">
              <div>
                <h1>{mainuser?.upi=="null"?"Add":"Update"} Your UPI Id</h1>
                <input
                  type="text"
                  value={upi}
                  placeholder="Enter UPI id"
                  onChange={(e) => {
                    setUpi(e.target.value);
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
                      // setHandleform(false)
                      }, 400);
                    }}
                  >
                    back
                  </p>
                </div>
              </div>
            </div>
      </form>} */}
      </div>
    </div>
  );
}

export default CDetails;
