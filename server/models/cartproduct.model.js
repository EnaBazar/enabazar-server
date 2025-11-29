import mongoose  from "mongoose";


const cartProductScema = mongoose.Schema({
    
    productTitle:{
        type: String,
       required: true
    },
       image:{
        type: String,
       required: true
    },
          rating:{
        type: Number,
       required: true
    },
             price:{
        type: Number,
    
    },
   oldprice:{
  type: Number,
    },
    discount:{
    type: Number,
    },
   size:{
   type: String,

    },
  weight:{
 type: String,

    },
  Ram:{
  type: String,

    },
    quantity:{
        type:Number,
         required: true
    },
      subTotal:{
        type:Number,
       required: true
    },
        productId:{
        type: String,
        required: true
    },
          countInStock:{
        type:Number,
        required: true
    },
          
   userId:{
             type: String,
        required: true
    },
     brand:{
             type: String,
 
    }
},{timestamps : true
   
   })

const CartProductModel = mongoose.model('cartProduct',cartProductScema)

 export default CartProductModel;