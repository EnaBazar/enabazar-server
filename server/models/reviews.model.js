import mongoose from 'mongoose';


const ReviewsSchema = mongoose.Schema({
     
     
      image:[{
        type:String,
    }],
    userName:{
        
        type:String,
       default: ''
    },  
       review:{
        type:String,
         default: ''
    },    
      rating:{
        type:String, 
         default: ''
    },
      userId:{
        type:String,
         default: ''
    },
      productId:{
        type:String,
         default: ''
    },
      
},{timestamps:true});

const Reviewsmodel=mongoose.model("Reviews",ReviewsSchema)
 export default Reviewsmodel;
 