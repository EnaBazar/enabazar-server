import { SendVerficationCode, WelcomeEmail } from "../middleware/Email.js"
import usermodel from "../models/User.js"
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs'
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import Reviewsmodel from "../models/reviews.model.js";






//cloudinary configaration

cloudinary.config({
     
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});
 //registration//
      




const register = async (req, res) => {
  try {
    const { mobile, password, name } = req.body;

    if (!mobile || !password || !name) {
      return res.json({ error: true, message: "সব ফিল্ড লাগবে" });
    }

    const exist = await usermodel.findOne({ mobile });
    if (exist) {
      return res.json({ error: true, message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = new usermodel({
      name,
      mobile,
      password,
      otp,
      otpExpires: Date.now() + 300000,

    });

    await user.save();

    await sendSMS(mobile, otp);

    return res.json({
      success: true,
      message: "OTP পাঠানো হয়েছে"
    });

  } catch (error) {
    console.log(error);
    return res.json({ error: true, message: "Server error" });
  }
};



export async function verifyMobileOtp(req, res) {
  try {
    const { mobile, otp } = req.body;

    const user = await usermodel.findOne({ mobile });

    if (!user) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "OTP expired",
      });
    }

    user.verify_mobile = true;
    user.otp = "";
    user.otpExpires = "";
    await user.save();

    return res.json({
      success: true,
      error: false,
      message: "Mobile verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message,
    });
  }
}





const  registerPanel=async(req,res)=>{
    
    try{
        
   const {mobile,password,name}=req.body
   
        if (!mobile || !password || !name){
            
            return res.status(400).json({error:true,success:false,message:"All fields are required"})
        }
        const ExistsUser= await usermodel.findOne({mobile})
        if (ExistsUser){
        return res.status(400).json({error:true,success:false,message:"User Already Exists Please Login"})
            
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword =await bcryptjs.hash(password,salt)
  
        const user= new usermodel({
            mobile,
            password:hashPassword,
            name,
            otp : "",
            otpExpires : Date.now() + 600000,  
        })
        const token =jwt.sign(
        {
        mobile: user.mobile, id: user._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY  
        )
        await user.save()
        return res.status(200).json({success:true,error:false,message:"User Register Successfuly", token: token, user})
        }catch(error){
        console.log(error)
        return res.status(500).json({success:false,error:true,message:"internet Server error"})
        }
        }


// verify email
const VerifyEmail=async(req,res)=>{
    
    try{
      const {otp} = req.body
      const user = await usermodel.findOne({
          verificationCode:otp
      })
      if (!user) {
        return res.status(400).json({error:true, success:false,message:"inavlid or Exprired Code"})
          
      }
      user.verify_email=true,
      user.verificationCode=undefined
      await user.save()
   
      await WelcomeEmail(user.email,user.name)
    
      return res.status(200).json({error:false,success:true,message:"Email Verified Successfully"})
    }catch(error){
        console.log(error)
        return res.status(500).json({ error:true,success:false,message:"internet Server error"})
    }
    
}


export async function authWithGoogle(request,response){
    const {name, email, password, avatar, mobile, role} = request.body;
    
    try {
        const existingUser = await usermodel.findOne({email: email});
       
        if (!existingUser){
            const user = await usermodel.create({
                name: name,
                mobile: mobile,
                email: email,
                password: "null",
                avatar: avatar,
                role: role,
                verify_email:true,
                signUpWithGoogle:true
            });
              
              await user.save();
              
    const accesstoken = await generatedAccessToken(user._id)
    const refreshtoken = await generatedRefreshToken(user._id)
    
  await usermodel.findByIdAndUpdate(user?._id,{
        last_login_date : new Date()
    })
 
    const cookiesOption = {
        
        httpOnly :true,
        secure :true,
        sameSite :"none"
    }
   response.cookie('accessToken',accesstoken,cookiesOption) 
   response.cookie('refreshToken',refreshtoken,cookiesOption)   
   return response.json({   
       message : "Login Sccessfully",
       error : false,
       success : true,
       data :{       
           accesstoken,
           refreshtoken
       }       
   })
        }else{
            
            
    const accesstoken = await generatedAccessToken(existingUser._id)
    const refreshtoken = await generatedRefreshToken(existingUser._id)
    
  await usermodel.findByIdAndUpdate(existingUser?._id,{
        last_login_date : new Date()
    })
 
    const cookiesOption = {
        
        httpOnly :true,
        secure :true,
        sameSite :"none"
    }
   response.cookie('accessToken',accesstoken,cookiesOption) 
   response.cookie('refreshToken',refreshtoken,cookiesOption)   
   return response.json({   
       message : "Login Sccessfully",
       error : false,
       success : true,
       data :{       
           accesstoken,
           refreshtoken
       }       
   }) 
            
        }
    } catch (error) {
    
        return response.status(500).json({
        error:true,
        success:false,
        message: error.message || error}) 
    }
}

//login user
export async function loginUserController(request, response) {
   try {
      const { mobile,name } = request.body;

      // 1. Find user
      const user = await usermodel.findOne({ mobile,name });

      if (!user) {
         return response.status(400).json({
            message: "User Not Registered",
            error: true,
            success: false
         });
      }

      // 2. Check status
      if (user.status !== "Active") {
         return response.status(400).json({
            message: "Connect to admin",
            error: true,
            success: false
         });
      }

      // ❌ bcrypt compare লাগবে না
      // কারণ আপনি mobile = mobile মিলিয়ে login করাতে চান

      // 3. Generate tokens
      const accesstoken = await generatedAccessToken(user._id);
      const refreshtoken = await generatedRefreshToken(user._id);

      // 4. Update last login
      await usermodel.findByIdAndUpdate(user._id, {
         last_login_date: new Date()
      });

      // 5. Cookie settings
      const cookiesOption = {
         httpOnly: true,
         secure: true,
         sameSite: "none"
      };

      response.cookie("accessToken", accesstoken, cookiesOption);
      response.cookie("refreshToken", refreshtoken, cookiesOption);

      // 6. Success response
      return response.json({
         message: "Login Successfully",
         error: false,
         success: true,
         data: {
            accesstoken,
            refreshtoken
         }
      });

   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      });
   }
}

