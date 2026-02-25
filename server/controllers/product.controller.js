import productmodel from '../models/product.model.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { error } from 'console';
import productRamsmodel from '../models/productRAMS.js';
import productSizesmodel from '../models/productSize.js';
import productWeightmodel from '../models/productWieght.js';
import { inflate } from 'zlib';






//cloudinary configaration


cloudinary.config({
     
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});



 //image upload
 
 var imagesArr = [];
 
 export async function uploadImages(request,response) {
     
     try {
         imagesArr = [];
         
      
         const image = request.files;

         const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        }  
         
         for (let i = 0; i < image?.length; i++){
     
             const img = await cloudinary.uploader.upload(
                image[i].path,
                 options,
                                 
                 function (error,result){  
                       
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`);
                   
                 }
             );
         }
         
     
         return response.status(200).json({
          
             images: imagesArr
         });
         
     } catch (error) {
         return response.status(500).json({       
             message: error.message || error,
             error: true,
             success: false
         })
     };
           };
  
  
   //Bannerimage upload
 
 var bannerimage = [];
 
 export async function uploadBannerImages(request,response) {
     
     try {
         bannerimage = [];
         
      
         const image = request.files;

         const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        }  
         
         for (let i = 0; i < image?.length; i++){
     
             const img = await cloudinary.uploader.upload(
                image[i].path,
                 options,
                                 
                 function (error,result){  
                       
                    bannerimage.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`);
                   
                 }
             );
         }
         
     
         return response.status(200).json({
          
             images: bannerimage
         });
         
     } catch (error) {
         return response.status(500).json({       
             message: error.message || error,
             error: true,
             success: false
         })
     };
           };
  
  
  //Create Product
  
  export async function createProduct(request,response) {

      try{
          let  product = new productmodel({
              name:request.body.name,
              description:request.body.description,
              images: imagesArr,
              bannerimages:bannerimage,
              bannerTitlename:request.body.bannerTitlename,
              isDisplayOnHomeBanner:request.body.isDisplayOnHomeBanner,
              brand:request.body.brand,
              price:request.body.price,
              oldPrice:request.body.oldPrice,
              category:request.body.category,
               catName:request.body.catName,
              catId:request.body.catId,
              subCatId:request.body.subCatId,
              subCat:request.body.subCat,
              thirdsubCatId:request.body.thirdsubCatId,
              thirdsubCat:request.body.thirdsubCat,
             
              countInStock:request.body.countInStock,
              rating:request.body.rating,
              isFeatured:request.body.isFeatured,
              discount:request.body.discount,      
              productRam:request.body.productRam,
              size:request.body.size,
              productWeight:request.body.productWeight,
          
           
          });
          
          product = await product.save();
          
          if (!product){
           response.status(500).json({
                      
                message: "Product not Created",
                error: true,
                success: false
            })
          }
         
         imagesArr = [];
         
         response.status(200).json({
                      
            message: "Product Created successfully",
            error: false,
            success: true,
            product:product
        })
      }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })
         
     }
      
      
           }
  
  // Get all Product
  
  export async function getAllProducts(request,response) {
      
      
      try{
          
          const page = parseInt (request.query.page) || 1;
          const perPage = parseInt(request.query.perPage);
          const totalPosts = await productmodel.countDocuments();
          const totalPages = Math.ceil(totalPosts / perPage);
          
          
          if(page > totalPages){
              return response.status(404).json({
                  
                  message:"page not found",
                  success:false,
                  error:true
              });
          }
          
          const  products = await productmodel.find().populate("category")
          .skip((page - 1) * perPage)
          .limit(perPage)
          .exec();
          
          if(!products){
            response.status(500).json({            
                error: true,
                success: false
            })
            
              
          }
          
          
    
          return response.status(200).json({       
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page        
        })
      }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })
  }
            }
  
  // get all Product ByCatId
  
 export async function getAllProductsByCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    // শুধু নির্দিষ্ট ক্যাটাগরির প্রোডাক্ট কাউন্ট করো
    const totalPosts = await productmodel.countDocuments({ catId: request.params.id });
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages > 0) {
      return response.status(404).json({
        message: "পেইজ পাওয়া যায়নি",
        success: false,
        error: true,
      });
    }

    const products = await productmodel.find({
  catId: request.params.id.toString()
})
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (products.length === 0) {
      return response.status(404).json({
        message: "এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

    // get all Product ByName
  
    export async function getAllProductsByName(request,response) {
      
      
        try{
            
            const page = parseInt (request.query.page) || 1;
            const perPage = parseInt(request.query.perPage) || 10000;
            const totalPosts = await productmodel.countDocuments();
            const totalPages = Math.ceil(totalPosts / perPage);
            
            
            if(page > totalPages){
                return response.status(404).json({
                    
                    message:"page not found",
                    success:false,
                    error:true
                });
            }
            
            const  products = await productmodel.find({
                catName:request.query.catName
                }).populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();
            
            if(!products){
              response.status(500).json({            
                  error: true,
                  success: false
              })
              
                
            }
            
            
      
            return response.status(200).json({       
              error: false,
              success: true,
              products: products,
              totalPages: totalPages,
              page: page        
          })
        }catch(error){
          return response.status(500).json({       
              message: error.message || error,
              error: true,
              success: false
          })
    }
            }
    
    // get all Product BySubCatId
  
  export async function getAllProductsBySubCatId(request,response) {
      
      
    try{
        
        const page = parseInt (request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await productmodel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);
        
        
        if(page > totalPages){
            return response.status(404).json({
                
                message:"page not found",
                success:false,
                error:true
            });
        }
        
        const  products = await productmodel.find({
            subCatId:request.params.id
            }).populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
        
        if(!products){
          response.status(500).json({            
              error: true,
              success: false
          })
          
            
        }
        
        
  
        return response.status(200).json({       
          error: false,
          success: true,
          products: products,
          totalPages: totalPages,
          page: page        
      })
    }catch(error){
      return response.status(500).json({       
          message: error.message || error,
          error: true,
          success: false
      })
}
            }

    // get all Product BySubCatName
  
    export async function getAllProductsBySubCatName(request,response) {
      
      
        try{
            
            const page = parseInt (request.query.page) || 1;
            const perPage = parseInt(request.query.perPage) || 10000;
            const totalPosts = await productmodel.countDocuments();
            const totalPages = Math.ceil(totalPosts / perPage);
            
            
            if(page > totalPages){
                return response.status(404).json({
                    
                    message:"page not found",
                    success:false,
                    error:true
                });
            }
            
            const  products = await productmodel.find({
                subCat:request.query.subCat
                }).populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();
            
            if(!products){
              response.status(500).json({            
                  error: true,
                  success: false
              })
              
                
            }
            
            
      
            return response.status(200).json({       
              error: false,
              success: true,
              products: products,
              totalPages: totalPages,
              page: page        
          })
        }catch(error){
          return response.status(500).json({       
              message: error.message || error,
              error: true,
              success: false
          })
    }
            }
    
    // get all Product ByThiredCatId
  
  export async function getAllProductsByThirdCatId(request,response) {
      
      
    try{
        
        const page = parseInt (request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await productmodel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);
        
        
        if(page > totalPages){
            return response.status(404).json({
                
                message:"page not found",
                success:false,
                error:true
            });
        }
        
        const  products = await productmodel.find({
            thirdsubCatId:request.params.id
            }).populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
        
        if(!products){
          response.status(500).json({            
              error: true,
              success: false
          })
          
            
        }
        
        
  
        return response.status(200).json({       
          error: false,
          success: true,
          products: products,
          totalPages: totalPages,
          page: page        
      })
    }catch(error){
      return response.status(500).json({       
          message: error.message || error,
          error: true,
          success: false
      })
}
            }
  
    // get all Product ByThirdName
  
    export async function getAllProductsByThirdCatName(request,response) {
      
      
        try{
            
            const page = parseInt (request.query.page) || 1;
            const perPage = parseInt(request.query.perPage) || 10000;
            const totalPosts = await productmodel.countDocuments();
            const totalPages = Math.ceil(totalPosts / perPage);
            
            
            if(page > totalPages){
                return response.status(404).json({
                    
                    message:"page not found",
                    success:false,
                    error:true
                });
            }
            
            const  products = await productmodel.find({
                thirdsubCat:request.query.thirdsubCat
                }).populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();
            
            if(!products){
              response.status(500).json({            
                  error: true,
                  success: false
              })
              
                
            }
            
            
      
            return response.status(200).json({       
              error: false,
              success: true,
              products: products,
              totalPages: totalPages,
              page: page        
          })
        }catch(error){
          return response.status(500).json({       
              message: error.message || error,
              error: true,
              success: false
          })
    }
            }
     
    // get all Product ByPrice
  
     export async function getAllProductsByPrice(request,response) {
         
         let productList = [];
         
         
         if (request.query.catId !== "" && request.query.catId !== undefined){
             
             const productListArr = await productmodel.find({       
                 catId: request.query.catId,           
             }).populate("category");
             
             productList = productListArr;
             
         }
         
         
         if (request.query.subCatId !== "" && request.query.subCatId !== undefined){
             
            const productListArr = await product.find({       
                subCatId: request.query.subCatId,           
            }).populate("category");
            
            productList = productListArr;
            
        }
         
         
        if (request.query.thirdsubCatId !== "" && request.query.thirdsubCatId !== undefined){
             
            const productListArr = await product.find({       
                thirdsubCatId: request.query.thirdsubCatId,           
            }).populate("category");
            
            productList = productListArr;
            
        }
        
        
        const filteredProducts = productList.filter((product) => {
            
            if (request.query.minPrice && product.price < parseInt(+request.query.minPrice)){
                return false;
            }
            if (request.query.maxPrice && product.price < parseInt(+request.query.maxPrice)){
                return false;
            }
            return true;
        });
        
        return response.status(200).json({
            error:false,
            success:true,
            products: filteredProducts,
            totalPages: 0,
            page: 0,
        });
            }
     
    // get all Product ByRating
  
 export async function getAllProductsByRating(request,response) {
      
      
        try{
            
            const page = parseInt (request.query.page) || 1;
            const perPage = parseInt(request.query.perPage) || 10000;
            const totalPosts = await productmodel.countDocuments();
            const totalPages = Math.ceil(totalPosts / perPage);
            
            
            if(page > totalPages){
                return response.status(404).json({
                    
                    message:"page not found",
                    success:false,
                    error:true
                });
            }
            
            let products=[];
            
            if (request.query.catId!==undefined){
                products = await productmodel.find({
                    rating:request.query.rating,
                    catId: request.query.catId,
         
                    }).populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
                  
            }
            
            if (request.query.subCatId!==undefined){
                products = await productmodel.find({
                    rating:request.query.rating,
                    subCatId: request.query.subCatId,
         
                    }).populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
                  
            }
            
            if (request.query.thirdsubCatId!==undefined){
                products = await productmodel.find({
                    rating:request.query.rating,
                    thirdsubCatId: request.query.thirdsubCatId,
         
                    }).populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
                  
            }
         
            if(!products){
              response.status(500).json({            
                  error: true,
                  success: false
              })
              
                
            }
            
            
      
            return response.status(200).json({       
              error: false,
              success: true,
              products: products,
              totalPages: totalPages,
              page: page        
          })
        }catch(error){
          return response.status(500).json({       
              message: error.message || error,
              error: true,
              success: false
          })
    }
            }
    
    // get all Product Count
  
 export async function getAllProductsCount(request,response) { 
                                                                         
                     try{
                        
                        
                        const productsCount = await productmodel.countDocuments() ;
                        
                        if (!productsCount){
                            response.status(500).json({
                                
                                error:true,
                                success:false
                            })
                        }
                        
                        return response.status(500).json({       
                        
                            error: false,
                            success: true,
                            productsCount:productsCount
                        })  
                        
                        
                     }catch(error){
                        return response.status(500).json({       
                            message: error.message || error,
                            error: true,
                            success: false
                        })                                                    
                                                                         
                   }
            }
                   
    // get all features Product 
  
 export async function getAllProductsFeatures(request,response) {
      
                try{
                    
                    const  products = await productmodel.find({
                        isFeatured:true
                        }).populate("category");
                  
                    
                    if(!products){
                      response.status(500).json({            
                          error: true,
                          success: false
                      })
                      
                        
                    }
             
                    return response.status(200).json({       
                      error: false,
                      success: true,
                      products: products,
                       
                  })
                    

                }catch(error){
                  return response.status(500).json({       
                      message: error.message || error,
                      error: true,
                      success: false
                  })
            }
            }
                          
    //Delete Product 
  
 export async function DeleteProducts(request,response) { 
                                                                      
                  const products = await productmodel.findById(request.params.id) .populate("category") ;
                  
                  if (!products){
                    response.status(500).json({  
                        message:"product Not found",          
                        error: true,
                        success: false
                    })
                    
                      
                  }  
                  
                  
                  const images = products.images;
                  
                  let img="";
                  for (img of images){
                           const imgUrl = img;
                  const urlArr =imgUrl.split("/");
                  const image = urlArr[urlArr.length -1];
                  const imageName = image.split(".")[0];
                    
                      
                        if (imageName) {
                      
                 cloudinary.uploader.destroy(
                      imageName,
                      (error,result)=> {
                          
                      });
                   
                      
                  }
                  }
                  
                   const deleteProduct = await productmodel.findByIdAndDelete(request.params.id);                 
                   if(!deleteProduct){
                    response.status(404).json({  
                        message:"product Not deleted",          
                        error: true,
                        success: false
                    })
                       
                   }
                  return response.status(200).json({  
                    message:"product  deleted",          
                    error: false,
                    success: true
                })
            }
 
     //DeletemultipleProducts
              
export async function deletemultipleProducts(request, response) {
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
    // সব প্রোডাক্ট একসাথে খোঁজা
    const products = await productmodel.find({ _id: { $in: ids } });

    const imageDeletionPromises = [];

    for (const product of products) {
      if (!product || !product.images) continue;

      for (const imgUrl of product.images) {
        try {
          // ইমেজ URL থেকে publicId বের করা
          const urlArr = imgUrl.split("/");
          const lastSegment = urlArr[urlArr.length - 1];
          const publicIdWithExtension = lastSegment.split(",")[0];
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

    // সব প্রোডাক্ট একসাথে ডিলিট করো
    await productmodel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      error: false,
      success: true,
      message: "প্রোডাক্টগুলো সফলভাবে ডিলিট হয়েছে",
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

    //get single Product 
  
 export async function getProducts(request,response) { 
                                                                      
                            const products = await productmodel.findById(request.params.id) .populate("category") ;
                            try{
                                if(!products){
                                    response.status(404).json({  
                                        message:"product Not found",          
                                        error: true,
                                        success: false
                                    }) 
                                    
                                }
                                
                                return response.status(200).json({  
                                     
                                    error: false,
                                    success: true,
                                    products:products
                                })
                                
                            }catch(error){
                                
                                return response.status(500).json({  
                                    message:error.message || error,          
                                    error: false,
                                    success: true
                                })
                               
                                
                            }
            }
 
 
 
   // Remove  Image from cloudinary
   

  
    
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
  
  
  
  
  
     // Update products
     
  export async function UpadteProduct(request, res) {
    try {
  
  
      const product = await productmodel.findByIdAndUpdate(
        request.params.id,
        {
            name:request.body.name,
                description:request.body.description,
                bannerimages:request.body.bannerimages,
                bannerTitlename:request.body.bannerTitlename,
                isDisplayOnHomeBanner:request.body.isDisplayOnHomeBanner,
                images: request.body.images,
                brand:request.body.brand,
                price:request.body.price,
                oldPrice:request.body.oldPrice,
                catName:request.body.catName,
                catId:request.body.catId,
                subCatId:request.body.subCatId,
                subCat:request.body.subCat,
                category:request.body.category,
                thirdsubCatId:request.body.thirdsubCatId,
                thirdsubCat:request.body.thirdsubCat,   
                countInStock:request.body.countInStock,
                rating:request.body.rating,
                isFeatured:request.body.isFeatured,
                discount:request.body.discount,      
                productRam:request.body.productRam,
                size:request.body.size,
                productWeight:request.body.productWeight,
            
        },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({
          message: "Category not found",
          success: false,
          error: true,
        });
      }
  
      return res.status(200).json({
        success: true,
        error: false,
        product: product,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        success: false,
        error: true,
      });
    }
  }

      //Product Rams Section
      
      export async function createProductRams(request,response) {

      try{
          let  productRams = new productRamsmodel({
              name:request.body.name,

          });
          
          productRams = await productRams.save();
          
          if (!productRams){
           response.status(500).json({
                      
                message: "ProductRams not Created",
                error: true,
                success: false
            })
          }
         

         
         response.status(200).json({
                      
            message: "ProductRams Created successfully",
            error: false,
            success: true,
            product:productRams
        })
      }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })
         
     }
      
      
           }
      
          // Update products
     
  export async function UpadteProductRams(request, res) {
    try {
  
  
      const productRams = await productRamsmodel.findByIdAndUpdate(
        request.params.id,
        {
            name:request.body.name,
    
            
        },
        { new: true }
      );
  
     if (!productRams) {
        return res.status(404).json({
          message: "Category not found",
          success: false,
          error: true,
        });
      }
  
 return res.status(200).json({
  success: true,
  error: false,
  product: productRams,
  message: "RAM updated successfully" // ✅ message add kora holo
});

       
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        success: false,
        error: true,
      });
    }
  }
  
      
      //Delete Product rams
  
 export async function DeleteProductsRams(request,response) { 
                                                                      
                  const productsRams = await productRamsmodel.findById(request.params.id);
                  
                  if (!productsRams){
                    response.status(500).json({  
                        message:"productRams Not found",          
                        error: true,
                        success: false
                    })
                    
                      
                  }  
      
                  
                   const deleteProductrams = await productRamsmodel.findByIdAndDelete(request.params.id);                 
                   if(!deleteProductrams){
                    response.status(404).json({  
                        message:"productRams Not deleted",          
                        error: true,
                        success: false
                    })
                       
                   }
                  return response.status(200).json({  
                    message:"productRams  deleted",          
                    error: false,
                    success: true
                })
            }
      
      
           //DeletemultipleProducts
              
export async function deletemultipleProductsRams(request, response) {
  const { ids } = request.body;

  // ইনপুট যাচাই
  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "ভুল ইনপুট দেওয়া হয়েছে",
    });
  }
