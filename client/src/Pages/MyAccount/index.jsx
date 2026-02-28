import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountSidebar from "../../Components/AccountSidebar";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { editData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import VerifyOtpPanel from "./VerifyOtpPanel";

const MyAccount = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [formFields, setFormFields] = useState({ name: "", mobile: "" });
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (!token) history("/");
  }, [context?.isLogin]);

  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);
      setFormFields({
        name: context.userData.name || "",
        mobile: context.userData.mobile || "",
      });
      setPhone(context.userData.mobile || "");
    }
  }, [context?.userData]);

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const validValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.name) return context.openAlertBox("error", "Full Name লাগবে");
    if (!formFields.mobile) return context.openAlertBox("error", "Mobile লাগবে");

    setIsLoading(true);

    editData(`/auth/${userId}`, formFields)
      .then((res) => {
        setIsLoading(false);
        if (res?.otpSent) {
          // OTP panel open
          context.openOtpPanel(formFields.mobile);
          context.openAlertBox("success", res.message);
        } else {
          context.openAlertBox("success", res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        context.openAlertBox("error", err?.message || "Server error");
      });
  };

  return (
    <section className="py-10 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row gap-5 px-4">
        <div className="w-full lg:w-1/4">
          <AccountSidebar />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="bg-white p-5 shadow-md rounded-md">
            <h2 className="text-[14px] font-medium pb-3">My Profile</h2>
            <hr />
            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                size="small"
                name="name"
                value={formFields.name}
                onChange={onchangeInput}
                disabled={isLoading}
                className="w-[40%]"
              />
              <PhoneInput
                defaultCountry="BD"
                value={phone}
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields((prev) => ({ ...prev, mobile: phone }));
                }}
                disabled={isLoading}
                className="w-[40%]"
              />
              <Button
                type="submit"
                disabled={!validValue || isLoading}
                className="btn-org w-[210px] flex gap-2 justify-center"
              >
                {isLoading ? <CircularProgress size={20} /> : "Update Profile"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Panel */}
      {context.openVerifyOtpPanel && <VerifyOtpPanel />}
    </section>
  );
};

export default MyAccount;