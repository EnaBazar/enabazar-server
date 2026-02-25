import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaCloudDownloadAlt, FaRegUser } from "react-icons/fa";
import { IoBagCheckOutline, IoMdHeartEmpty, IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchDataFromApi, uploadImage } from "../../utils/api";
import { LuMapPinCheck } from "react-icons/lu";

const AccountSidebar = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  // 🔥 Logout
  const logout = () => {
    fetchDataFromApi(`/auth/logout`, { withCredentials: true }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        context?.setCartData([]);
        navigate("/");
      }
    });
  };

  // 🔥 Load avatar from context
  useEffect(() => {
    if (context?.userData?.avatar) {
      setPreviews([context.userData.avatar]);
    }
  }, [context?.userData]);

  // 🔥 Upload Avatar
  const onChangeFile = async (e) => {
    try {
      const files = e.target.files;

      if (!files || files.length === 0) return;

      const file = files[0];

      // Validate Image Type
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png" &&
        file.type !== "image/webp"
      ) {
        context.openAlertBox(
          "error",
          "Please select a valid JPG, PNG or WEBP image"
        );
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      setUploading(true);

      const res = await uploadImage("/auth/user-avatar", formData);

      setUploading(false);

      if (res?.success === true) {
        const newAvatar = res?.avatar || res?.data?.avatar;

        // 🔥 Update preview instantly
        setPreviews([newAvatar]);

        // 🔥 Update context so whole app updates
        context.setUserData((prev) => ({
          ...prev,
          avatar: newAvatar,
        }));

        context.openAlertBox("success", "Profile image updated");
      }
    } catch (error) {
      console.log(error);
      setUploading(false);
      context.openAlertBox("error", "Image upload failed");
    }
  };

  return (
    <div className="card bg-white shadow-md rounded-md sticky top-[170px]">
      <div className="w-full p-5 flex items-center justify-center flex-col">
        <div className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group flex items-center justify-center bg-gray-200">
          {uploading ? (
            <CircularProgress color="inherit" />
          ) : previews.length !== 0 ? (
            <img
              src={previews[0]}
              className="w-full h-full object-cover"
              alt="avatar"
            />
          ) : (
            <img
              src="/user.png"
              className="w-full h-full object-cover"
              alt="default"
            />
          )}

          <div
            className="overlay w-full h-full absolute top-0 left-0 z-50 
            bg-[rgba(0,0,0,0.4)] flex items-center justify-center 
            cursor-pointer opacity-0 transition-all group-hover:opacity-100"
          >
            <FaCloudDownloadAlt className="text-white text-[22px]" />

            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={onChangeFile}
            />
          </div>
        </div>

        <h3>{context?.userData?.name}</h3>
        <h6 className="text-[12px] font-[500]">
          {context?.userData?.email}
        </h6>
      </div>

      <ul className="list-none pb-5 bg-[#f1f1f1] myAccountTabs">
        <li>
          <NavLink to="/my-account">
            <Button className="flex w-full rounded-none text-left py-2 px-5 justify-start capitalize items-center gap-2">
              <FaRegUser />
              User Profile
            </Button>
          </NavLink>
        </li>

        <li>
          <NavLink to="/address">
            <Button className="flex w-full rounded-none text-left py-2 px-5 justify-start capitalize items-center gap-2">
              <LuMapPinCheck />
              Address
            </Button>
          </NavLink>
        </li>

        <li>
          <NavLink to="/my-list">
            <Button className="flex w-full py-2 rounded-none text-left px-5 justify-start capitalize items-center gap-2">
              <IoMdHeartEmpty />
              My List
            </Button>
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders">
            <Button className="flex w-full rounded-none text-left px-5 justify-start capitalize items-center gap-2">
              <IoBagCheckOutline />
              My Orders
            </Button>
          </NavLink>
        </li>

        <li>
          <Button
            onClick={logout}
            className="flex w-full rounded-none text-left px-5 justify-start capitalize items-center gap-2 text-red-500"
          >
            <IoIosLogOut />
            Logout
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default AccountSidebar;