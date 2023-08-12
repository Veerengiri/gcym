import React, { useEffect } from 'react'

function Alert(props) {
    const {title,isalert} = props;
    useEffect(()=>{
        if(isalert){
            setTimeout(() => {
                document.getElementById('alert').style.display = "none";
            }, 5000);
        }else{
            document.getElementById('alert').style.display = "none";
        }
    })
  return (
    <div className='alert' id='alert'>
        <div className='atitle'>
        <p>{title}</p>  
        <p style={{cursor:'pointer'}} onClick={()=>{
            document.getElementById('alert').style.display = "none";
        }}>X</p>
        </div>
        <div className='progress'></div>
    </div>
  )
}

export default Alert;
