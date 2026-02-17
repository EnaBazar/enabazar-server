import express from 'express';
import { addReviews, authWithGoogle, deletemultipleUsers, DeleteUsers, forgotPasswordController, getAllReviews, getAllusers, getReviews, loginPanelUserController, loginUserController, logoutController, refreshToken, register, 
        registerPanel, 
        removeimageFromCloudinary, resetpassword, resetpasswordaccont, updateUserDeatils, userAvatarController, 
        userDeatils, 
        VerifyEmail, verifyForgotPasswordOtp, 
        verifyMobileOtp}
 from '../controllers/Auth.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const AuthRoutes=express.Router()



AuthRoutes.post('/register',register)
AuthRoutes.post('/registerPanel',registerPanel)
AuthRoutes.post("/verifyemail",VerifyEmail)
AuthRoutes.post("/login",loginUserController)
AuthRoutes.post("/loginPanel",loginPanelUserController)
AuthRoutes.post("/authWithGoogle",authWithGoogle)
AuthRoutes.get("/logout",auth,logoutController)
AuthRoutes.put('/user-avatar',auth,upload.array('avatar'),userAvatarController);
AuthRoutes.delete('/deleteImage',auth,removeimageFromCloudinary);
AuthRoutes.put('/:id',auth,updateUserDeatils);
AuthRoutes.post('/forgot-password',forgotPasswordController);
AuthRoutes.post('/verify-forgot-password-otp',verifyForgotPasswordOtp);
AuthRoutes.post('/reset-password',resetpassword);
AuthRoutes.post('/reset-password-account',resetpasswordaccont);
AuthRoutes.post('/refrash-token',refreshToken);
AuthRoutes.get('/user-dtails',auth,userDeatils);
AuthRoutes.post('/addReviews',auth,addReviews);
AuthRoutes.get('/getReviews',getReviews);
AuthRoutes.get('/getAllReviews',getAllReviews);
AuthRoutes.get('/getAllUser',getAllusers);
AuthRoutes.delete('/deleteMultiple',deletemultipleUsers);
AuthRoutes.delete('/deleteMultiple',deletemultipleUsers);
AuthRoutes.delete('/:id',DeleteUsers);
AuthRoutes.post("/verify-mobile-otp", verifyMobileOtp);


export default  AuthRoutes;


