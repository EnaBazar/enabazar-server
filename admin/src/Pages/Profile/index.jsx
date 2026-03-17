import React, { useContext, useEffect, useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { editData, fetchDataFromApi, deleteData, uploadImage } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Radio } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const Profile = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const bdMobileRegex = /^01[3-9]\d{8}$/;

  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ mobile: "" });

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
  });

  const [userId, setUserId] = useState("");

  /* ================= LOGIN CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (!token) navigate("/login");
  }, [context?.isLogin]);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);
      setFormFields({
        name: context.userData.name || "",
        mobile: context.userData.mobile || "",
      });
      fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then(
        (res) => {
          setAddress(res.data);
          context.setAddress(res.data);
        }
      );
      if (context?.userData?.avatar) setPreviews([context.userData.avatar]);
    }
  }, [context?.userData]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "").slice(0, 11);
      setFormFields((prev) => ({ ...prev, mobile: numericValue }));

      if (!bdMobileRegex.test(numericValue)) {
        setErrors({ mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন" });
      } else {
        setErrors({ mobile: "" });
      }
    } else {
      setFormFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= VALIDATION ================= */
  const isValid =
    formFields.name.trim().length >= 3 &&
    bdMobileRegex.test(formFields.mobile) &&
    !errors.mobile;

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);

    editData(`/auth/${userId}`, formFields, { withCredentials: true }).then(
      (res) => {
        setIsLoading(false);

        if (!res?.data?.error) {
          context.openAlertBox("success", res?.data?.message || "Profile Updated");

          // 🔥 OTP trigger if mobile changed
          const oldMobile = context?.userData?.mobile;
          const newMobile = formFields.mobile;
          if (oldMobile !== newMobile) {
            context.openUpdateOtpPanel({ mobile: newMobile });
          }
        } else {
          context.openAlertBox("error", res?.data?.message || "Update Failed");
        }
      }
    );
  };

  /* ================= DELETE ADDRESS ================= */
  const handleDeleteAddress = (id) => {
    deleteData(`/address/${id}`).then((res) => {
      if (!res?.error) {
        context.openAlertBox("success", "Address Deleted");
        fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then(
          (res) => {
            setAddress(res.data);
            context.setAddress(res.data);
          }
        );
      } else {
        context.openAlertBox("error", "Delete Failed");
      }
    });
  };

  /* ================= AVATAR UPLOAD ================= */
  const onChangeFile = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    formData.append("avatar", files[0]);
    setUploading(true);

    uploadImage("/auth/user-avatar", formData).then((res) => {
      setUploading(false);
      setPreviews([res?.data?.avtar]);
    });
  };

  /* ================= UI ================= */
  return (
    <div className="card my-5 pt-5 w-full max-w-4xl mx-auto shadow-md sm:rounded-lg bg-white px-5 pb-5">
      <h2 className="text-[20px] font-semibold mb-4">User Profile</h2>

      {/* Avatar */}
      <div className="relative w-[110px] h-[110px] rounded-full overflow-hidden mb-4 group bg-gray-200">
        {uploading ? (
          <CircularProgress />
        ) : previews?.length ? (
          <img src={previews[0]} className="w-full h-full object-cover" />
        ) : (
          <img src="/user.png" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer">
          <FaCloudDownloadAlt className="text-white text-[22px]" />
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onChangeFile}
          />
        </div>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          size="small"
          name="name"
          value={formFields.name}
          onChange={handleChange}
        />

        {/* Simple mobile input, no flag/dropdown */}
        <TextField
          label="Mobile Number"
          size="small"
          name="mobile"
          value={formFields.mobile}
          onChange={handleChange}
          placeholder="01XXXXXXXXX"
          error={!!errors.mobile}
          helperText={errors.mobile}
        />

        {/* Address */}
        <div
          className="border border-dashed p-3 rounded-md hover:bg-[#e7f3f9] cursor-pointer text-center font-medium w-[200px]"
          onClick={() => {
            context.setAddressMode("add");
            context.setAddressId(null);
            context.setIsOpenFullScreenPanel({ open: true, model: "AddNewAddress" });
          }}
        >
          Add Address
        </div>

        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {address?.map((addr) => (
            <div key={addr._id} className="border rounded-lg p-4 relative">
              <div className="absolute right-2 top-2 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    context.setAddressMode("edit");
                    context.setAddressId(addr._id);
                    context.setIsOpenFullScreenPanel({ open: true, model: "EditeAddress" });
                  }}
                >
                  <FiEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(addr._id);
                  }}
                >
                  <AiOutlineDelete />
                </button>
              </div>
              <div className="flex gap-2">
                <Radio
                  checked={selectedValue === addr._id}
                  value={addr._id}
                  onChange={(e) => setSelectedValue(e.target.value)}
                />
                <div>
                  <p>{addr.address_line}</p>
                  <p>{addr.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={!isValid || isLoading} className="btn-blue w-[200px]">
          {isLoading ? <CircularProgress size={20} /> : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;