'use client';

import React, { useState, useEffect } from 'react';
import { Button, MenuItem, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import SchoolIcon from '@mui/icons-material/School';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import TouchAppIcon from '@mui/icons-material/TouchApp'; 

import PredictLayout from '../components/layout-predict';
import { SUBJECT_DATA } from '@/data/subject'; 
const CustomSelect = ({ label, value, onChange, options, icon }: any) => (
  <TextField
    select
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    variant="standard"
    slotProps={{
        input: {
            startAdornment: (
                <InputAdornment position="start">{icon}</InputAdornment>
            ),
        },
    }}
    sx={{
      marginBottom: '24px',
      '& .MuiInputBase-root': { color: 'white' },
      '& .MuiInputLabel-root': { color: '#9ca3af' }, 
      '& .MuiInputLabel-root.Mui-focused': { color: '#ec4899' }, 
      '& .MuiInput-underline:before': { borderBottomColor: '#4b5563' }, 
      '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' },
      '& .MuiInput-underline:after': { borderBottomColor: '#ec4899' },
      '& .MuiSvgIcon-root': { color: 'white' },
      '& .MuiSelect-icon': { color: 'white' },
    }}
  >
    {options.map((option: any) => (
      <MenuItem key={option.value} value={option.value}>
         {option.value === '' ? <span className="text-gray-400 italic">{option.label}</span> : option.label}
      </MenuItem>
    ))}
  </TextField>
);

export default function PredictSubject() {
  const [major, setMajor] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const currentSubjects = major ? SUBJECT_DATA[major as keyof typeof SUBJECT_DATA] : [];
  useEffect(() => {
    setSelectedSubjects([]);
  }, [major]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };
  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectName)) {
        return prev.filter((s) => s !== subjectName);
      } else {
        return [...prev, subjectName];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === currentSubjects.length) {
        setSelectedSubjects([]); 
    } else {
        setSelectedSubjects([...currentSubjects]); 
    }
  };

  return (
    <PredictLayout
      sidebarTitle="Thiết lập"
      
      sidebarContent={
        <>
            <div className="mb-6">
                <CustomSelect 
                  label="Bạn học ngành"
                  value={major}
                  onChange={(e: any) => setMajor(e.target.value)}
                  icon={<SchoolIcon />}
                  options={[
                    { value: '', label: '-- Bỏ chọn --' },
                    { value: 'ET1', label: 'ET1: Điện tử viễn thông' },
                    { value: 'EE2', label: 'EE2: Kỹ thuật Điều khiển & TĐH' },
                  ]}
                />
            </div>

            <div className="mb-8">
                <label className="block text-gray-400 text-sm mb-2 font-medium">Tải file bảng điểm</label>
                
                {!uploadedFile ? (
                    <label 
                        htmlFor="file-upload" 
                        className="
                            flex flex-col items-center justify-center
                            w-full h-32
                            border-2 border-dashed border-gray-600 rounded-xl
                            bg-white/5 hover:bg-white/10 hover:border-pink-500
                            cursor-pointer transition-all group
                        "
                    >
                        <CloudUploadIcon sx={{ fontSize: 40, color: '#9ca3af', mb: 1, transition: '0.3s', '.group-hover &': { color: '#ec4899'} }} />
                        <span className="text-xs text-gray-400 group-hover:text-white">Click để tải file (.xls, .csv)</span>
                        <input 
                            id="file-upload" 
                            type="file" 
                            className="hidden" 
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="flex items-center justify-between p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <DescriptionIcon sx={{ color: '#ec4899' }} />
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm text-white font-medium truncate">{uploadedFile.name}</span>
                                <span className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setUploadedFile(null)}
                            sx={{ minWidth: 0, padding: 1, color: '#ef4444' }}
                        >
                            <DeleteIcon fontSize="small" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Thống kê nhỏ cuối sidebar */}
            <div className="mt-auto p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-white font-bold text-sm mb-2">Đã chọn dự đoán:</h3>
                <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-pink-500">{selectedSubjects.length}</span>
                    <span className="text-gray-400 text-sm mb-1">môn học</span>
                </div>
            </div>
        </>
      }
      headerContent={!major ? undefined : (
         <>
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Dự đoán Môn học</h1>
                <p className="text-gray-400 text-sm">Danh sách môn học thuộc ngành <span className="text-pink-500 font-bold">{major}</span></p>
            </div>
            
            <div className="flex gap-4">
                <Button 
                    onClick={handleSelectAll}
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white'} }}
                    variant="outlined"
                >
                    {selectedSubjects.length === currentSubjects.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>

                <Button
                    variant="contained"
                    startIcon={<AutoGraphIcon />}
                    disabled={selectedSubjects.length === 0}
                    sx={{
                        padding: '10px 24px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        backgroundColor: '#ec4899', 
                        boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#db2777' },
                        '&.Mui-disabled': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                    }}
                >
                    Dự đoán ngay
                </Button>
            </div>
         </>
      )}
    >=
      
      {!major ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60 animate-fade-in">
                <div className="p-6 rounded-full bg-white/5 border border-white/10 mb-6">
                    <TouchAppIcon sx={{ fontSize: 60, color: '#ec4899' }} className="animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Chưa chọn ngành học</h2>
                <p className="text-gray-400 max-w-md">
                    Vui lòng chọn <span className="text-pink-400 font-bold">ngành học</span> ở thanh menu bên trái để hệ thống hiển thị danh sách môn tương ứng.
                </p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {currentSubjects.map((subject, index) => {
                    const isSelected = selectedSubjects.includes(subject);
                    return (
                        <div 
                            key={index}
                            onClick={() => toggleSubject(subject)}
                            className={`
                                relative p-4 rounded-xl border cursor-pointer select-none transition-all duration-200
                                flex items-center gap-3
                                ${isSelected 
                                    ? 'bg-pink-600/20 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)]' 
                                    : 'bg-[#121212]/80 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/30'
                                }
                            `}
                        >
                            <div className={`transition-colors duration-200 ${isSelected ? 'text-pink-500' : 'text-gray-600'}`}>
                                {isSelected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                            </div>
                            
                            <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                {subject}
                            </span>
                        </div>
                    );
                })}
          </div>
      )}
    </PredictLayout>
  );
}