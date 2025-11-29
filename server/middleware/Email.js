import { Verification_Email_Template, Welcome_Email_Template } from "../libs/EmailTemplate.js";
import { transporter } from "./Email.config.js"



 export const SendVerficationCode=async(email,verficationCode)=>{
    
    try{
         const response = await transporter.sendMail({
                    
                    
                    from: '"Fenix.com" <ikhali7446@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Verify Your Email", // Subject line
                    text: "Hello world?", // plain text body
                    html: Verification_Email_Template.replace("{verificationCode}",verficationCode), // html body   
                    
                });
         
        console.log('Email send Successfully',response)
    }catch(error){
        
        console.log('Email error')
        
        
    }
}
 
 
 export const WelcomeEmail=async(email,name)=>{
     
     try{
         
         const response = await transporter.sendMail({
             
            from: '"Fenix.com" <ikhali7446@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email", // Subject line
            text: "Hello world?", // plain text body
            html: Welcome_Email_Template.replace("{name}",name), // html body   
            
        });
 
console.log('Email send Successfully',response)
}catch(error){
console.log('Email error')
}}
 


 