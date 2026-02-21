
import mongoose from 'mongoose';

const productSizesSchema = mongoose.Schema({ 
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
          
const productSizesmodel=mongoose.model("ProductSize",productSizesSchema)
export default productSizesmodel;
           