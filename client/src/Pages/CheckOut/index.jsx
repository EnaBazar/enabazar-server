import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { BsFillBagCheckFill } from 'react-icons/bs'
import { MyContext } from '../../App'
import { FaPlus } from 'react-icons/fa6'
import Radio from '@mui/material/Radio'
import { deleteData, fetchDataFromApi, postData } from '../../utils/api'
import { useNavigate } from 'react-router-dom'

const CheckOut = () => {

  window.scrollTo(0,0)

  const context = useContext(MyContext)
  const navigate = useNavigate()

  const [isChecked,setIsChecked] = useState(0)
  const [selectedAddress,setSelectedAddress] = useState("")
  const [selecteddelivery,setSelecteddelivery] = useState("")
  const [subTotalAmount,setsSubTotalAmount] = useState(0)
  const [loading,setLoading] = useState(false)

  const totalAmount = Number(subTotalAmount || 0) + Number(selecteddelivery || 0)

  const editeAddress = (id)=>{
    context.setAddressMode("edit")
    context?.setOpenAddressPanel(true)
    context?.setAddressId(id)
  }

  const removeAddress=(id)=>{
    deleteData(`/address/${id}`).then(()=>{
      fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then(()=>{
        context?.openAlertBox("success","Remove This Address")
        window.location.reload()
      })
    })
  }

  const handleChange=(e,index)=>{
    if(e.target.checked){

      const selectedId = e.target.value
      const deliveryCharge = e.target.getAttribute('data-delivery')

      setIsChecked(index)
      setSelectedAddress(selectedId)
      setSelecteddelivery(deliveryCharge)

      fetchDataFromApi(`/address/selectAddress/${selectedId}`).then((res)=>{
        setSelecteddelivery(res?.address?.deliverylocation)
      })
    }
  }

  useEffect(()=>{

    const defaultAddress = context?.userData?.address_details?.[0]

    if(defaultAddress){
      setSelectedAddress(defaultAddress._id)
      setSelecteddelivery(defaultAddress.deliverylocation)
    }

    const total = context?.cartData?.length
    ? context.cartData
      .map(item => parseInt(item.price) * item.quantity)
      .reduce((total,value)=> total + value,0)
    : 0

    setsSubTotalAmount(total)

  },[context.cartData,context.userData])


  // ✅ Cash On Delivery

  const cashOnDelivery = async ()=>{

    const user = context?.userData

    if(user?.address_details?.length === 0){
      context?.openAlertBox("error","Please Add Address First!")
      return
    }

    setLoading(true)

    const payLoad = {

      userId:user?._id,
      products:context?.cartData,
      paymentId:'',
      payment_status:"Cash On Delivery",
      delivery_address:selectedAddress,
      subTotalAmt:subTotalAmount,
      delivery_charge:selecteddelivery,
      totalAmt:totalAmount,
      date:new Date().toLocaleString("en-US",{
        month:"short",
        day:"2-digit",
        year:"numeric"
      })

    }

    try{

      const res = await postData(`/order/create`,payLoad)

      setLoading(false)

      if(!res?.error){

        await deleteData(`/cart/emptycart/${user?._id}`)
        context?.setCartData([])

        context?.openAlertBox("success",res?.message)

        // ✅ SMS Send API

        await postData(`/api/sms/order-confirm`,{

          mobile:user?.mobile,
          name:user?.name,
          orderId:res?.order?._id,
          total:totalAmount

        })

        navigate("/order/success",{state:{order:res.order}})

      }else{

        context?.openAlertBox("error",res?.message)
        navigate("/order/failed")

      }

    }catch(error){

      setLoading(false)
      context?.openAlertBox("error","Something went wrong!")

    }

  }

  return (

    <section className="min-h-screen py-10">

      <div className="container mx-auto flex flex-col lg:flex-row gap-5 w-[90%] lg:w-[80%]">

        {/* Address Column */}

        <div className="w-full lg:w-2/3">

          <div className="card bg-white shadow-md p-5 rounded-md">

            <div className="flex items-center justify-between">

              <h1 className="font-semibold">Choose Delivery Address</h1>

              <Button
              size="small"
              variant="outlined"
              onClick={()=>{
                context?.setOpenAddressPanel(true)
                context?.setAddressMode("add")
              }}
              >
                <FaPlus/> ADD NEW ADDRESS
              </Button>

            </div>

            <div className="flex flex-col gap-3 mt-5">

              {context?.userData?.address_details?.map((address,index)=>{

                return(

                  <label
                  key={index}
                  className={`flex gap-3 p-4 border rounded-md cursor-pointer ${isChecked===index && "bg-red-50"}`}
                  >

                    <Radio
                    size="small"
                    checked={isChecked===index}
                    value={address?._id}
                    data-delivery={address?.deliverylocation}
                    onChange={(e)=>handleChange(e,index)}
                    />

                    <div className="flex-1">

                      <span className="bg-sky-600 text-white text-xs px-2 py-1 rounded">
                        {address?.addressType}
                      </span>

                      <h4 className="text-sm mt-2">
                        {context?.userData?.name} | {context?.userData?.mobile}
                      </h4>

                      <p className="text-sm text-gray-600">
                        {address?.address_line}, {address?.city}, {address?.state}
                      </p>

                    </div>

                    <div>

                      <Button
                      size="small"
                      onClick={()=>editeAddress(address?._id)}
                      >
                        EDIT
                      </Button>

                      <Button
                      size="small"
                      color="error"
                      onClick={()=>removeAddress(address?._id)}
                      >
                        Delete
                      </Button>

                    </div>

                  </label>

                )

              })}

            </div>

          </div>

        </div>


        {/* Order Summary */}

        <div className="w-full lg:w-1/3">

          <div className="card bg-white shadow-md p-5 rounded-md">

            <h2 className="font-semibold mb-4 border-b pb-2">
              Your Order
            </h2>

            {context?.cartData?.map((item,index)=>{

              return(

                <div key={index} className="flex justify-between py-2 border-b">

                  <span>
                    {item?.productTitle} x {item?.quantity}
                  </span>

                  <span>
                    ৳ {(item?.price * item?.quantity)}
                  </span>

                </div>

              )

            })}

            <div className="mt-4 space-y-2">

              <div className="flex justify-between">

                <span>Subtotal</span>
                <span>৳ {subTotalAmount}</span>

              </div>

              <div className="flex justify-between">

                <span>Delivery</span>
                <span>৳ {selecteddelivery}</span>

              </div>

              <div className="flex justify-between font-bold border-t pt-2">

                <span>Total</span>
                <span>৳ {totalAmount}</span>

              </div>

            </div>

            <Button
            onClick={cashOnDelivery}
            disabled={loading}
            className="btn-org w-full mt-5 flex gap-2"
            >

              {loading
                ? <CircularProgress size={20}/>
                : <><BsFillBagCheckFill/> Cash on Delivery</>
              }

            </Button>

          </div>

        </div>

      </div>

    </section>

  )

}

export default CheckOut