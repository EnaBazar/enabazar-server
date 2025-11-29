import homeSlidermodel from "../models/homeSlider.model.js"
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

 // Remove category Image
  
  
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
   
    //Create category
    
export async function addHomeSlide(request, response) {
  try {
    const { images } = request.body;

    // images অ্যারের ধরণ যাচাই করা
    if (!Array.isArray(images)) {
      return response.status(400).json({
        message: "Images should be an array of URLs",
        error: true,
        success: false,
      });
    }

    // সমস্ত ইমেজ URL স্ট্রিং আকারে থাকুক
    if (!images.every(img => typeof img === 'string')) {
      return response.status(400).json({
        message: "All images should be valid URLs in string format",
        error: true,
        success: false,
      });
    }

    // Slide অবজেক্ট তৈরি করা
    let slide = new homeSlidermodel({
      images: images, // ✅ এখানে images অ্যারে সেভ করা হচ্ছে
    });

    // যদি স্লাইড না তৈরি হয়
    if (!slide) {
      return response.status(500).json({
        message: "Category not created",
        error: true,
        success: false
      });
    }

    // স্লাইড সেভ করা
    slide = await slide.save();

    return response.status(200).json({
      message: "Slide created",
      error: false,
      success: true,
      slide: slide
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

    
     //Get categoris
     
     export async function getHomeSlides(request,response) {
         try{
            const slides = await homeSlidermodel.find() ;
          
           
                
        if (!slides) {
         return response.status(500).json({
           message: "Slides not created",
           error: true,
           success: false
         });
       }
   
    

       return response.status(200).json({

         error: false,
         success: true,
         data: slides
       });
       
         }catch(error){
            return response.status(500).json({       
                message: error.message || error,
                error: true,
                success: false
            })  
             
         }
     }
     
       // get single category
       
       
       export async function getSlide(request,response) {
           
           try{
               const slide = await homeSlidermodel.findById(request.params.id);
               
               
               
               if(!slide){
                   
                   response.status(500).json({
                       
                       message:"The Slide with the given ID was not found.",
                       error:true,
                       success:false
                   });
               }
               
               return response.status(200).json({
                   
                   error: false,
                   success: true,
                   slide: slide
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
          
          export async function deleteSlide(request,response) {
              
           const slide = await homeSlidermodel.findById(request.params.id);
           const images = slide.images;
            
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
            
  
            const deletedSlide = await homeSlidermodel.findByIdAndDelete(request.params.id);
            
            if (!deletedSlide){
                
                response.status(404).json({
                    
                    message:"Slide not found",
                    success:false,
                    error:true
                })
            }
            
          return  response.status(200).json({
                    
               message:"Slide Deleted",
               success:true,
               error:false
           })
            }
          
             
             //Update Category
             
          export async function updateSlide(request, response) {
           
            try {
              const { name, parentId, parentCatName, images } = req.body;
          
              const slide = await homeSlidermodel.findByIdAndUpdate(
                request.params.id,
                {
                  
                  images,
              
                },
                { new: true }
              );
          
              if (!slide) {
                return res.status(404).json({
                  message: "slide not found",
                  success: false,
                  error: true,
                });
              }
          
              return res.status(200).json({
                success: true,
                error: false,
                slide: slide,
              });
            } catch (error) {
              return res.status(500).json({
                message: error.message || error,
                success: false,
                error: true,
              });
            }
          }
   
    
        //DeletemultipleProducts
 export async function deletemultipleSlides(request, response) {
  const { ids } = request.body;

  // ইনপুট যাচাই
  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "ভুল ইনপুট দেওয়া হয়েছে",
    });
  }

  try {
    // সব স্লাইড খুঁজে বের করো (ডিলিট করার আগে)
    const slides = await homeSlidermodel.find({ _id: { $in: ids } });

    const imageDeletionPromises = [];

    for (const slide of slides) {
      if (!slide || !slide.images) continue;

      for (const imgUrl of slide.images) {
        try {
          // ইমেজ URL থেকে publicId বের করা
          const urlArr = imgUrl.split("/");
          const lastSegment = urlArr[urlArr.length - 1];
          const publicIdWithExtension = lastSegment.split("?")[0]; // <-- ? থাকলে তা কেটে ফেলা দরকার
          const publicId = publicIdWithExtension.split(".")[0];

          if (publicId) {
            // ইমেজ ডিলিটের প্রমিস তৈরি
            imageDeletionPromises.push(cloudinary.uploader.destroy(publicId));
          }
        } catch (err) {
          console.error("ইমেজ URL পার্স করতে সমস্যা:", err);
        }
      }
    }

    // সব ইমেজ একসাথে ডিলিট করো
    await Promise.all(imageDeletionPromises);

    // সব স্লাইড একসাথে ডিলিট করো
    await homeSlidermodel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      error: false,
      success: true,
      message: "স্লাইডগুলো সফলভাবে ডিলিট হয়েছে",
    });
  } catch (error) {
    console.error("ডিলিট করার সময় সমস্যা:", error);
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "সার্ভারে সমস্যা হয়েছে",
    });
  }
}

   