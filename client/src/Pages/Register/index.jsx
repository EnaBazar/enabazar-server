import React, { useState, useContext } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';

const Register = () => {
    const [formFields, setFormFields] = useState({ name: "", mobile: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formFields.name || !formFields.mobile || !formFields.password) {
            context.openAlertBox("error", "সব তথ্য পূরণ করুন!");
            setIsLoading(false);
            return;
        }

        const res = await postData("/auth/register", formFields);

        if (!res?.error) {
            context.openAlertBox("success", res.message);

            // OTP verify page এ পাঠানো
            navigate("/verify-otp", { state: { mobile: formFields.mobile, redirectPath: "/" } });

        } else {
            context.openAlertBox("error", res.message);
        }
        setIsLoading(false);
    };

    return (
        <div className='container mx-auto py-10'>
            <div className='card p-5 w-[400px] mx-auto rounded-md shadow-md bg-white'>
                <h3 className='text-center mb-5'>রেজিস্ট্রেশন করুন</h3>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="আপনার নাম"
                        name="name"
                        value={formFields.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        className='mb-4'
                    />
                    <TextField
                        fullWidth
                        label="মোবাইল নাম্বার"
                        name="mobile"
                        value={formFields.mobile}
                        onChange={handleChange}
                        disabled={isLoading}
                        className='mb-4'
                    />
                    <div className='relative mb-4'>
                        <TextField
                            fullWidth
                            label="পাসওয়ার্ড"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formFields.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <Button
                            className='absolute top-2 right-2'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        className='mb-3'
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Register"}
                    </Button>
                </form>
                <p className='text-center text-sm mt-2'>
                    Already have an account? <Link to="/login" className='text-red-500 font-semibold'>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;