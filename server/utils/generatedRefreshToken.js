import jwt from 'jsonwebtoken'
import usermodel from "../models/User.js"


const generatedRefreshToken = async(userId)=>{
    
    const token = await jwt.sign({id : userId},
       process.env.SECRET_KEY_REFRESH_TOKEN,
       {expiresIn : '7h'}                          
                                 
                                 )
    
    
    const updateRefreshTokenUser = await usermodel.updateOne(
        
        {_id : userId},
       {refresh_token : token} 
    )
    
    return token 
}
export default generatedRefreshToken;