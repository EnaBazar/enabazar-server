import CartProductModel from "../models/cartproduct.model.js";
import usermodel from "../models/User.js";


  // Add Cart Item product
  
  export async function AddToCartItemController(request,response) {
      try {
        const userId = request.userId
        const {productTitle, image, rating, price, oldprice, discount, size, weight, Ram, quantity, subTotal, productId, countInStock,brand} = request.body
        
        if(!productId){
            return response.status(402).json({       
                message: "provide productId",
                error: false,
                success: true
            })
        }
        
        const checkItemCart = await CartProductModel.findOne({
            userId :userId,
            productId : productId
        })
        
        if (checkItemCart){
            return response.status(500).json({       
                message: "Item already in cart",
                
  
            })  
            
        }
        
        const cartItem = new CartProductModel({
            productTitle:productTitle,
            image:image,
            rating:rating,
            price:price,
            oldprice:oldprice,
            discount:discount,
            size:size,
            weight:weight,
            Ram:Ram,
            quantity:quantity,
            subTotal:subTotal,
            productId:productId,
            countInStock:countInStock,
            userId : userId,
            brand:brand
        })
        
        const save = await cartItem.save()
        
      
        
         return response.status(200).json({  
                                           
             data: save,                                  
            message: "Item add successfully",
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
  
  
    // Get Cart Item 
  
    export async function getCartItemController(request,response) {
        
        try {
            const userId = request.userId;
            
            const cartItem = await CartProductModel.find({
                userId: userId
            });
            
            return response.status(200).json({       
                data: cartItem,
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
    
 // Update Cart Item
  
    export async function UpadteCartItemController(request,response) {
        
            try {
                const userId =request.userId;
                
              const { _id,qty,subTotal, size, weight, Ram, } = request.body
              
              if(!_id || !qty){
                  return response.status(400).json({
                      message : "provide_id, qty"
                  })
              }
              
              const updateCartitem = await CartProductModel.updateOne({
                  _id : _id,
                  userId : userId
                  
              },{
                  quantity : qty, 
                  subTotal:subTotal,
                  size:size,
                  Ram:Ram,
                  weight:weight
              },
            {new:true}                                                   )
              
              return response.json({       
                message: "Update cart",
                error: false,
                success: true,
                data: updateCartitem
            })
            } catch (error) {
                return response.status(500).json({       
                    message: error.message || error,
                    error: true,
                    success: false
                })
            }
        }
    
           // Delete Cart Item
  
    export async function DeleteCartItemController(request,response) {
               
                    
            try {
                const userId = request.userId
                
              const {id} = request.params
              
              if(!id){
                  return response.status(400).json({
                      message : "provide_id",
                      error:true,
                      success :false
                  })
              }

              const deleteCartItem = await CartProductModel.deleteOne({_id : id, userId: userId})
              
              
              if(!deleteCartItem){
                return response.status(404).json({
                    message : "The Product in the cart is not found",
                    error:true,
                    success :false,
               
                    
                })
            }
              
              
              return response.json({       
                message: "Cart deleted successfully",
                error: false,
                success: true,
                data: deleteCartItem
            })
            } catch (error) {
                return response.status(500).json({       
                    message: error.message || error,
                    error: true,
                    success: false
                })
            }
               
               
          
           }



   export async function emptyCartController(request,response) {

try {
    const userId = request.params.id

    await CartProductModel.deleteMany({userId:userId})

     return response.status(200).json({
                      error:true,
                      success :false
                  })
} catch (error) {
    return response.status(500).json({       
                    message: error.message || error,
                    error: true,
                    success: false
                })
}

   }