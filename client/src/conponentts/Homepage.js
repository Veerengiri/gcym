import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Homepage({ic}) {
  useEffect(() => {
    console.log(window.location.pathname)
  }, [])
  
  return (
    <div style={{zIndex:50}} className='homelayout'>
      <div className='homeimg'>
      </div>
      <div className='left' >
          <div className='forphone'></div>
          <div className='header'>
            <span style={{fontSize:'1.5rem'}}><b> <i style={{color:'rgb(69,227,232)'}}>CYM</i> </b>-Control Your Money</span>
            <Link  to={`${ic?"/":"/login"}`} className='explorebtn'>Explore Now</Link>
          </div>
          {/* <p style={{textAlign:"unset"}}>CYM is the ultimate financial management platform that combines cutting-edge technology with unparalleled ease-of-use. </p> */}
          <p> With CYM, you can effortlessly record and categorize your daily transactions, manage shared expenses with your contacts, and keep accurate records of your customers and transactions as a shopkeeper. Our fast and reliable service ensures that your transactions are processed quickly and efficiently, allowing you to take control of your finances like never before. </p>
          <p> Join the CYM community today and experience the hottest financial management platform around.</p>

      </div>
      <footer>CYM © 2023</footer>  
    </div>
  )
}

export default Homepage