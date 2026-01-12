import axios from "axios";


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
export const fetchDataFromApi = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("accesstoken");
    const { method = "GET", body } = options;

    const response = await fetch(import.meta.env.VITE_API_URL + url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: true, message: error.message };
  }
};



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

export const uploadImages = async (url, formData) => {
  try {
    const response = await axios.post(apiUrl + url, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
        'Content-Type': 'multipart/form-data', // 👈 don't remove this
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: true, message: error.message };
  }
};

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


export const deleteImages = async (url, image) => {
  try {
    const token = localStorage.getItem("accesstoken");

    const response = await axios.delete(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        image, // যদি তোমার backend এইভাবে body থেকে image নেয়
      },
    });

    return response.data;
  } catch (error) {
    console.error("Image delete error:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteData = async (url, image) => {
  try {
    const token = localStorage.getItem("accesstoken");

    const response = await axios.delete(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
   
    });

    return response
  } catch (error) {
    console.error("Image delete error:", error.response?.data || error.message);
    throw error;
  }
};




export const deleteMultipleData = async (url, image) => {
  try {
  
    const token = localStorage.getItem("accesstoken");

    const response = await axios.delete(apiUrl + url, {
 
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
   
    });

    return response
  } catch (error) {
    console.error("Image delete error:", error.response?.data || error.message);
    throw error;
  }
};

