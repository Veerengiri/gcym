import React, { useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from './Loading'
function Spends(props) {
    const {url,uid,ic}= props;
    const [spends,setSpends]=useState([]);
    const [amount,setAmount]=useState(0);
    const [note,setNote]=useState("");
    const [sid,setSid]=useState("");
    const [total,setTotal]=useState(0);
    const nav = useNavigate();
    const getspends=async ()=>{
        const res = await fetch(`${url}/api/getspends/${uid}`,{
            method:"GET",
            headers:{
                "content-type":"application/json",
            }
        })
        const data = await res.json();
        // alert(data.status)
        if(data.status=="ok"){
          if(data.spends.length==0){
            setSpends([{
              amount:'no spends'
            }])
          }else{
            setSpends(data.spends);
            setTotal(data.total);
          }
        }
    }
    const addspend = async ()=>{
      if(amount==0){
        alert("0 is not valid amoutn");
        return;
      }
      const dt = new Date();
      const date= dt.getDate()+"/"+(dt.getMonth()+1)+"/"+dt.getFullYear();
      const res = await fetch(`${url}/api/addspends`,{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body: JSON.stringify({
          uId:uid,
          amount,
          date,
          note
        })
      })
      const data= await res.json();
      
      if(data.status=="ok"){
        getspends();
        setAmount(0);
        setNote("");
      }else{
        alert(data.status);
      }
    }
    const deletspend = async (sid)=>{
      const res= await fetch(`${url}/api/deletespends/${sid}`,{
        method:"DELETE",
        headers:{
          "content-type":"application/json"
        }
      })
      const data = await res.json();
      if(data.status!="ok"){

        alert(data.status);
      }
      getspends();
    }
    const updatespend= (id,amt,nt)=>{
      setSid(id);
      setAmount(amt);
      setNote(nt);
      document.getElementById('update').style.display= 'unset'
      document.getElementById('addspend').style.display= 'none'
    }
    const handleupdate= async ()=>{
      const res = await fetch(`${url}/api/updatespends`,{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body: JSON.stringify({
          amount,
          note,
          sid,
        })
      })
      const data= await res.json();
      if(data.status!="ok"){
        alert(data.status)
      }else{

        getspends();
        setAmount(0);
        setNote("");
        document.getElementById('update').style.display= 'none';
        document.getElementById('addspend').style.display= 'unset'
      }
    }
    useEffect(()=>{
        if(ic){
          getspends();
          document.getElementById('update').style.display= 'none'
        }else{
          nav('/home');
        }
    },[])
  return (
    <div className='spends' >
      <div className='hedder'>
        <h1>Spends</h1>
        <h1>Total: {total}</h1>
      </div>
      <div className='body'>
        <div className='left'>
          {
              spends.length!=0?(spends.map((s)=>{
                  return ( 
                    <div className='spend'>
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <p style={{color:'rgba(0, 0, 0, 0.487)'}}>{s.date}</p>
                        <div style={{display:`${s.amount=="no spends"?"none":"unset"}`}}>
                          <button className='btns2' onClick={(e)=>{
                            e.preventDefault(); 
                            deletspend(s._id);
                          }}><svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg></button>
                          <button className='btns2' id='change2'  onClick={(e)=>{
                            e.preventDefault();
                            updatespend(s._id,s.amount,s.note);
                          }}><img
                          src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
                          alt="I"
                        /></button>
                        </div>
                      </div >
                          <div style={{display:'flex',justifyContent:"space-around",padding:'10px 0px'}}>
                            <p id='notes' style={{fontSize:'1.2rem'}}>{s.note}</p>
                            <p style={{fontSize:'1.5rem',fontWeight:'bold'}}>{s.amount}</p>
                          </div>
                      </div>
                  )
              })): <Loading/>
          }
        </div>
        <div className='right'>
          <h2>Add Spends</h2>
          <div className='simage'></div>
          <div className='bottom'>
            <input type="number" placeholder='Enter amount here' value={amount==0?"":amount} onChange={(e)=>{setAmount(e.target.value)}} /><br />
            <input type="text" placeholder='Enter note here' value={note} onChange={(e)=>{setNote(e.target.value)}} /> <br />
            <button className='btns' id='addspend' onClick={addspend} >Add Spend</button>
            <button className='btns' id='update' onClick={handleupdate} >upldate</button>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Spends
