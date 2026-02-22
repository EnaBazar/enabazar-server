import express from 'express';
import { 
    addReviews,
    authWithGoogle,
    deletemultipleUsers,
    DeleteUsers,
    forgotPasswordController,
    getAllReviews,
    getAllusers,
    getReviews,
    loginPanelUserController,
    loginUserController,
    logoutController,
    refreshToken,
    register,
    registerPanel,
    removeimageFromCloudinary,
    resetpassword,
    resetpasswordaccont,
    updateUserDeatils,
    userAvatarController,
    userDeatils,
    VerifyEmail,
    verifyForgotPasswordOtp,
    verifyMobileOtp
} from '../controllers/Auth.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import twilio from 'twilio';

const AuthRoutes = express.Router();

// ================== Twilio setup ==================
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStore = {}; // In-memory OTP store: { mobile: otp }

// ================== OTP Registration ==================
AuthRoutes.post('/register', async (req, res) => {
    const { name, mobile, password } = req.body;

    if (!name || !mobile || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[mobile] = otp;

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobile
        });

        // Optionally call existing register logic
        await register(req, res); // Original registration controller

        res.json({ success: true, message: "OTP sent to your mobile" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

// ================== OTP Verification ==================
AuthRoutes.post("/verify-otp", (req, res) => {
    const { mobile, otp } = req.body;

    if (otpStore[mobile] && otpStore[mobile].toString() === otp.toString()) {
        delete otpStore[mobile]; // OTP verified
        return res.json({ success: true, message: "Mobile verified successfully" });
    } else {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
});

// ================== Existing Routes ==================
AuthRoutes.post('/registerPanel', registerPanel);
AuthRoutes.post("/verifyemail", VerifyEmail);
AuthRoutes.post("/login", loginUserController);
AuthRoutes.post("/loginPanel", loginPanelUserController);
AuthRoutes.post("/authWithGoogle", authWithGoogle);
AuthRoutes.get("/logout", auth, logoutController);
AuthRoutes.put('/user-avatar', auth, upload.array('avatar'), userAvatarController);
AuthRoutes.delete('/deleteImage', auth, removeimageFromCloudinary);
AuthRoutes.put('/:id', auth, updateUserDeatils);
AuthRoutes.post('/forgot-password', forgotPasswordController);
AuthRoutes.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
AuthRoutes.post('/reset-password', resetpassword);
AuthRoutes.post('/reset-password-account', resetpasswordaccont);
AuthRoutes.post('/refrash-token', refreshToken);
AuthRoutes.get('/user-dtails', auth, userDeatils);
AuthRoutes.post('/addReviews', auth, addReviews);
AuthRoutes.get('/getReviews', getReviews);
AuthRoutes.get('/getAllReviews', getAllReviews);
AuthRoutes.get('/getAllUser', getAllusers);
AuthRoutes.delete('/deleteMultiple', deletemultipleUsers);
AuthRoutes.delete('/:id', DeleteUsers);

export default AuthRoutes;