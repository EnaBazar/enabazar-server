import Blogymodel from "../models/blog.model.js"
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';




//cloudinary configaration


cloudinary.config({
     
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});



 //image upload
 
 var imagesArr = [];
 


export async function uploadImages(request, response) {
    try {
        let imagesArr = [];  // লোকাল scope-এ রাখলে গ্লোবাল সমস্যা হবে না

        const images = request.files;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        if (!images || images.length === 0) {
            return response.status(400).json({
                message: "No images provided",
                success: false,
                error: true
            });
        }

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i].path, options);
            imagesArr.push(result.secure_url);

            // লোকাল ফাইল ডিলিট করা
            fs.unlinkSync(images[i].path);
        }

        return response.status(200).json({
            images: imagesArr,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

 
 //Create category
 
 export async function createblog(request, response) {
  try {
    let blog = new Blogymodel({
      blogtitle: request.body.blogtitle,
      images: request.body.images, // ✅ এই লাইনে ফিক্স
      description: request.body.description,
  
    });

    if (!blog) {
      return response.status(500).json({
        message: "Blog not created",
        error: true,
        success: false
      });
    }

    blog = await blog.save();

    return response.status(200).json({
      message: "Blog created",
      error: false,
      success: true,
      blog: blog
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

 
 
 //Get blogis
 
 export async function getblogis(request,response) {
     try{
        const blog = await Blogymodel.find() ;

            
           if(!blog){
              return response.status(404).json({
                  
                  message:"blog not found",
                  success:false,
                  error:true
              });
          }
                  return response.status(200).json({       
            error: false,
            success: true,
            blog: blog,
             
        })
           
     }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })  
         
     }
 }
 

  
  // get single Blog
  
  
  export async function getblog(request,response) {
      
      try{
          const blog = await Blogymodel.findById(request.params.id);
          
          
          
          if(!blog){
              
              response.status(500).json({
                  
                  message:"The blog with the given ID was not found.",
                  error:true,
                  success:false
              });
          }
          
          return response.status(200).json({
              
              error: false,
              success: true,
              blog: blog
          })
      }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })    
      }
      
  }
  
   // Delete Category
   
   export async function deleteblog(request,response) {
       
    const blog = await Blogymodel.findById(request.params.id);
    const images = blog.images;
     
     let img ="";
     for (img of images){
         const imgUrl = img;
         const urlArr = imgUrl.split("/");
         const image = urlArr[urlArr.length -1];
         const imageName = image.split(".")[0];
               
         if(imageName){   
         cloudinary.uploader.destroy(imageName,(error,result) =>{                  
         }) ;   
     }
            
         }
     

     const deletedblog = await Blogymodel.findByIdAndDelete(request.params.id);
     
     if (!deletedblog){
         
         response.status(404).json({
             
             message:"Blog not found",
             success:false,
             error:true
         })
     }
     
     response.status(200).json({
             
        message:"Blog Deleted",
        success:true,
        error:false
    })
     }
   
   
   //Update Category
   
export async function updateBlog(request, res) {
 
  try {
   

    const updated = await Blogymodel.findByIdAndUpdate(
      request.params.id,
      {
         blogtitle: request.body.blogtitle,
      images: request.body.images, // ✅ এই লাইনে ফিক্স
      description: request.body.description,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Blog not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      request: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}