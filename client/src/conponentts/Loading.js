import React from 'react'
import loading from '../Imagess/loading.svg'
function Loading() {
  return (
    <div className='loading'>
        <img src={loading} alt="" />
        <p>Loading...</p>
    </div>
  )
}

export default Loading
