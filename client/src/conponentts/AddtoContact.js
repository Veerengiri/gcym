import React, { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom';
import Loading from './Loading'
import sound from "../Imagess/Notification.mp3"


function AddtoContact(props) {
    const oksound = new Audio(sound);
    const nav =useNavigate();
    const {url,uid,ic}= props;
    const [phoneNo,setPhoneNo]= useState("");
    const [users,setUsers]= useState([{
        name:"user",
        phoneNo:'phoneNo'
    }]);
    const [uname,setUname]=useState("");
    const handlesubmit = async (e)=>{
        e.preventDefault();
        if(phoneNo.length!=10){
            alert('invalid phone number');
            return;
        }
        const adc = await fetch(`${url}/api/addtocontact/${uid}/${phoneNo}/${uname.length==0?"new user":uname}`,{
            method:'GET',
            headers: {
                "Content-Type":"applicatin/json"
            }
        })
        
        const data = await adc.json();
        if(data.status=="ok"){
            oksound.play()
            nav('/');
        }else{
            alert(data.status);
        }
        setPhoneNo("");
    }
    const getusers= async(e)=>{
        if(phoneNo.length<=1){

            setUsers([{
                name:"user",
                phoneNo:'phoneNo'
            }]);
            return;
        }
        const resp = await fetch(`${url}/api/finduser/${phoneNo}`,{
            method:"GET",
            headers: {
                "Content-Type":"applicatin/json"
            }
        })
        const data=await resp.json();
        
        setUsers(data.users);
    }
    useEffect(()=>{
        // getusers();
        if(!ic){
            nav('/home');
        }
    },[])
  return (
    <div className='addcontact'>
        <div className='topbar'>
            <h1>Add to Contact</h1>
        </div>
        <div className='hedder'>
            <div className='left'>
            </div>
            <form className='right' onSubmit={handlesubmit}>
                <input type="text"  value={phoneNo}
                placeholder="Enter Number"
                onChange={(e)=>{
                    e.preventDefault();
                    setPhoneNo(e.target.value);
                    // if(phoneNo.length!=0){getusers()}
                    }}/> <br />
                <input placeholder='Enter Name ' type="text" value={uname} onChange={(e)=>{setUname(e.target.value)}} /> <br />
                <button className='btns' type="submit">add customer</button>
            </form>
        </div>
        {/* <div className='bottom'>
            {users.length!=0?users.map((u,id)=>{
                return (<div className='user' key={id} onClick={()=>{ setPhoneNo(u.phoneNo) }}>  
                    <p>{u.name}</p>
                    <p>{u.phoneNo}</p>
                    
                </div>)
            }): <Loading/> }
        </div> */}
    </div>
  )
}

export default AddtoContact
