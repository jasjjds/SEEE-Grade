'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@mui/material';
import FallingNumbers from '@/components/FallingNumbers'; 

import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const username = searchParams.get('username');

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <FallingNumbers count={15} speed={1} fontSize={30} />

      <div
        className="
          relative flex flex-col items-center
          w-[95%] md:w-[80%] lg:w-[60%] xl:w-[50%]
          rounded-[30px]
          p-8 md:p-12
          bg-black/60
          backdrop-blur-md
          border border-white/10
          shadow-2xl
          text-white
        "
      >
        <div className="absolute top-6 right-6">
          <Button 
             startIcon={<LogoutIcon />}
             sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ec4899' } }}
             onClick={(e) => {
               e.stopPropagation();
               router.push('/');
             }} 
          >
            Thoát
          </Button>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">
          Xin chào, <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            {username}
          </span>
        </h1>
        <p className="text-gray-400 text-center mb-10 text-sm md:text-base">
          Hãy chọn phương thức dự đoán điểm số của bạn
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div 
            onClick={() => handleNavigate('/predict-gpa')}
            className="
              group relative flex flex-col items-center p-8 
              rounded-2xl border border-white/5 bg-white/5 
              transition-all duration-300 
              hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-1
              cursor-pointer active:scale-[0.98] /* 2. Thêm hiệu ứng click và con trỏ tay */
            "
          >
            <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CalculateIcon sx={{ fontSize: 40 }} />
            </div>
            <h3 className="text-xl font-bold mb-2">Dự đoán CPA/GPA</h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              Tính toán và dự đoán điểm tổng kết toàn khóa dựa trên dữ liệu hiện tại.
            </p>
            <div className="w-full pointer-events-none">
              <Button
                variant="contained"
                sx={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 'bold',
                  '.group:hover &': {
                    backgroundColor: '#ec4899',
                    border: '1px solid #ec4899',
                  }
                }}
              >
                Chọn chức năng này
              </Button>
            </div>
          </div>
          <div 
            onClick={() => handleNavigate('/predict-subject')}
            className="
              group relative flex flex-col items-center p-8 
              rounded-2xl border border-white/5 bg-white/5 
              transition-all duration-300 
              hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1
              cursor-pointer active:scale-[0.98]
            "
          >
            <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MenuBookIcon sx={{ fontSize: 40 }} />
            </div>
            <h3 className="text-xl font-bold mb-2">Dự đoán từng môn</h3>
            <p className="text-gray-400 text-sm text-center mb-6">
               Phân tích khả năng đạt điểm mục tiêu cho từng môn học cụ thể.
            </p>

            <div className="w-full pointer-events-none">
              <Button
                variant="contained"
                sx={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 'bold',
                  '.group:hover &': {
                    backgroundColor: '#0ea5e9',
                    border: '1px solid #0ea5e9',
                  }
                }}
              >
                Chọn chức năng này
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}