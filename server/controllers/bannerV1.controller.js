import bannerV1model from "../models/bannerV1.model.js"
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
 


export async function uploadBannerV1Images(request, response) {
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

 
 //Create BannerV1
 
 export async function createBannerV1(request, response) {
  try {
    let bannerV1 = new bannerV1model({
      bannerTitle: request.body.bannerTitle,
      images:  request.body.images, // ✅ এই লাইনে ফিক্স
      catId: request.body.catId,
      subCatId: request.body.subCatId,
       thirdsubCatId: request.body.thirdsubCatId,
        price: request.body.price,
        bannerAlign:request.body.bannerAlign,
    });

    if (!bannerV1) {
      return response.status(500).json({
        message: "Banner not created",
        error: true,
        success: false
      });
    }

    bannerV1 = await bannerV1.save();

    return response.status(200).json({
      message: "Banner created",
      error: false,
      success: true,
      bannerV1: bannerV1
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

 
 
 //Get BannerV1
 
 export async function getBannersV1(request,response) {
     try{
        const bannersV1 = await bannerV1model.find() ;
      if(!bannersV1) {
        response.status(500).json({       
          
            error: true,
            success: false,
    
        })   
      }
         
         
        return response.status(200).json({       
          
            error: false,
            success: true,
            data:bannersV1
        })  
     }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })  
         
     }
 }

  
   // get single category
    
    
    export async function getBannerV1(request,response) {
        
        try{
            const bannerV1 = await bannerV1model.findById(request.params.id);
            
            
            
            if(!bannerV1){
                
                response.status(500).json({
                    
                    message:"The bannerV1 with the given ID was not found.",
                    error:true,
                    success:false
                });
            }
            
            return response.status(200).json({
                
                error: false,
                success: true,
                bannerV1: bannerV1
            })
        }catch(error){
          return response.status(500).json({       
              message: error.message || error,
              error: true,
              success: false
          })    
        }
        
    }
  
  // Remove BannerV1 Image
  
  
   export async function removeimageFromCloudinary(request,response) {
       
      const imgUrl = request.query.img;
      const urlArr =imgUrl.split("/");
      const image = urlArr[urlArr.length -1];
      const imageName = image.split(".")[0];
      
      
    
      if (imageName) {
          
        const res = await cloudinary.uploader.destroy(
          imageName,
          (error,result)=> {
              
          }
      );
        if (res){
            
            response.status(200).send(res);
        }
          
      }
   }

  
   // Delete BannnerV1
   
   export async function deleteBannerV1(request,response) {
       
    const bannerV1 = await bannerV1model.findById(request.params.id);
    const images = bannerV1.images;
     
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
     

     const deletedbannerV1 = await bannerV1model.findByIdAndDelete(request.params.id);
     
     if (!deletedbannerV1){
         
         response.status(404).json({
             
             message:"Banner not found",
             success:false,
             error:true
         })
     }
     
     response.status(200).json({
             
        message:"Banner Deleted",
        success:true,
        error:false
    })
     }
   
   
   //Update Category
   
export async function updateBannerV1(req, res) {
 
  try {
        const { bannerTitle,images, catId, subCatId, thirdsubCatId, price,bannerAlign } = req.body;

    const bannerV1 = await bannerV1model.findByIdAndUpdate(
      req.params.id,
      {
        bannerTitle,
        images,
        catId,
        subCatId,
        thirdsubCatId,
        price,
          bannerAlign
      },
      { new: true }
    );

    if (!bannerV1) {
      return res.status(404).json({
        message: "Banner not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      bannerV1: bannerV1,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}