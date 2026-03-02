import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../Components/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { Collapse } from 'react-collapse';

const MyAccount = () => {

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const bdMobileRegex = /^01[3-9]\d{8}$/;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState();

  const [errors, setErrors] = useState({
    mobile: ""
  });

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: ""
  });

  const [changePassword, setChangePassword] = useState({
    oldpassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [ischangePasswordFormShow, setIsChangePasswordFormShow] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      navigate("/");
    }
  }, [context?.isLogin]);

  // Load user data
  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);
      setFormFields({
        name: context.userData.name || "",
        mobile: context.userData.mobile || ""
      });
    }
  }, [context?.userData]);

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length <= 11) {
        setFormFields(prev => ({
          ...prev,
          mobile: numericValue
        }));

        if (!bdMobileRegex.test(numericValue)) {
          setErrors({
            mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন"
          });
        } else {
          setErrors({
            mobile: ""
          });
        }
      }
    } else {
      setFormFields(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const valideValue =
    formFields.name.trim().length >= 3 &&
    bdMobileRegex.test(formFields.mobile) &&
    !errors.mobile;

  // Profile Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!valideValue) return;

    setIsLoading(true);

    editData(`/auth/${userId}`, formFields, { withCredentials: true })
      .then((res) => {

        if (res?.error !== true) {

          setIsLoading(false);

          context.openAlertBox("success", res?.message);

          // 🔥 যদি mobile change হয় → OTP panel open
          if (res?.isMobileChange === true) {
            context?.openOtpPanel({
              mobile: formFields.mobile
            });
          }

        } else {
          context.openAlertBox("error", res?.message);
          setIsLoading(false);
        }
      });
  };

  // Change Password
  const handleSubmitchangepassword = (e) => {
    e.preventDefault();

    if (!changePassword.oldpassword ||
        !changePassword.newPassword ||
        !changePassword.confirmPassword) {
      context.openAlertBox("error", "All fields required");
      return;
    }

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      context.openAlertBox("error", "Passwords do not match");
      return;
    }

    setIsLoading2(true);

    postData(`/auth/reset-password-account`, changePassword, { withCredentials: true })
      .then((res) => {

        if (res?.error !== true) {
          context.openAlertBox("success", res?.message);
        } else {
          context.openAlertBox("error", res?.message);
        }

        setIsLoading2(false);
      });
  };

  return (
    <section className="py-10 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row gap-5 px-4">

        <div className="w-full lg:w-1/4">
          <AccountSidebar />
        </div>

        <div className="w-full lg:w-3/4 flex flex-col gap-5">

          {/* Profile */}
          <div className="bg-white p-5 shadow-md rounded-md">

            <div className="flex justify-between pb-3">
              <h2 className="text-[14px] font-medium">My Profile</h2>
              <Button onClick={() => setIsChangePasswordFormShow(!ischangePasswordFormShow)}>
                Change Password
              </Button>
            </div>

            <hr />

            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>

              <TextField
                label="Full Name"
                size="small"
                name="name"
                value={formFields.name}
                disabled={isLoading}
                onChange={handleChange}
              />

              <TextField
                label="Mobile Number"
                size="small"
                name="mobile"
                value={formFields.mobile}
                disabled={isLoading}
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
              />

              <Button
                type="submit"
                disabled={!valideValue || isLoading}
                className="btn-org"
              >
                {isLoading
                  ? <CircularProgress size={20} color="inherit" />
                  : "Update Profile"}
              </Button>

            </form>
          </div>

          {/* Change Password */}
          <Collapse isOpened={ischangePasswordFormShow}>
            <div className="bg-white p-5 shadow-md rounded-md">

              <h2 className="text-[14px] font-medium pb-3">Change Password</h2>
              <hr />

              <form className="mt-5 flex flex-col gap-4"
                onSubmit={handleSubmitchangepassword}>

                <TextField
                  type="password"
                  label="Old Password"
                  size="small"
                  name="oldpassword"
                  value={changePassword.oldpassword}
                  onChange={(e) =>
                    setChangePassword(prev => ({
                      ...prev,
                      oldpassword: e.target.value
                    }))
                  }
                />

                <TextField
                  type="password"
                  label="New Password"
                  size="small"
                  name="newPassword"
                  value={changePassword.newPassword}
                  onChange={(e) =>
                    setChangePassword(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))
                  }
                />

                <TextField
                  type="password"
                  label="Confirm Password"
                  size="small"
                  name="confirmPassword"
                  value={changePassword.confirmPassword}
                  onChange={(e) =>
                    setChangePassword(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))
                  }
                />

                <Button type="submit" disabled={isLoading2}>
                  {isLoading2
                    ? <CircularProgress size={20} color="inherit" />
                    : "Change Password"}
                </Button>

              </form>

            </div>
          </Collapse>

        </div>
      </div>
    </section>
  );
};

export default MyAccount;