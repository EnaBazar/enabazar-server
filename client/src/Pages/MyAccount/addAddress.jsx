import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { fetchDataFromApi, postData, editData } from "../../utils/api";

const AddAddress = () => {
  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    userId: context?.userData?._id || "",
    addressType: "",
    deliverylocation: "",
    landmark: "",
  });

  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAddressType = (e) => {
    setFormFields((prev) => ({ ...prev, addressType: e.target.value }));
  };

  const handleChangeDeliveryLocation = (e) => {
    setFormFields((prev) => ({ ...prev, deliverylocation: e.target.value }));
  };

  const validateForm = () => {
    const {
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      landmark,
      addressType,
      deliverylocation,
    } = formFields;

    if (!address_line) return "Please enter your Address Line";
    if (!city) return "Please enter your City";
    if (!state) return "Please enter your State";
    if (!pincode) return "Please enter your Pincode";
    if (!country) return "Please enter your Country";
    if (!mobile) return "Please enter your Mobile Number";
    if (!landmark) return "Please enter your Landmark";
    if (!addressType) return "Please select Address Type";
    if (!deliverylocation) return "Please select Delivery Location";

    return null;
  };

  useEffect(() => {
    if (context?.addressMode === "edit" && context?.addressId) {
      fetchDataFromApi(`/address/selectAddress/${context.addressId}`).then(
        (res) => {
          const addr = res?.address || {};
          setFormFields({
            address_line: addr.address_line || "",
            city: addr.city || "",
            state: addr.state || "",
            pincode: addr.pincode || "",
            country: addr.country || "",
            mobile: addr.mobile || "",
            userId: addr.userId || "",
            addressType: addr.addressType || "",
            deliverylocation: addr.deliverylocation || "",
            landmark: addr.landmark || "",
          });
          setPhone(addr.mobile || "");
        }
      );
    }
  }, [context?.addressMode, context?.addressId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) {
      context.openAlertBox("error", errorMsg);
      return;
    }

    setIsLoading(true);

    if (context?.addressMode === "add") {
      postData(`/address/add`, formFields, { withCredentials: true }).then(
        (res) => {
          if (!res?.error) {
            context.openAlertBox("success", "Address Added Successfully");
            resetForm();
          } else {
            context.openAlertBox("error", res?.message);
          }
          setIsLoading(false);
        }
      );
    }

    if (context?.addressMode === "edit") {
      editData(`/address/${context?.addressId}`, formFields, {
        withCredentials: true,
      }).then((res) => {
        if (!res?.error) {
          context.openAlertBox("success", "Address Updated Successfully");
          resetForm();
          context?.setAddressMode("add");
        } else {
          context.openAlertBox("error", res?.message);
        }
        setIsLoading(false);
      });
    }
  };

  const resetForm = () => {
    setFormFields({
      address_line: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      mobile: "",
      userId: context?.userData?._id || "",
      addressType: "",
      deliverylocation: "",
      landmark: "",
    });
    setPhone("");
    context?.getUserDeatils();
    setTimeout(() => context?.setOpenAddressPanel(false), 500);
  };

  return (
<form
  className="flex flex-col h-screen 
  lg:h-[80vh] p-4 bg-white rounded-xl shadow-md"
  onSubmit={handleSubmit}
>
  {/* Scrollable Input Section */}
  <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
    <TextField
      className="w-full"
      label="Address Line 1"
      size="small"
      name="address_line"
      value={formFields.address_line}
      disabled={isLoading}
      onChange={handleChange}
    />
    <TextField
      className="w-full"
      label="City"
      size="small"
      name="city"
      value={formFields.city}
      disabled={isLoading}
      onChange={handleChange}
    />
    <TextField
      className="w-full"
      label="State"
      size="small"
      name="state"
      value={formFields.state}
      disabled={isLoading}
      onChange={handleChange}
    />
    <TextField
      className="w-full"
      label="PinCode"
      size="small"
      name="pincode"
      value={formFields.pincode}
      disabled={isLoading}
      onChange={handleChange}
    />
    <TextField
      className="w-full"
      label="Country"
      size="small"
      name="country"
      value={formFields.country}
      disabled={isLoading}
      onChange={handleChange}
    />
    <PhoneInput
      defaultCountry="bd"
      value={phone}
      disabled={isLoading}
      onChange={(phone) => {
        setPhone(phone);
        setFormFields((prev) => ({ ...prev, mobile: phone }));
      }}
      className="w-full"
    />
    <TextField
      className="w-full"
      label="LandMark"
      size="small"
      name="landmark"
      value={formFields.landmark}
      disabled={isLoading}
      onChange={handleChange}
    />

    {/* Address Type & Delivery Location */}
    <div className="flex flex-col gap-3 mt-4">
      <h2 className="text-sm font-medium text-gray-700">Address Type</h2>
      <FormControl>
        <RadioGroup row value={formFields.addressType}
         onChange={handleChangeAddressType}>
          <FormControlLabel value="Home" control={<Radio />} label="Home" />
          <FormControlLabel value="Work" control={<Radio />} label="Work" />
        </RadioGroup>
      </FormControl>

      <h2 className="text-sm font-medium text-gray-700 mt-2">Delivery Location</h2>
      <FormControl>
        <RadioGroup
          row
          value={formFields.deliverylocation}
          onChange={handleChangeDeliveryLocation}
        >
          <FormControlLabel value="70" control={<Radio />} label="In Feni Sadar" />
          <FormControlLabel value="100" control={<Radio />} label="Out Of Feni Sadar" />
          <FormControlLabel value="130" control={<Radio />} label="Other Location In Bangladesh" />
        </RadioGroup>
      </FormControl>
    </div>
  </div>

  {/* Sticky Save Button */}
  <div className="mt-4 sticky bottom-0 left-0 
  right-0 bg-white p-3 border-t border-gray-200 z-20">
    <Button
      type="submit"
      disabled={isLoading}
      className="btn-org btn-lg w-full flex 
      items-center justify-center gap-3"
    >
      {isLoading ? <CircularProgress size={20} color="inherit" /> : "Save Address"}
    </Button>
  </div>
</form>



  );
};

export default AddAddress;
