import mongoose from 'mongoose';


const BlogSchema = mongoose.Schema({
     
     
      images:[{
        type:String,
    }],
    blogtitle:{
        
        type:String,
        required:true,
    },
  
    description:{
        type:String,
    },
      dateCreated:{       
    type:Date,
    default: Date.now,
                   }, 
      
},{timestamps:true});

const Blogymodel=mongoose.model("Blog",BlogSchema)
 export default Blogymodel;
 