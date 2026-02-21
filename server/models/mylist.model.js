import mongoose  from "mongoose";


const myListScema = mongoose.Schema({
    
    productId:{
        type:String,
       required:true
    },

   userId:{
        type:String,
        required:true
    },
    productTitle:{
        type:String,
       required:true
    },

   image:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
       required:true
    },

   price:{
        type:Number,
        required:true
    },
   
    oldPrice:{
        type:Number,
        required:true
    },
    
   discount:{
    type:Number,
    required:true
},
    brand:{
        type:String,
        required:true
    }
   
},{timestamps : true
   
   })

const MylistModel = mongoose.model('mylist',myListScema)

 export default MylistModel;