//loginPanel user
export async function loginPanelUserController(request, response) {
   try {
      const { mobile } = request.body;

      // 1. User find
      const user = await usermodel.findOne({ mobile });

      if (!user) {
         return response.status(400).json({
            message: "User not registered",
            error: true,
            success: false
         });
      }

      // 2. Status check
      if (user.status !== "Active") {
         return response.status(400).json({
            message: "Connect to admin",
            error: true,
            success: false
         });
      }

      // 3. এখানে আর কিছু compare করার দরকার নেই
      // কারণ আপনি শুধু mobile দিয়ে login করতে চান

      // 4. Tokens generate
      const accessToken = await generatedAccessToken(user._id);
      const refreshToken = await generatedRefreshToken(user._id);

      // 5. Update last login
      await usermodel.findByIdAndUpdate(user._id, {
         last_login_date: new Date()
      });

      // 6. Cookie options
      const cookiesOption = {
         httpOnly: true,
         secure: true,
         sameSite: "none"
      };

      // 7. Set cookies
      response.cookie("accessToken", accessToken, cookiesOption);
      response.cookie("refreshToken", refreshToken, cookiesOption);

      return response.json({
         message: "Login Successfully",
         error: false,
         success: true,
         data: {
            accessToken,
            refreshToken
         }
      });

   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      });
   }
}



