'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Alert } from "@mui/material";

import { SignUpFieldText } from "./components/sign_up_field_text";
export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] =useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => {
    if(!formData.username || !formData.password || !formData.confirmPassword){
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if(!formData.username){
      alert("Vui lòng nhập username!");
      return;
    }
    if(!formData.password){
      alert("Vui lòng nhập password!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    alert("Đăng ký thành công!");
    router.push("/sign_in");
  }

  return (
    <div className="flex w-full flex-col items-center gap-5 ">
      <div className="flex w-full gap-2 flex-col" >
        <div className="flex flex-col gap-1">
          <span className="font-lato text-center text-3xl font-bold text-black dark:text-white">
            ĐĂNG KÝ
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-lato text-center font-medium text-muted-foreground dark:text-white">
            Bạn đã có tài khoản?&nbsp;&nbsp;&nbsp;
            <button
              type="button"
              tabIndex={-1}
              onClick={() => router.push("/sign_in")}
              className="font-medium text-primary hover:text-pink-600 mt-10 bg-transparent border-none cursor-pointer p-0"
            >
              Đăng nhập ngay!
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex w-full flex-col items-center gap-3 mt-2">
          <SignUpFieldText
            formData={formData}
            onChange={handleChange}
          />
          <Button 
            variant="contained"
            onClick={handleSignUp}
            className="mt-6"
            sx={{
              width: '160px',
              height: '48px',
              backgroundColor: '#ec4899',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#ec4899',
              },
            }}
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}
