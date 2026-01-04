'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

import { SignInFieldText } from "./components/sign_in_field_text";
export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] =useState({
      username: '',
      password: '',
    });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => {
    if(!formData.username || !formData.password){
      alert("Vui lòng nhập đầy đủ username và password!");
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
    router.push(`/home?username=${encodeURIComponent(formData.username)}`);
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex w-full gap-2 flex-col" >
        <div className="flex flex-col gap-1">
          <span className="font-lato text-center text-3xl font-bold text-black dark:text-white">
            ĐĂNG NHẬP
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-lato text-center font-medium text-muted-foreground dark:text-white">
            Bạn chưa có tài khoản?&nbsp;&nbsp;&nbsp;
            <button
              type="button"
              tabIndex={-1}
              onClick={() => router.push("/sign_up")}
              className="font-medium text-primary hover:text-pink-600 mt-10 bg-transparent border-none cursor-pointer p-0"
            >
              Đăng ký ngay!
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex w-full flex-col items-center gap-3 mt-2">
          <SignInFieldText
            formData={formData}
            onChange={handleChange}
          />
          <Button 
            variant="contained"
            className="mt-6"
            onClick={handleSignUp}
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
            Đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
}
