import Categorymodel from "../models/category.model.js"
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
 
 export async function createcategory(request, response) {
  try {
    let category = new Categorymodel({
      name: request.body.name,
      images: request.body.images, // ✅ এই লাইনে ফিক্স
      parentId: request.body.parentId,
      parentCatName: request.body.parentCatName,
    });

    if (!category) {
      return response.status(500).json({
        message: "Category not created",
        error: true,
        success: false
      });
    }

    category = await category.save();

    return response.status(200).json({
      message: "Category created",
      error: false,
      success: true,
      category: category
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
 
 export async function getcategoris(request,response) {
     try{
        const categoris = await Categorymodel.find() ;
        const categoryMap = {};
        
        categoris.forEach(cat => {
            categoryMap[cat._id] = {...cat._doc,children: []};
            
        });
        const rootCategories = [];
         
        categoris.forEach(cat => {
            
            if(cat.parentId){
                
                categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
            } else{
                rootCategories.push(categoryMap[cat._id])
            }
        });
         
         
        return response.status(200).json({       
          
            error: false,
            success: true,
            data:rootCategories
        })  
     }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })  
         
     }
 }
 
 //get category count
 
 
 export async function getCategorisCount(request,response) {
     try{
     const categoryCount = await Categorymodel.countDocuments({parentId:undefined});
     
     if(!categoryCount) {
         
         response.status(500).json({success:false, error:true});
         
     }else{
         response.send({
             categoryCount: categoryCount,
             
         })
     }   
         
     }catch(error){
         
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })   
     }
     
     
 }
 
 
  //get Sub-category count
 
 
  export async function getSubCategorisCount(request,response) {
    try{
    const categories = await Categorymodel.find();
    
    if(!categories) {
        
        response.status(500).json({success:false, error:true});
        
    }else{
        
        const subCatList=[];
       for(let cat of categories){
           if(cat.parentId!==undefined){
               subCatList.push(cat);
           }
       }
       
       response.send({
           SubcategoryCount: subCatList.length,
       })
    }   
        
    }catch(error){
        
       return response.status(500).json({       
           message: error.message || error,
           error: true,
           success: false
       })   
    }
    
    
}
  
  // get single category
  
  
  export async function getCategory(request,response) {
      
      try{
          const category = await Categorymodel.findById(request.params.id);
          
          
          
          if(!category){
              
              response.status(500).json({
                  
                  message:"The category with the given ID was not found.",
                  error:true,
                  success:false
              });
          }
          
          return response.status(200).json({
              
              error: false,
              success: true,
              category: category
          })
      }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })    
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




   
   
  
  
   // Delete Category
   
   export async function deleteCategory(request,response) {
       
    const category = await Categorymodel.findById(request.params.id);
    const images = category.images;
     
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
     
     const subCategory = await Categorymodel.find({
         parentId: request.params.id
         
     });
     
     for(let i =0; i < subCategory.length; i++){
         

    const thirdsubCategory = await Categorymodel.find({
        parentId: subCategory[i]._id
    });
    
    for (let i = 0; i < thirdsubCategory.length; i++){
        
        
        const deleteThirdsubCat = await Categorymodel.findByIdAndDelete(thirdsubCategory[i]._id);
    }
    const deletedSubCat = await Categorymodel.findByIdAndDelete(subCategory[i]._id);
     }
     const deletedCat = await Categorymodel.findByIdAndDelete(request.params.id);
     
     if (!deletedCat){
         
         response.status(404).json({
             
             message:"Category not found",
             success:false,
             error:true
         })
     }
     
     response.status(200).json({
             
        message:"Category Deleted",
        success:true,
        error:false
    })
     }
   
   
   //Update Category
   
export async function updateCategory(req, res) {
 
  try {
    const { name, parentId, parentCatName, images } = req.body;

    const updated = await Categorymodel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        images,
        parentId: parentId || null,
        parentCatName,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      category: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}