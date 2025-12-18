"use client";

import { useState } from "react";
import { CustomInput } from "@/components/CustomInput"; 

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

export function SignInFieldText (){
  const [formData, setFormData] = useState({
    username:"", 
    password:"",
  });
  const [showPassword, setshowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => setshowPassword((show) => !show)
  return(
    <div className="flex flex-col gap-4 ">
      <CustomInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        startIcon={<AccountCircleOutlinedIcon/>}
      />
      <CustomInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        type={showPassword ? "text" : "password"}
        startIcon={<LockIcon/>}
        endIcon={
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        }
      />
    </div>
  );
}