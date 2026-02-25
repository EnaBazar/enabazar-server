import React, { useContext, useState } from 'react'
import Select from '@mui/material/Select';
import {FaRegTrashAlt} from 'react-icons/fa';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {HiOutlineDotsVertical} from "react-icons/hi";
import { MyContext } from '../../App';


const ITEM_HEIGHT = 48;
const AddressBox =(props) => {
const [anchorEl, setAnchorEl] = useState(null);
      const context = useContext(MyContext)
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


const removeAddress=(id)=>{
    setAnchorEl(null);
    props.removeAddress(id)
}

const editeAddress=(id)=>{

setAnchorEl(null);
 context.setAddressMode("edit");
 context?.setOpenAddressPanel(true)
 context?.setAddressId(id);

}
    return(
<div className="group relative shadow-md border border-[rgba(0,0,0,0.1)] w-full bg-[#1b1a1a2d] p-4 sm:p-5 rounded-md cursor-pointer">

  {/* Address Type */}
  <span className="inline-block !pl-2 pr-2 bg-sky-600 text-[13px] sm:text-[15px] text-white font-[500] rounded-sm">
    {props?.address?.addressType}
  </span>

  {/* Name & Mobile */}
  <h4 className="pt-2 text-[13px] sm:text-[15px] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
    <span>{context?.userData?.name}</span>
    <span>{props?.address?.mobile}</span>
  </h4>

  {/* Full Address */}
  <span className="pt-1 text-[12px] sm:text-[14px] block w-full sm:w-[90%] break-words">
    {props?.address?.address_line}, {props?.address?.city}, {props?.address?.country}, {props?.address?.state}, {props?.address?.pincode}
  </span>

  {/* Action Menu */}
  <div className="absolute top-2 sm:top-[20px] right-2 sm:right-[20px]">
    <IconButton
      aria-label="more"
      id="long-button"
      aria-controls={open ? 'long-menu' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup="true"
      onClick={handleClick}
      size="small"
    >
      <HiOutlineDotsVertical className="text-[18px] sm:text-[22px]" />
    </IconButton>

    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        },
        list: {
          'aria-labelledby': 'long-button',
        },
      }}
    >
      <MenuItem onClick={() => editeAddress(props?.address?._id)}>Edit</MenuItem>
      <MenuItem onClick={() => removeAddress(props?.address?._id)}>Delete</MenuItem>
    </Menu>
  </div>

</div>

    )
}

export default AddressBox;