//logout user
 export async function logoutController(request,response) {   
    try{
        
     const userid = request.userId    
    
     const cookiesOption = {      
         httpOnly :true,
         secure :true,
         sameSite :"none"
     }
    response.clearCookie('accessToken',cookiesOption) 
    response.clearCookie('refreshToken',cookiesOption)   
    
    const removeRefreshToken = await usermodel.findByIdAndUpdate(userid,{
        refresh_token : ""
    })
    return response.json({        
        message : "Logout successfully",
        error : false,
        success : true,      
    })        
    } catch(error){       
        return response.status(500).json({
         message : error.message || error ,
         error : true,
         success : false          
        })
    }
  }
 
 //image upload
 
 var imagesArr = [];
 
 export async function userAvatarController(request,response) {
     
     try {
         imagesArr = [];
         
         const userId = request.userId;
         const image = request.files;
         
         const user = await usermodel.findOne({_id: userId});
      
         if (!user){
            return response.status(500).json({       
                message: "User Not Found",
                error: true,
                success: false
            })
              
          }
      
      //Frist Remove image fro cloudinary
      
      
         const imgUrl = user.avatar;
         
         const urlArr =imgUrl.split("/");
         const Avatar_image = urlArr[urlArr.length -1];
         const imageName = Avatar_image.split(".")[0];
         
         if (imageName) {
             
           const res = await cloudinary.uploader.destroy(
             imageName,
             (error,result)=> {
                 
             }
         );
           
         }
         
         
         
  
    
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
         
         user.avatar = imagesArr[0];
         await user.save();
         
         return response.status(200).json({
             _id: userId,
             avtar: imagesArr[0]
         });
         
     } catch (error) {
         return response.status(500).json({       
             message: error.message || error,
             error: true,
             success: false
         })
     };
 };
 
 //image remove from cloudinary Data
 
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
 
 
 
 
 
 
 // Update user Deatils
 
 export async function updateUserDeatils(request,response) {
     
     try{
       const userId = request.userId 
       const {name,mobile,password}= request.body;
       const userExist = await usermodel.findById(userId);
       
       
       if (!userExist)
       return response.status(400).send("The user cannot be Updated!")
       
   
         let hashPassword =""
         
         if(password){
             
             const salt = await bcryptjs.genSalt(10)
             hashPassword = await bcryptjs.hash(password,salt)
         }else{
             hashPassword = userExist.password;
             
         }
         
         
         const updateUser = await usermodel.findByIdAndUpdate(
             
             userId,
             
             {
               name:name,
               mobile: mobile,
               password: hashPassword,
        
              
             },
             {new: true}
         )
         
         
         
         
         /// send  Verification email
         
         const user = await usermodel.findOne({mobile:mobile})
         
    
         
         
    
         if(!userExist)
         return res.status(400).send("The user cannot be Updated!")
         
         
         return response.json({
             
             message:"User Upadted successfully",
             error: false,
             success:true,
             user: {
                 
                 name:updateUser?.name,
                 _id:updateUser?._id,
      
                 mobile:updateUser?.mobile,
                 avatar:updateUser?.avatar
                
             }
         })
         
     }catch(error){
         
       return response.status(500).json({
           
         message: error.message || error,
         error: true,
         success:false  
           
       })
         
     }
    
 }
 
 // forgot password recovery
 
 
 
 export async function forgotPasswordController(request,response) {
    try{
        const {email} = request.body
        
        const user = await usermodel.findOne({email:email})
        
        if (!user){
            
            return response.status(400).json({
                
                message : "Email not avaiable",
                error:true,
                success: false
            })    
        } else {
             let verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 
            user.otp = verifyCode;
            user.otpExpires = Date.now() + 600000;
            await user.save();
            
            
            
            SendVerficationCode(user.email,verifyCode)
            
            return response.json({
                message:"Send otp please check your email",
                error:false,
                success:true
            })
            
        } 
     
    }catch(error){
        
        return response.status(500).json({
            
            message: error.message || error,
            error:true,
            success:false
        })
        
    }
 }
  
  
  
  //verify forgot password otp
  
  
  export async function verifyForgotPasswordOtp(request,response) {
      
    try{
        
        const {email,otp} = request.body
        
        const user =await usermodel.findOne({email:email})
        
        
        if (!user){
            
            return response.status(400).json({
                
                message: "Email not available",
                error:true,
                seccess:false
            })
        }
        
        
        if (!email || !otp){
            
            return response.status(400).json({
                
                message: "Provied required field email otp",
                error:true,
                success:false
            }) 
            
        }
        
        if(otp !== user.otp){
            
            return response.status(400).json({
                
                message: "Invailid OTP",
                error:true,
                success:false
            })
        }
        
        const currentTime = new Date().toString()
        
        if(user.otpExpires < currentTime){
            
            return response.status(400).json({
                
                message: "Otp expired",
                error:true,
                success:false
            })
        }
        
        
        user.otp ="";
        user.otpExpires ="";
        
        await user.save();
        
        return response.status(200).json({
                
            message: "OTP Veriified!",
            error:false,
            success:true
        })
        
    } catch (error) {
        
        return response.status(500).json({
                
            message: error.message || error,
            error:true,
            success:false
        })
    }
    
  }
  
  
  
  //Reset password
  
  export async function resetpassword(request,response) {
    try{
        const { newPassword, confirmPassword } = request.body;
        if ( !newPassword || !confirmPassword) {
            
            return response.status(400).json({
                error:true,
                success:false,
                message : "Provide required fields email, newPassword,confirmPassword"
            })
        }
        const user = await usermodel.findOne({ mobile });
        if(!user){
            return response.status(400).json({
                
                message: "Email is not available",
                error:true,
                success:false
            })
        }
        
        if(newPassword !== confirmPassword){
            return response.status(400).json({
                
                message: "NewPassword and Confirmpassword must be same",
                error:true,
                success:false
            })
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(confirmPassword, salt)
        
        user.password = hashPassword;
         await user.save();
        
     
        
        return response.json({
                
            message: "Password Reset successfully",
            error:false,
            success:true
        })
        
        
    } catch(error){
        return response.status(500).json({  
            message: error.message || error,
            error:true,
            success:false
        })
        
    }
  }
   //Reset password for admin
  
  export async function resetpasswordaccont(request,response) {
    try{
        const { email, oldpassword, newPassword, confirmPassword } = request.body;
        if (!email || !newPassword || !confirmPassword) {
            
            return response.status(400).json({
                error:true,
                success:false,
                message : "Provide required fields email, newPassword,confirmPassword"
            })
        }
        const user = await usermodel.findOne({ email });
        if(!user){
            return response.status(400).json({
                
                message: "Email is not available",
                error:true,
                success:false
            })
        }
        
        
        
        
        
        if(user?.signUpWithGoogle===false){
               const checkPassword = await bcryptjs.compare(oldpassword, user.password);
        
        if(!checkPassword){
                return response.status(400).json({
                message: "Your old Password is Worng",
                error:true,
                success:false
            })
            
        }  
        }
   
        
        if(newPassword !== confirmPassword){
            return response.status(400).json({
                
                message: "NewPassword and Confirmpassword must be same",
                error:true,
                success:false
            })
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(confirmPassword, salt)
        
        user.password = hashPassword;
        user.signUpWithGoogle = false;
         await user.save();
        
     
        
        return response.json({
                
            message: "Password is successfully",
            error:false,
            success:true
        })
        
        
    } catch(error){
        return response.status(500).json({  
            message: error.message || error,
            error:true,
            success:false
        })
        
    }
  }
 
 // Refersh token
 
 export async function refreshToken(request,response) {
    try{
        
        const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.split("")[1]
        if(!refreshToken){
            return response.status(401).json({
                message: "Invaild token",
                error:true,
                success:false
            })
        }
        
        const  verifyToken  = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
        if(!verifyToken){
            return response.status(401).json({
                message: "Token is expired",
                error:true,
                success:false
            })   
        }
        const userId = verifyToken?._id;
        const newAccessToken = await generatedAccessToken(userId)
        
        const cookiesOption ={
            httpOnly : true,
            secure : true,
            sameSite: "None"
        }
        response.cookie('accessToken',newAccessToken,cookiesOption)
        
        return response.json({
                
            message: "New Access token generated",
            error:false,
            success:true,
            data :{
                accessToken :newAccessToken
            }
        })
        
        
    }catch(error){
        return response.status(500).json({
                
            message: error.message || error,
            error:true,
            success:false
        })
    }
 }
 
 // get Login user deatals
 
 export async function userDeatils(request,response) {
    try{
        const userId = request.userId
        console.log(userId)
        const user = await usermodel.findById(userId).select('-password -refresh_token'). populate('address_details')
   
   
   
        return response.json({
                
            message: "user details",
            data: user,
            error:false,
            success:true,
          
        })
        
    }catch(error){
        return response.json({       
            message: "Somthins is wrong",
            error:true,
            success:false
        })
        
    }
 }
 

// Reviews Controller
 export async function addReviews(request,response) {
     try {
        const {image,userName,review,rating,userId,productId} = request.body;
        const userReview = new Reviewsmodel({
            image:image,
            userName:userName,
            review:review,
            rating:rating,
            userId:userId,
            productId:productId
        })
        
        await userReview.save();
        
          return response.json({
                
            message: "Reviews added successfully",
            error:false,
            success:true,
          
        })
        
     } catch (error) {
        return response.json({       
            message: "Somthins is wrong",
            error:true,
            success:false
        })
     }
     
     
 }
// Get Reviews 
 export async function getReviews(request,response) {
     try {
        const productId = request.query.productId;
        const reviews = await Reviewsmodel.find({productId:productId})
        
        if(!reviews){
          return response.status(400).json({       
    
            error:true,
            success:false
        })  
        }
    return response.status(200).json({       
    
            error:false,
            success:true,
            reviews:reviews
        })  
        
     } catch (error) {
         return response.json({       
            message: "Somthins is wrong",
            error:true,
            success:false
        })
     }
 }

 

// Get All Users 
 export async function getAllusers(request,response) {
     try {

        const users = await usermodel.find();
        
        if(!users){
          return response.status(400).json({       
    
            error:true,
            success:false
        })  
        }
    return response.status(200).json({       
    
            error:false,
            success:true,
            users:users
        })  
        
     } catch (error) {
         return response.json({       
            message: "Somthins is wrong",
            error:true,
            success:false
        })
     }
 }

 // Get All Users 
 export async function getAllReviews(request,response) {
     try {

        const reviews = await Reviewsmodel.find();
        
        if(!reviews){
          return response.status(400).json({       
    
            error:true,
            success:false
        })  
        }
    return response.status(200).json({       
    
            error:false,
            success:true,
            reviews:reviews
        })  
        
     } catch (error) {
         return response.json({       
            message: "Somthins is wrong",
            error:true,
            success:false
        })
     }
 }



      //DeletemultipleProducts
              
export async function deletemultipleUsers(request, response) {
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
    const users = await usermodel.find({ _id: { $in: ids } });

    const imageDeletionPromises = [];

    for (const user of users) {
      if (!user || !user.images) continue;

      for (const imgUrl of user.images) {
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
    await usermodel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      error: false,
      success: true,
      message: "All User Are Deleted",
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

  
  
    //Delete Product 
  
 export async function DeleteUsers(request,response) { 
                                                                      
                  const users = await usermodel.findById(request.params.id) ;
                  
                  if (!users){
                    response.status(500).json({  
                        message:"Users Not found",          
                        error: true,
                        success: false
                    })
                    
                      
                  }  
                  
                  
                  const images = users.avatar;
                  
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
                  
                   const deleteUser = await usermodel.findByIdAndDelete(request.params.id);                 
                   if(!deleteUser){
                    response.status(404).json({  
                        message:"User Not deleted",          
                        error: true,
                        success: false
                    })
                       
                   }
                  return response.status(200).json({  
                    message:"User  deleted",          
                    error: false,
                    success: true
                })
            }
export {register, VerifyEmail,registerPanel}