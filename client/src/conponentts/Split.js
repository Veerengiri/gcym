import React, { useState ,useEffect} from 'react'
import { useNavigate} from 'react-router-dom';
import Loading from './Loading';
function Split(props) {
    const nav = useNavigate();
    const {url,uid,ic}=props;
    const [contacts,setContacts]=useState([]);
    const [sc,setSc]=useState([]);
    const [split,setSplit]= useState([]);
    const [amount,setAmount]=useState(0);
    const [isprogress,setIsprogress]=useState(false);
    
    
    const refresh = async ()=>{
      setContacts([]);
      const res = await fetch(`${url}/api/getallcontact/${uid}`,{
        method:"GET",
        headers:{
          "Contect-type":"application/json"
        }
      })
      const data = await res.json();
      if(data.contact.length==0){
        setContacts([{name:"no contacts"}])
      }else{
        const alc = data?.contact;
        setContacts(alc);
        window.localStorage.setItem("allcnt",JSON.stringify(alc));
      }
    }
    const getcontact= async ()=>{
      const allcnt = window.localStorage.getItem("allcnt");
      if(allcnt){
        setContacts(JSON.parse(allcnt));
        return;
      }else{
        refresh();
      }
    }
    const addsplit= (id, cnt)=>{
      // for (let i = 0; i < sc.length; i++) {
      //   const el = sc[i];
      //   if(el.id == id){
      //     return;
      //   }
      // }
      if(split.includes(id)){
        let spl = [];
        
        split.forEach(el => {
          if(el!=id){
            spl.push(el);
          }
        });
        setSplit(spl);
      }else{
        setSplit([...split,id]);
      }
      // setSc([...sc,cnt]);
    }
    const deletecnt = (id)=>{
      let ind=-1;
      for (let i = 0; i < sc.length; i++) {
        const el = sc[i];
        if(el.id==id){
          ind = i;
          break;
        }
      }
      // alert(ind);
      let sc2 = sc;
      sc2.splice(ind,ind);
      setSc(sc2);
      let sc3 = split;
      sc3.splice(ind,ind);
      setSplit(sc3);
    }
    const splitnow = async (e)=>{
      e.preventDefault();
      setIsprogress(true);
      setTimeout(() => {
        if(isprogress){
          setIsprogress(false);
          alert("network err...");
          return;
        }
      }, 30000);
      if(amount<=0){
        setIsprogress(false);
        alert("nagative or zero not allowed!");
        setAmount(Math.abs(amount));
        return;
      }
      if(split.length<2){
        setIsprogress(false);
        alert('atleast 2 contact required to split');
        return;
      }
      const dt = new Date();
      const date= dt.getDate()+"/"+(dt.getMonth()+1)+"/"+dt.getFullYear();
      const time= dt.getHours()+":"+dt.getMinutes();
      const res = await fetch(`${url}/api/split`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body: JSON.stringify({
          sid: uid,
          split,
          amount,
          date,
          time,
        })
      })
      const data = await res.json();
      
      if(data.status=="transaction added successfully"){
        setAmount(0);
        setSplit([]);
        setSc([]);
        setIsprogress(false);
        nav('/');
      }else{
        setIsprogress(false);
        alert(data.status);
      }
    }
    const reset = (e)=>{
      e.preventDefault();
      setSc([]);
      setSplit([]);
    }
    useEffect(()=>{
      if(ic){
        getcontact();
      }else{
        nav('/home');
      }
      
    },[])
  return (
    <div className='splits'>
      {isprogress && <div style={{position:"absolute",bottom:'0',height:'80vh',width:'100vw',zIndex:10}}><Loading/></div> }
      <div className='hedder'>
        <h1 style={{marginRight:'10px'}}>Split Money</h1>
        <div className='reloadbtn' onClick={refresh}></div>
      </div>
      
      <div className='down'>
        <div className='leftdiv'>
        {/* <div className='left'>
          <div className='hed' style={{display:'flex',gap:"10px",marginBottom:'15px'}}>
            <h1>Split With</h1>
            <div className='lbotton'><p onClick={reset} className='reg'>Reset</p></div>
          </div>
          {
            sc.map((s)=>{
              return (
                <div className='cnt' >
                  
                  <p>{s.name}</p>
                  <p> {s.phoneNo} </p>
                </div>
              )
            })
          }
        </div> */}
        <div className='right'>
          <h1 style={{marginBottom:'15px',borderBottom:"5px solid rgb(0,0,0,.2)"}}>Your Contact</h1>
          { contacts.length!=0?
            contacts.map((c)=>{
              return ( <div className='cnt' style={{border:`${split.includes(c.id)?"3px solid rgb(255,0,0,.3)":"unset"}`}} onClick={(e)=>{
                e.preventDefault();
                addsplit(c.id,c);
              }} >
                <p>{c.name}</p>
                <p> {c.phoneNo} </p>
              </div> )
            }): <Loading/>
          }
          
        </div>
        </div>
        
        <div className='up'>
          <div className='upleft'></div>
          <div className='upright'>
            <input placeholder='Enter Split Amount' type="number" value={amount==0?"":amount} onChange={(e)=>{setAmount(e.target.value)}} /> 
            <button className='btns' onClick={splitnow}>split with {split.length+1}</button>
          </div>
      </div>
      </div>
    </div>
  )
}

export default Split
