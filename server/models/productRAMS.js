
import mongoose from 'mongoose';

const productRamsSchema = mongoose.Schema({ 
    name:{       
        type:String,
        required:true,
         },
 
 dateCreated:{       
 type:Date,
 default: Date.now,
 } 
           
},{timestamps:true}                                              
);
          
const productRamsmodel=mongoose.model("ProductRams",productRamsSchema)
export default productRamsmodel;
           