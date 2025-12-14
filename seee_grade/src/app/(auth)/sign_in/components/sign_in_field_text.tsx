"use client";

import { useState } from "react";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CustomInput } from "@/components/CustomInput"
import { Password } from "@mui/icons-material";

export function SignInFieldText (){
  const [formData, setFormData] = useState({
    username:"", 
    password:"",
  });
  const [showPassword, setshowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return(
    <>
      <CustomInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        startIcon={<AccountCircleOutlinedIcon/>}
      />
    </>
  );
}