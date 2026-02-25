import React from 'react'
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';




export const Reviews = (props) => {
    
    
    const [reviews, setReviews]= useState({
        
        image: '',
        userName: '',
        review: '',
        rating: 1,
        userId: '',
        productId: ''
    })
    
    const context = useContext(MyContext);
    const [reviewsData, setReviewsData] = useState();
    
    
    useEffect(()=>{
     
        setReviews(()=>({
            ...reviews,
            image:context?.userData?.avatar,
            userName:context?.userData?.name,
             userId:context?.userData?._id,
              productId:props?.productId
        }))
        getReviews();
    },[context?.userData, props])
    
    
    const onChangeInput=(e)=>{
       setReviews(()=>({
           ...reviews,
           review: e.target.value
        }))  
    }
    
    
    const addReview=(e)=>{
        e.preventDefault();
    
    if(reviews?.review!==""){
        postData("/auth/addReviews", reviews).then((res)=>{
        
        if(res?.error ===false){
             context.openAlertBox("success", res?.message);
               setReviews(()=>({
           ...reviews,
           review: '',
           rating: 1
        })) 
               getReviews();
        }else{
                context.openAlertBox("error", res?.message);
        }
    }) 
    }else{
          context.openAlertBox("error", "please add reviews");
    }
    
   
    }
    
    
    const getReviews=()=>{
        fetchDataFromApi(`/auth/getReviews?productId=${props?.productId}`).then((res)=> {
            if( res?.error == false){
               setReviewsData(res?.reviews) 
               props.setReviewsCount(res?.reviews.length)
            }
        })
    }
    
  return (
  <div className='w-full productReviewContainer'>
    <h2 className='text-[14px]'>Customer questions & answers</h2> 
    
    {
        reviewsData?.length!==0 &&
        <div className='scroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden !mt-5'>   
    {
        reviewsData?.map((review,index)=>{
  return(
             <div className='review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.2)] flex items-center justify-between'>
    <div className='info w-[60%] flex items-center gap-3'>
    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
    <img src={review?.image} className='w-full'/>
    </div>
    <div className='w-[80%]'>
    <h4 className='text-[16px]'>{review?.userName}</h4>
    <h5 className='text-[13px] !mb-0' >{review?.createdAt.split("T")[0]}</h5>
    <p className='!mt-0 !mb-0'>{review?.review}</p>
    </div> 
    </div>
    <Rating name="size-small" defaultValue={review?.rating}  readOnly/>
    </div>  
  )   
            
        })
    }
     
     
    </div> 
    }
   
    
    
    <br/>
    
    <div className='reviewForm bg-[#f1f1f1] p-4 rounded-md'>
    <h2 className='text-[18px] pb-3'>Add a review</h2>
    <form className='w-full mt-5' onSubmit={addReview}>
    <TextField
          id="outlined-multiline-flexible"
          label="Write a Review"
          className='w-full !mb-5'
          onChange={onChangeInput}
          name="review"
          multiline
          rows={5}
          value={reviews.review}
        />
          <Rating name="size-small" value={reviews?.rating} onChange={(event, newValue)=>{
             setReviews(()=>({
           ...reviews,
           rating: newValue
        }))
          }}/>
          
          <div className='flex items-center !mt-5'>
          <Button type='submit' className='btn-org'>Submit Reviw</Button>
          
          </div>
    </form>
    </div>
    </div>
  )
}

