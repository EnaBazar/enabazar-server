
import React, { useContext, useEffect, useState } from 'react'
import AccountSidebar from '../../Components/AccountSidebar';
import { MyContext } from '../../App';
import Radio from '@mui/material/Radio';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';
import {PhoneInput} from 'react-international-phone';
import 'react-international-phone/style.css'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {FaRegTrashAlt} from 'react-icons/fa';



import  CircularProgress  from '@mui/material/CircularProgress';
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';





const label = { inputProps:{ 'aria-label': 'Checkbox demo' }};

 const Address = () => {
       const [address ,setAddress] = useState([]);
         const context = useContext(MyContext)
         
         
          const [phone, setPhone] = useState('');
            const [isLoading,setIsLoading]= useState(false);
              const [status,setstatus] = useState(false);
              const [isOpenModel,setisOpenModel] = useState(false);

                     const [formFields, setFormFields] = useState({
                          
                          address_line: '',
                          city: '',
                          state: '',
                          pincode: '',
                          country: '',
                          mobile: '',
                          status: '',
                         selected: false,
                          userId: context?.userData?._id
                        
                       });
                     
                     
                       const history = useNavigate();
                       
                       const [selectedValue,setSelectedValue] = useState('');
                       
              
 const handleChangeStatus = (event) => {
   setstatus(event.target.value);
  setFormFields({
    ...formFields, 
    status: event.target.value
  });
  };
     
     
      useEffect(()=>{
        
          if (context?.userData?._id) {
    setFormFields(prev => ({
      ...prev,
      userId: context.userData._id
    }));
  }

      
       if(context?.userData?._id!=="" && context?.userData?._id!==undefined){
   
   
    fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res)=>{
            
            setAddress(res.data)
         
            
          })
          
   

   
       
      
         
       } 
       },[context?.userData?._id])
     
       
     
       const handleChange = (event) => {
     
         setSelectedValue(event.target.value);
         if(event.target.checked===true){
           editData(`/address/selectAddress/${event.target.value}`,{selected:true})
         }else{
           editData(`/address/selectAddress/${event.target.value}`,{selected:false})
         }
       
         
       };
            
 const handleClose = () => {
   setisOpenModel(false);
  };
 
   const onchangeInput = (e) => {
      
  const { name, value } = e.target;
  setFormFields(() => {
    return{
      ...formFields,
      [name]: value
    }
  })
}
 
 
 
       const valideValue = formFields.address_line && 
                     formFields.city &&
                     formFields.state &&
                     formFields.pincode &&
                     formFields.country &&
                     formFields.mobile &&
                     formFields.status !== '';
                     
              
              
              const removeAddress = (id) => {
                deleteData(`/address/${id}`).then((res) => {
                  
                fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res)=>{
                     
                      setAddress(res.data)
                     
                   })
                  
                })
              }       
                     
   
      const handleSubmit = (e) => {     
           e.preventDefault();
          
           setIsLoading(true)
           
          if(formFields.address_line==="") {
   setIsLoading(false);
   context.openAlertBox("error","Please entry your AddressLine")
   return;
 }
             
             if(formFields.city==="")
               {
                 context.openAlertBox("error","Please entry your City")
                 return false
               }
               
               if(formFields.state==="")
                 {
                   context.openAlertBox("error","Please entry your state")
                   return false
                 }
                    if(formFields.pincode==="")
             {
               context.openAlertBox("error","Please entry your pincode")
               return false
             }
             
             if(formFields.country==="")
               {
                 context.openAlertBox("error","Please entry your country")
                 return false
               }
               
               if(formFields.mobile==="")
                 {
                   context.openAlertBox("error","Please entry your mobile")
                   return false
                 }
               
               
           
             postData(`/address/add`, formFields, {withCredentials: true }).then((res) => {
             fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res)=>{
                     
                     setAddress(res.data)
                     
                   })
            
             if (res?.error !== true){
                   setIsLoading(false)
                    
            context.openAlertBox("success", res?.message);
 
        
            
            setisOpenModel(false)
            
             fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res)=>{
                     
                       context?.setAddress(res.data)
                     
                   })
               const ph = `"${context?.userData?.mobile}"`
              setPhone(ph)
          
            
             }else{
              
               context.openAlertBox("error",res?.message);
                setIsLoading(false);
              
             }
            
           })
         }
      
 
  return (
    
    <>
   <section className='py-10 w-full'>
   <div className='container flex gap-3'>
   <div className='col1 w-[20%]'>
   <AccountSidebar/>
   </div>
   
   
   <div className='col2 w-[50%]'>
   <div className='card bg-white p-5 shadow-md rounded-md !mb-5'>
   <div className='flex items-center pb-0'>
   <h2 className='pb-3 !text-[14px]'>Address</h2>

   </div>
   <hr className='text-[rgba(0,0,0,0.2)]'/>
   <br/>
   
  <div className='flex h-[25px] w-[full] items-center justify-center p-5 border border-dashed 
  
  border-[rgba(0,0,0,0.2) bg-[#d1d2d3] hover:bg-[#e7f3f9] cursor-pointer'
     onClick={() => setisOpenModel(true)}
          
          >
          <span className='text-[14px] font-[500]'>Add Address</span>
          
          </div>
          <br/>
       
       <div className='flex gap-2 flex-col mt-4'>
       
       
       {
         address?.length > 0 && address?.map((address, index) => {
           return (
             <>
              <label className=' group relative border border-dashed 
  
  border-[rgba(0,0,0,0.1) addressBox w-full h-[70px] flex items-center justify-center bg-[#1b1a1a2d] p-5 rounded-md cursor-pointer'>
          <div className='!mr-auto'>
          
          <Radio {...label}
           name='address'
           size='s'
           
          checked={
            
            selectedValue ===
            (address?._id
             ) 
            
       
            }
          value={
            
            address?._id 
            
          } onChange={handleChange}
          
           />
           
              <span className='text-[12px] font-[500]'>
          {
            
           address?.address_line + " , "+
             address?.city + " , "+
             address?.country + " , "+
             address?.state + " , "+
             address?.pincode 
          }
          
          
          
          </span>
           </div>
       
          
          
          <span onClick={()=>removeAddress(address?._id)} className='items-center justify-center  hidden group-hover:flex rounded-full text-[#ff5252] ml-auto z-50'><FaRegTrashAlt className='w-[15px] h-[15px]'/></span>
          </label>
             </>
           )
         })
       }
          </div>
         
          
   
   </div>
   

   
   
   
   
   
   </div>
   </div>
   </section>
   
   
     <Dialog  open={isOpenModel}>
      <DialogTitle>Add Address</DialogTitle>
      
         <form className='p-8 py-3 pb-8'  onSubmit={handleSubmit}>
          <div className='flex items-center gap-5 pb-5'>
          
          <div className='col w-[100%]'>
          
          <TextField
          className="w-full"
            label="Address Line 1"
              variant='outlined'
               size="small"
                name="address_line"
         value={formFields.address_line}
         disabled={isLoading===true ? true : false}
        onChange={onchangeInput}
               />
               
          </div>
          </div>
          
            <div className='flex items-center gap-5 pb-5'>
          
          <div className='col w-[50%]'>
          
          <TextField
          className="w-full"
            label="City"
              variant='outlined'
               size="small"
                name="city"
         value={formFields.city}
         disabled={isLoading===true ? true : false}
        onChange={onchangeInput}
               />
               
          </div>
          
            <div className='col w-[50%]'>
          
          <TextField

            label="State"
             className='w-full'
              variant='outlined'
               size="small"
                name="state"
         value={formFields.state}
         disabled={isLoading===true ? true : false}
        onChange={onchangeInput}
               />
               
          </div>
          </div>
          
           <div className='flex items-center gap-5 pb-5'>
          
          <div className='col w-[50%]'>
          
          <TextField
          className="w-full"
            label="PinCode"
              variant='outlined'
               size="small"
                name="pincode"
         value={formFields.pincode}
         disabled={isLoading===true ? true : false}
        onChange={onchangeInput}
               />
               
          </div>
          
            <div className='col w-[50%]'>
          
          <TextField

            label="Country"
             className='w-full'
              variant='outlined'
               size="small"
                name="country"
         value={formFields.country}
         disabled={isLoading===true ? true : false}
        onChange={onchangeInput}
               />
               
          </div>
          </div>
          

         <div className='flex items-center gap-5 pb-5'>
          
          <div className='col w-[50%]'>
          <PhoneInput
           defaultCountry='bd'
           value={phone}
           disabled={isLoading === true ? true : false}
           onChange={(phone) => {
             setPhone(phone);
           setFormFields(prev => ({
             ...prev,
             mobile: phone
           }));
          }}
          
  
               />
               
          </div>
          
          
<div className='col w-[50%]'>
          
<Select
value={formFields.status}
onChange={handleChangeStatus}
displayEmpty
inputProps={{'aris-label': 'without label'}}
size='small'
className='w-full h-[30px] mt-2'
>
<MenuItem value="">
<em>None</em>
</MenuItem>

<MenuItem value={true}>True</MenuItem>
<MenuItem value={false}>false</MenuItem>



</Select>
               
          </div>
          </div>
          
       <div className='flex items-center gap-5'>
       
                 <Button type='submit' disabled={!valideValue} className='btn-org btn-lg  w-full !mt-5 gap-3 flex items-center'>
             {
               
               isLoading === true ? <CircularProgress color="inherit"/>
          
               :
               'Save Address'
             }
             
             </Button>   
          
          
          
          
            <Button className='btn-org btn-border btn-lg  w-full !mt-5 gap-3 flex items-center' onClick={handleClose}>Cencel</Button>
              
             
              </div>
          
          </form>
      
    </Dialog>
    </>
  )
}
export default Address;
