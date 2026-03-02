import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { Collapse } from 'react-collapse';
import PhoneInput from 'react-international-phone';
import 'react-international-phone/style.css';
import OtpModal from '../../Components/OtpModal'; // OTP modal component

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [phone, setPhone] = useState('');
  const [isChangePasswordFormShow, setIsChangePasswordFormShow] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    mobile: '',
  });
  const [changePassword, setChangePassword] = useState({
    oldpassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [otpPanelOpen, setOtpPanelOpen] = useState(false);
  const [otpData, setOtpData] = useState(null); // { type, userId, mobile }

  const context = useContext(MyContext);
  const history = useNavigate();

  const bdMobileRegex = /^01[3-9]\d{8}$/;

  // Check login
  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (!token) history('/');
  }, [context?.isLogin]);

  // Load user data
  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);
      setFormFields({
        name: context.userData.name,
        mobile: context.userData.mobile || '',
      });
      setPhone(context.userData.mobile || '');
      setChangePassword({
        oldpassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [context?.userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formFields.name.trim()) {
      context.openAlertBox('error', 'নাম দিন');
      setIsLoading(false);
      return;
    }
    if (!bdMobileRegex.test(formFields.mobile)) {
      context.openAlertBox('error', 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন');
      setIsLoading(false);
      return;
    }

    // Mobile changed → OTP required
    if (formFields.mobile !== context.userData.mobile) {
      postData(`/auth/update-user-details`, formFields)
        .then((res) => {
          setIsLoading(false);
          if (res?.otpRequired) {
            // Open OTP modal
            setOtpData({
              type: 'updateMobile',
              userId: context.userData._id,
              mobile: formFields.mobile,
            });
            setOtpPanelOpen(true);
          } else if (!res.error) {
            context.openAlertBox('success', res.message);
          } else {
            context.openAlertBox('error', res.message);
          }
        })
        .catch(() => setIsLoading(false));
      return;
    }

    // Name/password update without mobile change
    editData(`/auth/${userId}`, formFields, { withCredentials: true })
      .then((res) => {
        setIsLoading(false);
        if (!res.error) {
          context.openAlertBox('success', res.message);
        } else {
          context.openAlertBox('error', res.message);
        }
      })
      .catch(() => setIsLoading(false));
  };

  // OTP verification callback
  const handleOtpVerified = (verifiedUser) => {
    // Update context
    context.updateUserData(verifiedUser);
    context.openAlertBox('success', 'Mobile updated successfully');
    setOtpPanelOpen(false);
  };

  const valideValue = formFields.name && formFields.mobile;

  return (
    <section className="py-10 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row gap-5 px-4">
        {/* Sidebar */}
        <div className="col1 w-full lg:w-1/4">
          <context.AccountSidebar />
        </div>

        {/* Main Content */}
        <div className="col2 w-full lg:w-3/4 flex flex-col gap-5">
          {/* Profile Card */}
          <div className="card bg-white p-5 shadow-md rounded-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
              <h2 className="text-[14px] font-medium">My Profile</h2>
              <Button
                className="!text-[14px]"
                onClick={() => setIsChangePasswordFormShow(!isChangePasswordFormShow)}
              >
                Change Password
              </Button>
            </div>
            <hr className="text-[rgba(0,0,0,0.2)]" />

            {/* Profile Form */}
            <form className="!mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <TextField
                  label="Full Name"
                  variant="outlined"
                  size="small"
                  className="w-[40%]"
                  name="name"
                  value={formFields.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <PhoneInput
                defaultCountry="BD"
                value={phone}
                className="!w-[40%]"
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields((prev) => ({ ...prev, mobile: phone }));
                }}
                disabled={isLoading}
              />

              <div className="flex justify-start mt-4">
                <Button
                  type="submit"
                  disabled={!valideValue || isLoading}
                  className="btn-org btn-lg w-full sm:w-[210px] flex gap-3 justify-center"
                >
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Collapse */}
          <Collapse isOpened={isChangePasswordFormShow}>
            <div className="card bg-white p-5 shadow-md rounded-md">
              <div className="flex items-center pb-3">
                <h2 className="text-[14px] font-medium">Change Password</h2>
              </div>
              <hr className="text-[rgba(0,0,0,0.2)]" />
              {/* Change password form here */}
            </div>
          </Collapse>
        </div>
      </div>

      {/* OTP Modal */}
      {otpPanelOpen && (
        <OtpModal
          mobile={otpData.mobile}
          userId={otpData.userId}
          type={otpData.type}
          onVerified={handleOtpVerified}
          onClose={() => setOtpPanelOpen(false)}
        />
      )}
    </section>
  );
};

export default MyAccount;