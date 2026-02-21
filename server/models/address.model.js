import mongoose from 'mongoose'

const addressSchema = mongoose.Schema({
    
    address_line :{
        
        type : String,
        default : ""
    },
        city :{
        
        type : String,
        default : ""
    },
            state :{
        
        type : String,
        default : ""
    },

       addressType :{
        type : String,   
        enum: ["Home","Work"],   
    },
         deliverylocation:{
        type : String,   
        enum: ["70","100","130"],   
    },
    
    landmark :{    
        type : String,
    },
       status :{   
        type : Boolean,
        default : true
    },
         selected :{  
        type : Boolean,
        default : true
    },
         userId :{
        
        type : mongoose.Schema.ObjectId,
        default : ""
    }
},{timestams : true
   
   })
const AddressModel = mongoose.model('address',addressSchema)
export default AddressModel