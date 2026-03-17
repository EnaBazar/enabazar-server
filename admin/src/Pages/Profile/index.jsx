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

  /* ================= LOAD USER + ADDRESS ================= */
  const loadAddress = () => {
    fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then(
      (res) => {
        setAddress(res.data);
        context.setAddress(res.data);
      }
    );
  };

  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);

      setFormFields({
        name: context.userData.name || "",
        mobile: context.userData.mobile || "",
      });

      // ✅ Avatar fallback
      if (context?.userData?.avatar && context.userData.avatar.length > 0) {
        setPreviews([context.userData.avatar]);
      } else {
        setPreviews([]); // fallback handled in UI
      }

      loadAddress();
    }
  }, [context?.userData]);

  // ✅ address auto refresh after add/edit panel close
  useEffect(() => {
    if (!context?.isOpenFullScreenPanel?.open) {
      loadAddress();
    }
  }, [context?.isOpenFullScreenPanel?.open]);

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
        loadAddress(); // ✅ instant refresh
      }
    });
  };

  /* ================= AVATAR UPLOAD ================= */
  const onChangeFile = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const file = files[0];

    // ✅ instant preview (before upload)
    const localPreview = URL.createObjectURL(file);
    setPreviews([localPreview]);

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);

    uploadImage("/auth/user-avatar", formData).then((res) => {
      setUploading(false);

      if (res?.data?.avtar) {
        setPreviews([res.data.avtar]); // server image

        // context update
        context.setUserData((prev) => ({
          ...prev,
          avatar: res.data.avtar,
        }));
      }
    });
  };

  /* ================= UI ================= */
  return (
    <div className="card my-5 pt-5 w-full max-w-4xl mx-auto shadow-md bg-white px-5 pb-5">

      <h2 className="text-[20px] font-semibold mb-4">User Profile</h2>

      {/* Avatar */}
      <div className="relative w-[110px] h-[110px] rounded-full overflow-hidden mb-4 group bg-gray-200">

        {uploading ? (
          <CircularProgress />
        ) : (
          <img
            src={previews?.length ? previews[0] : "/user.png"} // ✅ fallback
            className="w-full h-full object-cover"
          />
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

        {/* Add Address */}
        <div
          className="border border-dashed p-3 rounded-md cursor-pointer text-center w-[200px]"
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
           
                <div>
                  {/* Address Type */}
  <span className="inline-block !pl-2 pr-2 bg-sky-600 text-[13px] sm:text-[15px] text-white font-[500] rounded-sm">
    {addr.addressType}
  </span>

  {/* Name & Mobile */}
  <h4 className="pt-2 text-[13px] sm:text-[15px] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
    <span>{context?.userData?.name}</span>
    <span>{context?.userData?.mobile}</span>
  </h4>

  {/* Full Address */}
  <span className="pt-1 text-[12px] sm:text-[14px] block w-full sm:w-[90%] break-words">
    {addr.address_line}, {addr.upazila}, {addr.city},
  </span>
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