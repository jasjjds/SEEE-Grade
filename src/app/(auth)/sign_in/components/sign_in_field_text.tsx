"use client";

import { useState } from "react";
import { CustomInput } from "@/components/CustomInput"; 

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

interface SignInFieldTextProps {
  formData: {
    username: string;
    password?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SignInFieldText ({formData, onChange}: SignInFieldTextProps) {

  const [showPassword, setShowPassword] = useState(false);

  // Đã xóa hàm handleChange thừa
  
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return(
    <div className="flex flex-col gap-4 ">
      <CustomInput
        label="Username"
        name="username"
        value={formData.username || ""}
        onChange={onChange} // Truyền thẳng hàm từ props vào đây
        startIcon={<AccountCircleOutlinedIcon/>}
      />
      <CustomInput
        label="Password"
        name="password"
        value={formData.password || ""}
        onChange={onChange} // Truyền thẳng hàm từ props vào đây
        type={showPassword ? "text" : "password"}
        startIcon={<LockIcon/>}
        endIcon={
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            sx={{ color: 'white' }} // THÊM: Để icon mắt màu trắng nổi bật trên nền
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        }
      />
    </div>
  );
}