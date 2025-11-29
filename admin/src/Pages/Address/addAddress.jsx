import React, { useContext, useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { fetchDataFromApi, postData } from '../../utils/api';
import { MyContext } from '../../App';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const AddAddress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [phone, setPhone] = useState('');
  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    mobile: '',
    status: '',
    selected: false,
    userId: context?.userData?._id
  });

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setFormFields({
      ...formFields,
      status: event.target.value
    });
  };

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value
    });
  };

  const valideValue =
    formFields.address_line &&
    formFields.city &&
    formFields.state &&
    formFields.pincode &&
    formFields.country &&
    formFields.mobile &&
    formFields.status !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.address_line === "") {
      setIsLoading(false);
      context.openAlertBox("error", "Please enter your AddressLine");
      return;
    }
    if (formFields.city === "") {
      context.openAlertBox("error", "Please enter your City");
      return false;
    }
    if (formFields.state === "") {
      context.openAlertBox("error", "Please enter your State");
      return false;
    }
    if (formFields.pincode === "") {
      context.openAlertBox("error", "Please enter your Pincode");
      return false;
    }
    if (formFields.country === "") {
      context.openAlertBox("error", "Please enter your Country");
      return false;
    }
    if (formFields.mobile === "") {
      context.openAlertBox("error", "Please enter your Mobile");
      return false;
    }

    postData(`/address/add`, formFields, { withCredentials: true }).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.openAlertBox("success", res?.message);
        context?.setIsOpenFullScreenPanel({ open: false });

        fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res) => {
          context?.setAddress(res.data);
        });

        const ph = `"${context?.userData?.mobile}"`;
        setPhone(ph);
      } else {
        context.openAlertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <section className="p-5">
      <form className="form w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
        {/* Address & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-sm font-semibold">Address line 1 <span className="text-red-500">*</span></h3>
            <input
              type="text"
              className="w-full h-[40px] border mt-2 px-2 rounded-sm text-sm focus:outline-none focus:border-gray-500"
              name="address_line"
              value={formFields.address_line}
              disabled={isLoading}
              onChange={onchangeInput}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold">City Name <span className="text-red-500">*</span></h3>
            <input
              type="text"
              className="w-full h-[40px] border mt-2 px-2 rounded-sm text-sm focus:outline-none focus:border-gray-500"
              name="city"
              value={formFields.city}
              onChange={onchangeInput}
            />
          </div>
        </div>

        {/* State, Pincode, Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          <div>
            <h3 className="text-sm font-semibold">State <span className="text-red-500">*</span></h3>
            <input
              type="text"
              className="w-full h-[40px] border mt-2 px-2 rounded-sm text-sm focus:outline-none focus:border-gray-500"
              name="state"
              value={formFields.state}
              onChange={onchangeInput}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Pin Code <span className="text-red-500">*</span></h3>
            <input
              type="text"
              className="w-full h-[40px] border mt-2 px-2 rounded-sm text-sm focus:outline-none focus:border-gray-500"
              name="pincode"
              value={formFields.pincode}
              onChange={onchangeInput}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Country <span className="text-red-500">*</span></h3>
            <input
              type="text"
              className="w-full h-[40px] border mt-2 px-2 rounded-sm text-sm focus:outline-none focus:border-gray-500"
              name="country"
              value={formFields.country}
              onChange={onchangeInput}
            />
          </div>
        </div>

        {/* Mobile & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div>
            <h3 className="text-sm font-semibold">Mobile <span className="text-red-500">*</span></h3>
            <PhoneInput
              className="!w-full mt-2"
              defaultCountry="bd"
              value={phone}
              disabled={isLoading}
              onChange={(phone) => {
                setPhone(phone);
                setFormFields((prev) => ({
                  ...prev,
                  mobile: phone,
                }));
              }}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Status <span className="text-red-500">*</span></h3>
            <Select
              value={formFields.status}
              onChange={handleChangeStatus}
              displayEmpty
              size="small"
              className="w-full h-[40px] mt-2"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={true}>True</MenuItem>
              <MenuItem value={false}>False</MenuItem>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <Button
            type="submit"
            disabled={!valideValue}
            className="btn-blue btn-lg w-full flex gap-3 items-center justify-center"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Publish and View'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddAddress;
