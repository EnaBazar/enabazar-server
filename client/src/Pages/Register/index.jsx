import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const res = await postData("/auth/register", form);

    if (!res?.error) {
      navigate("/verify-otp", { state: { mobile: form.mobile } });
    } else {
      alert(res.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
      }}
    >
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Mobile Number"
            name="mobile"
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleRegister}
          >
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;