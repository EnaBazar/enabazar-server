
// eslint-disable-next-line no-unused-vars
import  React, {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {IoCloseSharp} from 'react-icons/io5';
import {RiMenu2Fill} from "react-icons/ri";
import CategoryCollapse from "../../CategoryCollapse";







const CategoryPanel =(props) =>{
    

  const toggleDrawer = (newOpen) => () => {
    props.setisOpenCatPanel(newOpen)
  };
     
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="categoryPanel">
    
    <h3 className='p-4 text-[15px] font-[500] flex items-center justify-between border-b-[2px] border-gray-300' ><RiMenu2Fill/> 
    Shop By categories <IoCloseSharp onClick={toggleDrawer(false)} className="cursor-pointer !text-[20px]"/></h3>
      
      {
        props?.data?.length!==0 &&
          <CategoryCollapse data={props?.data}/>
      }
  
      
    </Box>
  );

    
    return(
      
        <div>
     
      <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
        </div>
        
    )
}
export default CategoryPanel;