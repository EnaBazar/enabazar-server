import React from 'react'


 const ProgressBar = (props) => {
  return (
    <div className='w-[100px] h-auto overflow-hidden !rounded-md !bg-[#9e9d9d8e]'>
    <span className={`flex items-center !w-[${props.value}%] h-[5px] ${props.type==="success" && 'bg-green-600'}
                      ${props.type==="error" && 'bg-pink-600'}  ${props.type==="warning" && 'bg-yellow-600'}`}></span>
                        
  
                        
    </div>
  ) 
}
export default ProgressBar;
