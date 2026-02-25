
import React, { useContext, useEffect, useState } from 'react'
import AccountSidebar from '../../Components/AccountSidebar';
import { MyContext } from '../../App';
import 'react-international-phone/style.css'
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import AddressBox from './addressBox';





const label = { inputProps:{ 'aria-label': 'Checkbox demo' }};

 const Address = () => {
            const [address ,setAddress] = useState([]);
            const context = useContext(MyContext);
    
           
       
      useEffect(()=>{ 
         
    if(context?.userData?._id!=="" && context?.userData?._id!==undefined){
        setAddress(context?.userData?.address_details
)              
       } 
       },[context?.userData])
     


 

              
              
              const removeAddress = (id) => {
                deleteData(`/address/${id}`).then((res) => {
                  
                fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res)=>{
                      context?.openAlertBox("success","Remove This Address");
                      setAddress(res.data)
                     
                   })
                  
                })
              }       
                
              



  return (
    
    <>

   <section className="py-10 w-full">
  <div className="container mx-auto flex flex-col lg:flex-row gap-5 px-4">

    {/* Sidebar */}
    <div className="col1 w-full lg:w-1/4">
      <AccountSidebar />
    </div>

    {/* Main Content */}
    <div className="col2 w-full lg:w-3/4 flex flex-col gap-5">

      {/* Address Card */}
      <div className="card bg-white p-5 shadow-md rounded-md">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-[14px] font-medium">Address</h2>
        </div>
        <hr className="text-[rgba(0,0,0,0.2)]" />

        {/* Add Address Button */}
        <div
          className="flex items-center justify-center p-4 mt-4 !mb-3 border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f8f9fa] hover:bg-[#e7f3f9] rounded-md cursor-pointer"
         onClick={() => {
                    context?.setOpenAddressPanel(true);
                    context?.setAddressMode("add");
                  }}
        >
          <span className="text-[14px] font-[500]">Add Address</span>
        </div>

        {/* Address List */}
        <div className="flex flex-col gap-3 mt-4">
          {address?.length > 0 ? (
            address.map((addr, index) => (
              <AddressBox
                address={addr}
                key={index}
                removeAddress={removeAddress}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No addresses added yet.
            </p>
          )}
        </div>
      </div>

    </div>
  </div>
</section>

   
    </>
  )
}
export default Address;
