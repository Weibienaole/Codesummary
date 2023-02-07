import React from 'react'


const Button = (props) => {
  return (
    <div className='Button_Component'>this is Button,txt:{props?.txt || 'no txt'}</div>
  )
}

export default Button