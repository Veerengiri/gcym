import React from 'react'

function Footer(props) {
  const {ic}=props;
  return (
    <div style={{display:`${ic?"unset":"none"}`}}>
      footer
    </div>
  )
}

export default Footer
