'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button, MenuItem, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, Typography, CircularProgress, 
  Snackbar, Alert, Box, Divider 
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClassIcon from '@mui/icons-material/Class';
import NumbersIcon from '@mui/icons-material/Numbers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import PredictLayout from '../components/layout-predict';
import predictionApi from '@/services/predictionApi';

// --- COMPONENTS CON (GIỮ NGUYÊN) ---
const CustomSelect = ({ label, value, onChange, options, icon }: any) => {
  return (
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
                <InputAdornment position="start">
                  {icon}
                </InputAdornment>
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
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

const DataInput = ({ label, value, onChange, icon, error }: any) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    variant="outlined" 
    size="medium"
    error={!!error} // Hiển thị đỏ nếu có lỗi
    sx={{
      '& .MuiOutlinedInput-root': {
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        '& fieldset': { borderColor: error ? '#f44336' : 'rgba(255,255,255,0.15)' },
        '&:hover fieldset': { borderColor: error ? '#f44336' : 'rgba(255,255,255,0.5)' },
        '&.Mui-focused fieldset': { borderColor: error ? '#f44336' : '#ec4899' },
      },
      '& .MuiInputLabel-root': { color: '#9ca3af' },
      '& .MuiInputLabel-root.Mui-focused': { color: '#ec4899' },
      '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: '#ec4899' },
    }}
    slotProps={{
        input: {
            endAdornment: (
                <InputAdornment position="end">
                  {icon}
                </InputAdornment>
            ),
        }
    }}
  />
);

// --- COMPONENT CHÍNH ---
export default function PredictGPA() {
  const [degreeType, setDegreeType] = useState('bachelor');
  const [semestersStudied, setSemestersStudied] = useState(1);
  const [semesterData, setSemesterData] = useState<{gpa: string, credits: string}[]>([]);

  // State xử lý API
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [openResultDialog, setOpenResultDialog] = useState(false);

  // Khởi tạo mảng dữ liệu khi số kỳ thay đổi
  useEffect(() => {
    setSemesterData((prev) => {
      const newData = [...prev];
      if (newData.length < semestersStudied) {
        for (let i = newData.length; i < semestersStudied; i++) {
          newData.push({ gpa: '', credits: '' });
        }
      } else {
        return newData.slice(0, semestersStudied);
      }
      return newData;
    });
  }, [semestersStudied]);

  const handleDataChange = (index: number, field: 'gpa' | 'credits', value: string) => {
    // Chỉ cho phép nhập số và dấu chấm
    if (!/^\d*\.?\d*$/.test(value)) return;

    const newData = [...semesterData];
    newData[index] = { ...newData[index], [field]: value };
    setSemesterData(newData);
  };

  const getSemesterOptions = () => {
    const max = degreeType === 'bachelor' ? 6 : 8;
    const options = [];
    for (let i = 1; i <= max; i++) {
      options.push({ value: i, label: `Kỳ ${i}` });
    }
    return options;
  };

  // --- HÀM GỌI API ---
  const handlePredict = async () => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
        // 1. Validate dữ liệu
        const gpaList: number[] = [];
        const tcList: number[] = [];
        
        for (let i = 0; i < semesterData.length; i++) {
            const g = parseFloat(semesterData[i].gpa);
            const c = parseInt(semesterData[i].credits);

            if (isNaN(g) || isNaN(c)) {
                throw new Error(`Vui lòng nhập đầy đủ GPA và Tín chỉ cho Kỳ ${i + 1}`);
            }
            if (g < 0 || g > 4) {
                throw new Error(`GPA Kỳ ${i + 1} không hợp lệ (0 - 4.0)`);
            }
            gpaList.push(g);
            tcList.push(c);
        }

        // 2. Chuẩn bị payload
        // Map 'bachelor' -> "Cử nhân", 'master' -> "Kỹ sư" để khớp với logic Python
        const studentTypeLabel = degreeType === 'bachelor' ? "Cử nhân" : "Kỹ sư";

        const payload = {
            student_type: studentTypeLabel,
            current_semester: semestersStudied,
            gpa_list: gpaList,
            tc_list: tcList
        };

        // 3. Gọi API
        const data = await predictionApi.predictCPA(payload);
        
        // 4. Xử lý kết quả
        setResult(data);
        setOpenResultDialog(true);

    } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || err.detail || "Có lỗi xảy ra khi dự đoán");
    } finally {
        setLoading(false);
    }
  };

  return (
    <PredictLayout
      sidebarTitle="Cấu hình"
      sidebarContent={
        <>
          <div className="flex flex-col gap-2 mb-8">
            <CustomSelect 
              label="Hệ đào tạo"
              value={degreeType}
              onChange={(e: any) => {
                setDegreeType(e.target.value);
                setSemestersStudied(1);
              }}
              icon={<SchoolIcon />}
              options={[
                { value: 'bachelor', label: 'Cử nhân (Bachelor)' },
                { value: 'master', label: 'Thạc sĩ / Kỹ sư (Master)' },
              ]}
            />
            <CustomSelect 
              label="Số kỳ đã học"
              value={semestersStudied}
              onChange={(e: any) => setSemestersStudied(e.target.value)}
              icon={<TimelineIcon />}
              options={getSemesterOptions()}
            />
          </div>
          <div className="mt-auto p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-sm text-pink-200/80">
            <p className="leading-relaxed">
               <span className="font-bold text-pink-500">Note:</span> Dữ liệu đầu vào càng chính xác, thuật toán dự đoán càng hiệu quả.
            </p>
          </div>
        </>
      }
      headerContent={
        <>
           <div>
              <h1 className="text-3xl font-bold text-white mb-1">Dữ liệu học tập</h1>
              <p className="text-gray-400 text-sm">Nhập điểm số chi tiết cho từng kỳ học</p>
           </div>
           <Button
              variant="contained"
              onClick={handlePredict}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
              sx={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  backgroundColor: '#ec4899', 
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#db2777' },
                  '&:disabled': { backgroundColor: '#831843', color: '#ccc' }
              }}
          >
              {loading ? 'Đang tính toán...' : 'Dự đoán ngay'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {semesterData.map((data, index) => (
            <div 
                key={index} 
                className="
                    p-5 rounded-2xl 
                    bg-[#121212]/80 backdrop-blur-md 
                    border border-white/5 
                    hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]
                    transition-all duration-300 group
                "
            >
                <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-bold text-lg">Kỳ {index + 1}</h3>
                      <div className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-pink-500 transition-colors"></div>
                </div>
                
                <div className="flex flex-col gap-4">
                    <DataInput 
                        label="GPA (Hệ 4)" 
                        value={data.gpa}
                        onChange={(e: any) => handleDataChange(index, 'gpa', e.target.value)}
                        icon={<ClassIcon fontSize="small" />}
                    />
                    <DataInput 
                        label="Số Tín chỉ" 
                        value={data.credits}
                        onChange={(e: any) => handleDataChange(index, 'credits', e.target.value)}
                        icon={<NumbersIcon fontSize="small"/>}
                    />
                </div>
            </div>
        ))}
      </div>

      {/* --- DIALOG KẾT QUẢ --- */}
      <Dialog 
        open={openResultDialog} 
        onClose={() => setOpenResultDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
            style: { 
                borderRadius: 20, 
                backgroundColor: '#1e1e1e', 
                color: 'white',
                border: '1px solid rgba(236, 72, 153, 0.3)'
            }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircleIcon sx={{ fontSize: 40, color: '#4ade80' }} />
            </div>
            <Typography variant="h5" fontWeight="bold">Kết quả Dự đoán</Typography>
        </DialogTitle>
        <DialogContent>
            {result && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                        <Typography variant="body2" color="gray">CPA Tốt nghiệp dự kiến</Typography>
                        <Typography variant="h3" fontWeight="bold" color="#ec4899">
                            {result.cpa_grad_predict ?? "N/A"}
                        </Typography>
                    </Box>

                    {result.next_gpa_predict !== null && (
                        <>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                <Typography variant="caption" color="gray">CHI TIẾT KỲ SAU</Typography>
                            </Divider>
                            
                            <Box className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <TrendingUpIcon sx={{ color: '#60a5fa', fontSize: 32 }} />
                                <div>
                                    <Typography variant="h6" fontWeight="bold" color="white">
                                        {result.next_gpa_predict}
                                    </Typography>
                                    <Typography variant="body2" color="#93c5fd">
                                        GPA dự đoán kỳ {semestersStudied + 1}
                                    </Typography>
                                </div>
                            </Box>
                        </>
                    )}
                </Box>
            )}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3, justifyContent: 'center' }}>
            <Button 
                onClick={() => setOpenResultDialog(false)}
                variant="outlined"
                sx={{ 
                    color: 'white', 
                    borderColor: 'white', 
                    borderRadius: '10px',
                    px: 4,
                    '&:hover': { borderColor: '#ec4899', color: '#ec4899' }
                }}
            >
                Đóng
            </Button>
        </DialogActions>
      </Dialog>

      {/* --- SNACKBAR THÔNG BÁO LỖI --- */}
      <Snackbar 
        open={!!errorMsg} 
        autoHideDuration={4000} 
        onClose={() => setErrorMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMsg('')} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

    </PredictLayout>
  );
}