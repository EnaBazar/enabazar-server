import mongoose from 'mongoose' ;


const userSchema=new mongoose.Schema({

email: {
  type: String,
  default: null,
  sparse: true   // null allowed multiple times
},

   name:{
    type:String,
    require:true,
   
},
password:{
    type:String,
   required:true,
   
},  
avatar:{
        
  type: String,
   default :""
   
},
mobile:{
    type: Number,
   default :null,
   require:true,
},

verify_email:{
    
    type:Boolean,
    default : false
},
access_token:{
    
    type:String,
    default : ''
},
refresh_token:{
    
   type:String,
    default : ''
},
last_login_date:{
    
    type: Date,
    default: Date.now
},
status:{
    
    type:String,
    enum : ["Active","Inactive","Suspended"],
 default : "Active"
},

address_details:[{
    
    type : mongoose.Schema.ObjectId,
    ref : "address"
}],

orderHistory:[{
    
    type : mongoose.Schema.ObjectId,
     ref : "order"
 }],
 shopping_cart:[{
    
    type : mongoose.Schema.ObjectId,
     ref : "cartProduct"
 }],
 otp:{
    
    type : String

 },
  role:{
    
    type : String,
    enum : ['ADMIN','USER'],
    default : "USER"
 },
  
  signUpWithGoogle:{
     type:Boolean,
     default:false 
  },
  
 otpExpires:{
    
    type : Date
 
 },


verificationCode:String
},{timestamps:true})

const usermodel=mongoose.model("user",userSchema)
 export default usermodel;
 