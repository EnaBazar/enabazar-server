import MylistModel from "../models/mylist.model.js";
import usermodel from "../models/User.js";


  // Add Mylist Item 
  
  export const  AddToMyListController = async (request,response) => {
      try {
        const userId = request.userId
        const {
            
               productId,
               productTitle,
               image,
               rating,
               price,
               oldPrice,
               brand,
               discount
               
               } = 
        request.body;
        
        const item = await MylistModel.findOne({
            userId :userId,
            productId : productId
        })
        
        if(item){
            return response.status(400).json({       
                message: "Items Already in My list",
              
            })
        }

        
        const mylist = new MylistModel({
            productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount,
            userId
        })
        
        const save = await mylist.save()
        
        
         return response.status(200).json({  
                                           
            data: save,                                  
            message: "The Product  add in MyList",
            error: false,
            success: true
        })
         
         
      } catch (error) {
          
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })
      }
      
      
  }
  
  
  
  
    // Delete Mylist Item 
  
    export const  DeleteToMyListController = async (request,response) => {
    try{
       const mylistItem = await MylistModel.findById(request.params.id) ;
       if(!mylistItem)  {
           
        return response.status(500).json({       
            message: "The items with this given id was not found",
            error: true,
            success: false
        })   
       }  
            
            const deletedItem = await MylistModel.findByIdAndDelete(request.params.id);
            if(!deletedItem){
                return response.status(404).json({       
                    message: "The item is not deleted",
                    error: true,
                    success: false
                })   
            }
            
            return response.status(200).json({       
                message: "The item  deleted from mylist",
                error: false,
                success: true
            })   
            
    } catch (error) {
          
        return response.status(500).json({       
            message: error.message || error,
            error: true,
            success: false
        })
      }
    }
    
      // Get Mylist Item 
  
      export const  getToMyListController = async (request,response) => {
          
         try {
            
            const userId =request.userId;
            const mylistItems = await MylistModel.find({
                
                userId:userId
            })
            
            return response.status(200).json({       
          
                error: false,
                success: true,
                data:mylistItems
            }) 
            
            
         } catch (error) {
            return response.status(500).json({       
                message: error.message || error,
                error: true,
                success: false
            })
         } 
          
      }
    