try{
    // সব প্রোডাক্ট একসাথে ডিলিট করো
    await productRamsmodel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      error: false,
      success: true,
      message: "প্রোডাক্টগুলো সফলভাবে ডিলিট হয়েছে",
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


  // Get ProductRams
  
  export async function getProductsRams(request,response) { 
                                                                      
                            const productsRams = await productRamsmodel.find() ;
                            try{
                                if(!productsRams){
                                    response.status(404).json({  
                                        message:"productRams Not found",          
                                        error: true,
                                        success: false
                                    }) 
                                    
                                }
                                
                                return response.status(200).json({  
                                     
                                    error: false,
                                    success: true,
                                    products:productsRams
                                })
                                
                            }catch(error){
                                
                                return response.status(500).json({  
                                    message:error.message || error,          
                                    error: false,
                                    success: true
                                })
                               
                                
                            }
            }
 
  export async function getProductsRamsById(request,response) { 
                                                                      
                           
                            try{
                               const productsRams = await productRamsmodel.findById(request.params.id) ;
                                if(!productsRams){
                                    response.status(404).json({  
                                        message:"productRams Not found",          
                                        error: true,
                                        success: false
                                    }) 
                                    
                                }
                                
                                return response.status(200).json({  
                                     
                                    error: false,
                                    success: true,
                                    products:productsRams
                                })
                                
                            }catch(error){
                                
                                return response.status(500).json({  
                                    message:error.message || error,          
                                    error: false,
                                    success: true
                                })
                               
                                
                            }
            }
  
  
  
  
  
  
  
  
  
   
      //Product Size Section
      
      export async function createProductSize(request,response) {

      try{
          let  productSize = new productSizesmodel({
              name:request.body.name,

          });
          
          productSize = await productSize.save();
          
          if (!productSize){
           response.status(500).json({
                      
                message: "ProductSize not Created",
                error: true,
                success: false
            })
          }
         

         
         response.status(200).json({
                      
            message: "ProductSize Created successfully",
            error: false,
            success: true,
            product:productSize
        })
      }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })
         
     }
      
      
           }
      
          // Update products
     
  export async function UpadteProductSize(request, res) {
    try {
  
  
      const productSize = await productSizesmodel.findByIdAndUpdate(
        request.params.id,
        {
            name:request.body.name,
    
            
        },
        { new: true }
      );
  
     if (!productSize) {
        return res.status(404).json({
          message: "ProductSize not found",
          success: false,
          error: true,
        });
      }
  
 return res.status(200).json({
  success: true,
  error: false,
  product: productSize,
  message: "Size updated successfully" // ✅ message add kora holo
});

       
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        success: false,
        error: true,
      });
    }
  }
  
      
      //Delete Product Size
  
 export async function DeleteProductsSize(request,response) { 
                                                                      
                  const productsSize = await productSizesmodel.findById(request.params.id);
                  
                  if (!productsSize){
                    response.status(500).json({  
                        message:"productSize Not found",          
                        error: true,
                        success: false
                    })
                    
                      
                  }  
      
                  
                   const deleteProductSize = await productSizesmodel.findByIdAndDelete(request.params.id);                 
                   if(!deleteProductSize){
                    response.status(404).json({  
                        message:"productSize Not deleted",          
                        error: true,
                        success: false
                    })
                       
                   }
                  return response.status(200).json({  
                    message:"productSize  deleted",          
                    error: false,
                    success: true
                })
            }
      
      
           //DeletemultipleProducts
              
