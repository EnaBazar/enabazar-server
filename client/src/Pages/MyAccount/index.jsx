import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../Components/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css'

const MyAccount = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [phone, setPhone] = useState('');
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: ""
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  // 🔐 Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      history("/");
    }
  }, [context?.isLogin]);

  // 🧑‍💼 Load user data
  useEffect(() => {

    if (context?.userData?._id) {

      setUserId(context?.userData?._id);

      setFormFields({
        name: context?.userData?.name || "",
        mobile: context?.userData?.mobile || ""
      });

      setPhone(context?.userData?.mobile || "");
    }

  }, [context?.userData]);

  // ✏ Input Change
  const onchangeInput = (e) => {
    const { name, value } = e.target;

    setFormFields((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Submit Profile Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.name) {
      context.openAlertBox("error", "Full Name লাগবে");
      return;
    }

    if (!formFields.mobile) {
      context.openAlertBox("error", "Mobile লাগবে");
      return;
    }

    setIsLoading(true);

    editData(`/auth/${userId}`, formFields)
      .then((res) => {

        if (res?.otpSent) {
          // 📩 Mobile change → OTP Sent
          setShowOtpBox(true);
          context.openAlertBox("success", res?.message);
        } else {
          context.openAlertBox("success", res?.message);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // 🔢 Verify OTP
  const handleVerifyOtp = () => {

    if (!otp) {
      context.openAlertBox("error", "OTP দিন");
      return;
    }

    setIsLoading(true);

    postData(`/auth/verify-update-mobile`, { otp })
      .then((res) => {

        context.openAlertBox("success", res?.message);

        setShowOtpBox(false);
        setOtp("");

        // 🔄 reload user data if needed
        window.location.reload();

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const validValue = Object.values(formFields).every(el => el);

  return (

    <section className="py-10 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row gap-5 px-4">

        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <AccountSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">

          <div className="bg-white p-5 shadow-md rounded-md">

            <h2 className="text-[14px] font-medium pb-3">
              My Profile
            </h2>

            <hr />

            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>

              <TextField
                label="Full Name"
                size="small"
                name="name"
                value={formFields.name}
                disabled={isLoading}
                onChange={onchangeInput}
                className="w-[40%]"
              />

              <PhoneInput
                defaultCountry="BD"
                value={phone}
                disabled={isLoading}
                className="w-[40%]"
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields(prev => ({ ...prev, mobile: phone }));
                }}
              />

              <Button
                type="submit"
                disabled={!validValue || isLoading}
                className="btn-org w-[210px] flex gap-2 justify-center"
              >
                {isLoading ?
                  <CircularProgress color="inherit" size={20} />
                  :
                  "Update Profile"
                }
              </Button>

            </form>

            {/* 🔢 OTP BOX */}
            {showOtpBox && (
              <div className="mt-6 w-[40%] flex flex-col gap-3">

                <TextField
                  label="Enter OTP"
                  size="small"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <Button
                  onClick={handleVerifyOtp}
                  className="btn-org"
                  disabled={isLoading}
                >
                  Verify OTP
                </Button>

              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  )
}

export default MyAccount;