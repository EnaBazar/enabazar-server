import AddressModel from "../models/address.model.js";
import usermodel from "../models/User.js";



export const addAddressController = async (request, response) => {
   try {
    
     const { address_line, city, state, pincode, country, mobile, addressType,deliverylocation,landmark, userId } = request.body;
     
     

     

    
  // if (
        
   // !address_line || city || state || pincode || country || mobile  
        
 // ){
     // return response.json({       
           // message: "Please Provide All The Fields",
           // error:false,
          // success:true
      // })  
        
  //  }
    
    
    
    const address = new AddressModel({
        address_line, city, state, pincode, country, mobile, addressType,deliverylocation, landmark, userId    
        
    })
    
 const savedAddress = await address.save();
 
 const updateAddress = await usermodel.updateOne({_id: userId },{
     $push: {
         
         address_details: savedAddress?._id
     }
     
 })
    
    
    
    
     return response.status(200).json({  
            data: savedAddress,                                
             message: "Address add successfully",
            error: false,
            success: true
        }) 
    
    
    
   } catch (error) {
     return response.json({       
            message: error.message || error,
            error:true,
            success:false
        })
   }
}


export const getAddressController = async (request, response) => {
    
    
    try {
         const address = await AddressModel.find({userId:request?.query?.userId});
         
         
         if(!address){
               return response.status(200).json({       
            message:"address not found",
            error:true,
            success:false
        })
             
         }else{
             
             
 const updateUser = await usermodel.updateOne({_id: request?.query?.userId },{
     $push: {
         
         address_details: address?._id
     }
     
 })
         }
         
           return response.status(200).json({       
          data:address,
            error:false,
            success:true,
          
        })
         
    } catch (error) {
         return response.json({       
            message: error.message || error,
            error:true,
            success:false
        })
    }
    
    
}


export const selectAddressController = async (request, response) => {
  try {
    const userId = request.params.id;

    const address = await AddressModel.find({
      _id: request.params.id
    });

    if (!address || address.length === 0) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false
      });
    }

    const updateAddress = await AddressModel.findByIdAndUpdate(
      request.params.id,
      {
        selected: request?.body?.selected
      },
      { new: true }
    );

    return response.json({
      error: false,
      success: true,
      address: updateAddress
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};

 // Update Address Item

 export async function editAddress(request,response) {
     
     try{
    
   const { address_line, city, state, pincode, country, mobile, addressType,deliverylocation,landmark, userId } = request.body;
      

         const id = request.params.id;
         const address = await AddressModel.findByIdAndUpdate(
             
            id,
             
             {
                address_line: address_line,
                          city: city,
                          state: state,
                          pincode: pincode,
                          country: country,
                          mobile: mobile,
                          addressType: addressType,
                          deliverylocation: deliverylocation,
                          landmark: landmark
              
             },
             {new: true}
         )
         
            
         return response.json({
             
             message:"Address Upadted successfully",
             error: false,
             success:true,
             address: address
         })
         
     }catch(error){
         
       return response.status(500).json({
           
         message: error.message || error,
         error: true,
         success:false  
           
       })
         
     }
    
 }
    
           // Delete Address Item
  
    export async function DeleteAddressController(request,response) {
               
                    
            try {
                const userId = request.userId
                
              const _id = request.params.id
              
              if(!_id){
                  return response.status(400).json({
                      message : "provide_id",
                      error:true,
                      success :false
                  })
              }

              const deleteItem = await AddressModel.deleteOne({_id : _id, userId: userId})
              
              
              if(!deleteItem){
                return response.status(404).json({
                    message : "The Address in the database is not found",
                    error:true,
                    success :false,
               
                    
                })
            }
              
              
              return response.json({       
                message: "Address deleted successfully",
                error: false,
                success: true,
                data: deleteItem
            })
            } catch (error) {
                return response.status(500).json({       
                    message: error.message || error,
                    error: true,
                    success: false
                })
            }
               
               
          
           }