export async function deletemultipleProductsSize(request, response) {
  const { ids } = request.body;

  // ইনপুট যাচাই
  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "ভুল ইনপুট দেওয়া হয়েছে",
    });
  }
try{
    // সব প্রোডাক্ট একসাথে ডিলিট করো
    await productSizesmodel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      error: false,
      success: true,
      message: "প্রোডাক্টগুলো সফলভাবে ডিলিট হয়েছে",
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


  // Get ProductSize
  
  export async function getProductsSize(request,response) { 
                                                                      
                            const productsSize = await productSizesmodel.find() ;
                            try{
                                if(!productsSize){
                                    response.status(404).json({  
                                        message:"productSize Not found",          
                                        error: true,
                                        success: false
                                    }) 
                                    
                                }
                                
                                return response.status(200).json({  
                                     
                                    error: false,
                                    success: true,
                                    products:productsSize
                                })
                                
                            }catch(error){
                                
                                return response.status(500).json({  
                                    message:error.message || error,          
                                    error: false,
                                    success: true
                                })
                               
                                
                            }
            }
 
  export async function getProductsSizeById(request,response) { 
                                                                      
                           
                            try{
                               const productsSize = await productSizesmodel.findById(request.params.id) ;
                                if(!productsSize){
                                    response.status(404).json({  
                                        message:"productSize Not found",          
                                        error: true,
                                        success: false
                                    }) 
                                    
                                }
                                
                                return response.status(200).json({  
                                     
                                    error: false,
                                    success: true,
                                    products:productsSize
                                })
                                
                            }catch(error){
                                
                                return response.status(500).json({  
                                    message:error.message || error,          
                                    error: false,
                                    success: true
                                })
                               
                                
                            }
            }
  
  
  
  
  
  
   //Product Wieght Section
      
      export async function createProductWieght(request,response) {

      try{
          let  productWieght = new productWeightmodel({
              name:request.body.name,

          });
          
          productWieght = await productWieght.save();
          
          if (!productWieght){
           response.status(500).json({
                      
                message: "ProductWieght not Created",
                error: true,
                success: false
            })
          }
         

         
         response.status(200).json({
                      
            message: "ProductWieght Created successfully",
            error: false,
            success: true,
            product:productWieght
        })
      }catch(error){
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })
         
     }
      
      
           }
      
          // Update products
     
  export async function UpadteProductWieght(request, res) {
    try {
  
  
      const productWieght = await productWeightmodel.findByIdAndUpdate(
        request.params.id,
        {
            name:request.body.name,
    
            
        },
        { new: true }
      );
  
     if (!productWieght) {
        return res.status(404).json({
          message: "ProductWieght not found",
          success: false,
          error: true,
        });
      }
  
 return res.status(200).json({
  success: true,
  error: false,
  product: productWieght,
  message: "Wieght updated successfully" // ✅ message add kora holo
});

       
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        success: false,
        error: true,
      });
    }
  }
  
      
      //Delete Product Size
  
 export async function DeleteProductsWieght(request,response) { 
                                                                      
                  const productsWieght = await productWeightmodel.findById(request.params.id);
                  
                  if (!productsWieght){
                    response.status(500).json({  
                        message:"productWieght Not found",          
                        error: true,
                        success: false
                    })
                    
                      
                  }  
      
                  
                   const deleteProductWieght = await productWeightmodel.findByIdAndDelete(request.params.id);                 
                   if(!deleteProductWieght){
                    response.status(404).json({  
                        message:"productWieght Not deleted",          
                        error: true,
                        success: false
                    })
                       
                   }
                  return response.status(200).json({  
                    message:"productWieght  deleted",          
                    error: false,
                    success: true
                })
            }
      
      
           //DeletemultipleProducts
              
