import React,{useEffect,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom';
import Footer from './Footer';
function Navbar(props) {
    const {logout,ic,url,uid}=props;
    const nav = useNavigate();
    const [user,setUser]=useState({});
    let a = false;
    const isAndroid = /(android)/i.test(navigator.userAgent);
    const isiOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
    const getdata = async ()=>{
      const res= await fetch(`${url}/api/userFindById/${uid}`,{
        method:"GET",
        headers: {
          "content-type": "application/json",
        },
      })
      const ur = await res.json();
      setUser(ur.user);
    }
    useEffect(() => {
        getdata();
        a = false;
    }, [uid])
    
  return (
    <div style={{display:`${window.location.pathname=="/home"?"none":"flex"}`}}>
      <div  className='toggler'>
        <img onClick={()=>{
          document.getElementById('navbar').style.marginLeft=0;
          a = true;
        }} src="https://cdn-icons-png.flaticon.com/512/9183/9183113.png" alt="" />
        <div className='logo'>
            <img src="https://cdn-icons-png.flaticon.com/128/7871/7871089.png" alt="" />
            <h1>CYM</h1>
        </div>
        <div className='profile'>
            <p>{user.name?user.name.charAt(0).toUpperCase():"U"}</p>
        </div>
        
      </div>
      <div id='navbar' className='mainnav' style={{display:`${ic?"flex":"none"}`}}>
        <div  className='navbar'>
          <div style={{display:'flex',justifyContent:'flex-end',width:'250px'}}>
            <button  id='backimg' onClick={()=>{
              document.getElementById('navbar').style.marginLeft="-400px"
            }}> <img id='backimg' src="https://cdn-icons-png.flaticon.com/128/1828/1828666.png" alt="<" /> </button>
          </div>
          <div id='logo' className='logo'>
            <img src="https://cdn-icons-png.flaticon.com/128/7871/7871089.png" alt="" />
            <h1>CYM</h1>
          </div>
          <div id='profile' className='profile'>
            <p>{user.name?user.name.charAt(0).toUpperCase():"U"}</p>
            <h2 style={{textAlign:'center'}}> {user.name} </h2>
          </div>
          <Link className='navitem active' id='home' to="/" onClick={(e)=>{
            
            document.getElementById('home').classList.add('active');
            document.getElementById('split').classList.remove('active');
            document.getElementById('spends').classList.remove('active');
            document.getElementById('addc').classList.remove('active');
            if(a){

              setTimeout(() => {
                document.getElementById('navbar').style.marginLeft="-400px"
              }, 200);
            }
          }}>Home </Link>
          <Link className='navitem' id='split' to="split" onClick={(e)=>{
            
            document.getElementById('home').classList.remove('active');
            document.getElementById('split').classList.add('active');
            document.getElementById('spends').classList.remove('active');
            document.getElementById('addc').classList.remove('active');
            if(a){

              setTimeout(() => {
                document.getElementById('navbar').style.marginLeft="-400px"
              }, 200);
            }
          }}>Split </Link>
          <Link className='navitem' id='spends' to="spends" onClick={(e)=>{
            
            document.getElementById('home').classList.remove('active');
            document.getElementById('split').classList.remove('active');
            document.getElementById('spends').classList.add('active');
            document.getElementById('addc').classList.remove('active');
            if(a){

              setTimeout(() => {
                document.getElementById('navbar').style.marginLeft="-400px"
              }, 200);
            }
          }}>Spends </Link>
          <Link className='navitem' id='addc' to="atc" onClick={(e)=>{
            
            document.getElementById('home').classList.remove('active');
            document.getElementById('split').classList.remove('active');
            document.getElementById('spends').classList.remove('active');
            document.getElementById('addc').classList.add('active');
            if(a){

              setTimeout(() => {
                document.getElementById('navbar').style.marginLeft="-400px"
              }, 200);
            }
          }}>Add Customer </Link>
          <div className='lbotton'>
            <p className='reg regb'  onClick={(e)=>{
              e.preventDefault();
              logout();
              nav("/home");
            }}>LogOut</p>
          </div>
        </div>
        <div className='contactus'>
          <div></div>
          <p style={{textAlign:'center'}}>Contact: +916352447074</p>
          
          <p style={{textAlign:'center'}}>Made by Virengiri goswami</p>
          <p>©CYM-2023</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar
