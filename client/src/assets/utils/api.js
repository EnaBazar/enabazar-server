import axios from "axios";
import { data } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

// Post data with server
export const postData = async (url, formData) => {
    
    try {
        
        const response = await fetch(apiUrl + url, {
           
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('accesstoken') }`,
                    'Content-Type': `application/json`,
            },
            
            body: JSON.stringify(formData)
        });
        
     if (response.ok){
         const data = await response.json();
         return data;
     }else{
         const errorData = await response.json();
         return errorData;
     }
    } catch (error) {
        console.error('error',error)
    }
}


// Post data with server
export const fetchDataFromApi = async (url) => {
    
    try {

const params={
    headers:{
        'Authorization': `Bearer ${localStorage.getItem('accesstoken') }`,
            'Content-Type': `application/json`,
    },
}
        const {data} = await axios.get(apiUrl + url,params)
        return data;
    } catch (error) {
       console.log(error) ;
       return error;
    }
    
}

//upload Image

export const uploadImage = async (url,updatedData ) => {
    
    const params={
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('accesstoken') }`,
                'Content-Type': `multipart/form-data`,
        },
    }
    
    var response;
  await axios.put(apiUrl + url,updatedData,params).then((res)=>{
      
    console.log(res)
   response=res;
  })
  return response;
   
    
}


//Edite Data

export const editData = async (url,updatedData ) => {
    
    const params={
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('accesstoken') }`,
                'Content-Type': 'application/json',
        },
    }
    
    var response;
  await axios.put(apiUrl + url,updatedData,params).then((res)=>{
      
    console.log(res)
   response=res;
  })
  return response;
   
    
}

export const deleteData = async (url) => {
    
      const params={
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('accesstoken') }`,
                'Content-Type': 'application/json',
        },
    }
    
    
    const { res } = await axios.delete(apiUrl +url,params)
    return res;
}