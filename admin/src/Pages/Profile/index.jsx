import React, { useContext, useEffect, useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import {
  editData,
  fetchDataFromApi,
  deleteData,
  uploadImage,
} from "../../utils/api";

import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Profile = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState([]);
  const [phone, setPhone] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
  });

  const [userId, setUserId] = useState("");

  /* ================= LOGIN CHECK ================= */

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token === null) {
      history("/login");
    }
  }, [context?.isLogin]);

  /* ================= LOAD USER DATA ================= */

  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);

      setFormFields({
        name: context?.userData?.name,
        mobile: context?.userData?.mobile,
      });

      setPhone(context?.userData?.mobile);

      fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then(
        (res) => {
          setAddress(res.data);
          context.setAddress(res.data);
        }
      );
    }
  }, [context?.userData]);

  /* ================= INPUT CHANGE ================= */

  const onchangeInput = (e) => {
    const { name, value } = e.target;

    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= UPDATE PROFILE ================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.name) {
      context.openAlertBox("error", "Please enter your name");
      return;
    }

    if (!formFields.mobile) {
      context.openAlertBox("error", "Please enter your mobile");
      return;
    }

    setIsLoading(true);

    editData(`/auth/${userId}`, formFields, { withCredentials: true }).then(
      (res) => {
        setIsLoading(false);

        if (!res?.error) {
          context.openAlertBox("success", "Profile Updated");
        } else {
          context.openAlertBox("error", res?.message);
        }
      }
    );
  };

  /* ================= SELECT DEFAULT ADDRESS ================= */

  const handleChange = (event) => {
    setSelectedValue(event.target.value);

    editData(`/address/selectAddress/${event.target.value}`, {
      selected: true,
    });
  };

  /* ================= DELETE ADDRESS ================= */

  const handleDeleteAddress = (id) => {
    deleteData(`/address/${id}`).then((res) => {
      if (!res?.error) {
        context.openAlertBox("success", "Address Deleted");

        fetchDataFromApi(
          `/address/get?userId=${context?.userData?._id}`
        ).then((res) => {
          setAddress(res.data);
          context.setAddress(res.data);
        });
      } else {
        context.openAlertBox("error", "Delete Failed");
      }
    });
  };

  /* ================= AVATAR ================= */

  useEffect(() => {
    if (context?.userData?.avatar) {
      setPreviews([context?.userData?.avatar]);
    }
  }, [context?.userData]);

  const onChangeFile = async (e) => {
    const formdata = new FormData();
    const files = e.target.files;

    if (!files.length) return;

    formdata.append("avatar", files[0]);

    setUploading(true);

    uploadImage("/auth/user-avatar", formdata).then((res) => {
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

      {/* Profile Form */}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

        <TextField
          label="Full Name"
          size="small"
          name="name"
          value={formFields.name}
          onChange={onchangeInput}
        />

        <PhoneInput
          defaultCountry="bd"
          value={phone}
          onChange={(phone) => {
            setPhone(phone);
            setFormFields((prev) => ({ ...prev, mobile: phone }));
          }}
        />

        {/* Add Address */}

        <div
          className="border border-dashed p-3 rounded-md hover:bg-[#e7f3f9] cursor-pointer text-center font-medium w-[200px]"
          onClick={() => {
            context.setAddressMode("add");
            context.setAddressId(null);

            context.setIsOpenFullScreenPanel({
              open: true,
              model: "AddNewAddress",
            });
          }}
        >
          Add Address
        </div>

        {/* Address List */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          {address?.map((addr) => (

            <div
              key={addr._id}
              className="border rounded-lg p-4 relative bg-white shadow-sm hover:shadow-md"
            >

              {addr.selected && (
                <span className="absolute top-2 left-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  Default
                </span>
              )}

              <div className="absolute right-2 top-2 flex gap-3">

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    context.setAddressMode("edit");
                    context.setAddressId(addr._id);

                    context.setIsOpenFullScreenPanel({
                      open: true,
                      model: "EditeAddress",
                    });
                  }}
                >
                  <FiEdit size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(addr._id);
                  }}
                >
                  <AiOutlineDelete size={18} />
                </button>

              </div>

              <div className="flex gap-2">

                <Radio
                  {...label}
                  checked={selectedValue === addr._id}
                  value={addr._id}
                  onChange={handleChange}
                />

                <div>

                  <h3 className="font-semibold text-sm">
                    {addr.addressType || "Address"}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {addr.address_line}
                  </p>

                  <p className="text-sm text-gray-600">
                    {addr.upazila}, {addr.city}
                  </p>

                  <p className="text-xs text-gray-500">
                    {addr.landmark}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="btn-blue w-[200px]"
        >
          {isLoading ? <CircularProgress size={20} /> : "Update Profile"}
        </Button>

      </form>
    </div>
  );
};

export default Profile;