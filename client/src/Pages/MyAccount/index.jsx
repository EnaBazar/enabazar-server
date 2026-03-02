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

    console.log("Response:", res);

    if (res?.data?.error === false) {

      context.openAlertBox("success", res?.data?.message);

      // ✅ Correct check
      if (res?.data?.isMobileChange === true) {
        context?.openUpdateOtpPanel({
          mobile: formFields.mobile
        });
      }

    } else {
      context.openAlertBox("error", res?.data?.message);
    }

    setIsLoading(false);
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

            <div className="flex justify-between ">
              <h2 className="text-[14px] font-medium ">My Profile</h2>
             
            </div>
<hr/><hr/>
           

            <form className="!mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>

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
                  : "Update"}
              </Button>

            </form>
          </div>

   

        </div>
      </div>
    </section>
  );
};

export default MyAccount;