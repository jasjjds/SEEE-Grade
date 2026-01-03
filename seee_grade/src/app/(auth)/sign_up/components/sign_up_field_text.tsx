"use client";

import { useState } from "react";
import { CustomInput } from "@/components/CustomInput";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

interface SignUpFieldTextProps {
  formData: {
    username: string;
    password?: string;
    confirmPassword?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SignUpFieldText({ formData, onChange }: SignUpFieldTextProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col gap-4">
      <CustomInput
        label="Username"
        name="username"
        value={formData.username} // Lấy value từ props
        onChange={onChange}       // Gọi hàm từ props
        startIcon={<AccountCircleOutlinedIcon />}
      />

      {/* PASSWORD */}
      <CustomInput
        label="Password"
        name="password"
        value={formData.password || ""}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        startIcon={<LockIcon />}
        endIcon={
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            sx={{ color: 'white' }} // Thêm màu trắng cho icon mắt
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        }
      />

      {/* RE-PASSWORD */}
      <CustomInput
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword || ""}
        onChange={onChange}
        // SỬA LỖI Ở ĐÂY: Dùng showConfirmPassword
        type={showConfirmPassword ? "text" : "password"} 
        startIcon={<LockIcon />}
        endIcon={
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            sx={{ color: 'white' }} // Thêm màu trắng cho icon mắt
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        }
      />
    </div>
  );
}