export async function deletemultipleProductsWieght(request, response) {
  const { ids } = request.body;

  // ইনপুট যাচাই
  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "ভুল ইনপুট দেওয়া হয়েছে",
    });
  }
try{
    // সব প্রোডাক্ট একসাথে ডিলিট করো
    await productWeightmodel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      error: false,
      success: true,
      message: "প্রোডাক্টগুলো সফলভাবে ডিলিট হয়েছে",
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


  // Get ProductSize
  
  export async function getProductsWieght(request,response) { 
                                                                      
                            const productsWieght = await productWeightmodel.find() ;
                            try{
                                if(!productsWieght){
                                    response.status(404).json({  
                                        message:"productWieght Not found",          
                                        error: true,
                                        success: false
                                    }) 
                                    
                                }
                                
                                return response.status(200).json({  
                                     
                                    error: false,
                                    success: true,
                                    products:productsWieght
                                })
                                
                            }catch(error){
                                
                                return response.status(500).json({  
                                    message:error.message || error,          
                                    error: false,
                                    success: true
                                })
                               
                                
                            }
            }
 
  export async function getProductsWieghtById(request,response) { 
                                                                      
                           
                            try{
                               const productsWieght = await productWeightmodel.findById(request.params.id) ;
                                if(!productsWieght){
                                    response.status(404).json({  
                                        message:"productWieght Not found",          
                                        error: true,
                                        success: false
                                    }) 
                                    
                                }
                                
                                return response.status(200).json({  
                                     
                                    error: false,
                                    success: true,
                                    products:productsWieght
                                })
                                
                            }catch(error){
                                
                                return response.status(500).json({  
                                    message:error.message || error,          
                                    error: false,
                                    success: true
                                })
                               
                                
                            }
            }
  
  
  
  
export async function filters(request, response) {
  const {
    catId,
    subCatId,
    thirdsubCatId,
    minPrice,
    maxPrice,
    rating,
    page ,
    limit ,
  } = request.body;

  const filters = {};

  if (catId?.length) {
    filters.catId = {$in: catId};
  }

  if (subCatId?.length) {
    filters.subCatId = {$in: subCatId};
  }
  if (thirdsubCatId?.length) {
    filters.thirdsubCatId = {$in: thirdsubCatId };
  }

  if (minPrice || maxPrice) {
    filters.price = {
      $gte: +minPrice || 0,
      $lte: +maxPrice || 9999999,
    };
  }

  if (rating?.length) {
    filters.rating = {$in: rating};
  }

  try {
    const products = await productmodel
      .find(filters)
      .populate("category") // ✅ field name অনুযায়ী populate করো
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await productmodel.countDocuments(filters);

    return response.status(200).json({
      error: false,
      success: true,
      products:products,
      total:total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



const sortItems=(products, sortBy, order) => {
  return products.sort((a, b)=>{
      if (sortBy === 'name') {
      return order === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  }
      
      if (sortBy === "price") {
    return order === 'asc' ? a.price - b.price : b.price - a.price
  }  
   return 0;
  })
  

}


export async function sortBy(request, response) {
 
  const {
 products,
 sortBy,
 order
  } = request.body;

  const sortedItems = sortItems([...products?.products], sortBy, order);


    return response.status(200).json({
      error: false,
      success: true,
      products:sortedItems,
      page: 0,
      totalPages: 0,
    });
  }



    // get all Search Product ByCatId
  
export async function searchProductController(request, response) {
  try {
    const query = request.query.q;
    const page = parseInt(request.query.page) ;
    const limit = parseInt(request.query.limit) ;

    if (!query) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Query is required",
      });
    }

    const filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { catName: { $regex: query, $options: "i" } },
        { subCat: { $regex: query, $options: "i" } },
        { thirdsubCat: { $regex: query, $options: "i" } },
      ],
    };

    const products = await productmodel
      .find(filter)
      .populate("category")
 

    const total = await products?.length

    return response.status(200).json({
      message: "Products fetched successfully",
      error: false,
      success: true,
      products: products,
      total: 1,
      page: page,
      totalPages: 1
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,  
    });
  }
}

