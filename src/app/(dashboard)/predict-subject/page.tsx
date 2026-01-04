'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button, MenuItem, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, CircularProgress,
  ToggleButton, ToggleButtonGroup, IconButton, Box, Typography
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import TouchAppIcon from '@mui/icons-material/TouchApp'; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PsychologyIcon from '@mui/icons-material/Psychology'; // Icon mới cho trang thái chờ

import * as XLSX from 'xlsx';

import PredictLayout from '../components/layout-predict';
import { SUBJECT_DATA } from '@/data/subject'; 
import predictionApi from '@/services/predictionApi';

// --- CONSTANTS ---
const GRADE_OPTIONS = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];

interface GradeRow {
    subject: string;
    grade: string;
}

interface PredictionResult {
  subject: string;
  predicted_letter: string;
  predicted_score: number;
}

// --- COMPONENTS ---
const CustomSelect = ({ label, value, onChange, options, icon, disabled = false }: any) => (
  <TextField
    select
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    variant="standard"
    disabled={disabled}
    slotProps={{
        input: {
            startAdornment: icon ? (
                <InputAdornment position="start">{icon}</InputAdornment>
            ) : null,
        },
    }}
    sx={{
      marginBottom: '16px',
      '& .MuiInputBase-root': { color: 'white' },
      '& .MuiInputLabel-root': { color: '#9ca3af' }, 
      '& .MuiInputLabel-root.Mui-focused': { color: '#ec4899' }, 
      '& .MuiInput-underline:before': { borderBottomColor: '#4b5563' }, 
      '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' },
      '& .MuiInput-underline:after': { borderBottomColor: '#ec4899' },
      '& .MuiSvgIcon-root': { color: 'white' },
      '& .MuiSelect-icon': { color: 'white' },
      '& .Mui-disabled': { opacity: 0.5 }
    }}
  >
    {options.map((option: any) => (
      <MenuItem key={option.value} value={option.value}>
         {option.label || option.value}
      </MenuItem>
    ))}
  </TextField>
);

export default function PredictSubject() {
  const [major, setMajor] = useState<string>('');
  
  // Chế độ nhập liệu: 'upload' hoặc 'manual'
  const [inputMode, setInputMode] = useState<'upload' | 'manual'>('upload');

  // State cho Upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // State cho Nhập tay
  const [manualGrades, setManualGrades] = useState<GradeRow[]>([{ subject: '', grade: '' }]);

  // State API & UI
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const currentSubjects = major ? SUBJECT_DATA[major as keyof typeof SUBJECT_DATA] : [];

  // Reset khi đổi ngành
  useEffect(() => {
    setManualGrades([{ subject: '', grade: '' }]);
    setUploadedFile(null);
  }, [major]);

  // --- XỬ LÝ NHẬP TAY ---
  const handleManualChange = (index: number, field: keyof GradeRow, value: string) => {
    setManualGrades((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
    });
  };

  const addRow = () => {
    setManualGrades([...manualGrades, { subject: '', grade: '' }]);
  };

  const removeRow = (index: number) => {
    const updated = [...manualGrades];
    updated.splice(index, 1);
    setManualGrades(updated);
  };

  // --- XỬ LÝ DỰ ĐOÁN (CORE LOGIC) ---
  const handlePredict = async () => {
    if (!major) {
        alert("Vui lòng chọn ngành học!");
        return;
    }

    setLoading(true);
    let gradesPayload: GradeRow[] = [];

    try {
        if (inputMode === 'upload') {
            // --- LOGIC 1: Đọc từ Excel ---
            if (!uploadedFile) {
                alert("Vui lòng tải file bảng điểm!");
                setLoading(false);
                return;
            }
            
            gradesPayload = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = e.target?.result;
                        const workbook = XLSX.read(data, { type: 'binary' });
                        const sheetName = workbook.SheetNames[0];
                        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                        const formatted = jsonData.map((row: any) => ({
                            subject: row['Môn học'] || row['Subject'] || row['subject'],
                            grade: row['Điểm chữ'] || row['Grade'] || row['grade']
                        })).filter((item: any) => item.subject && item.grade);

                        if (formatted.length === 0) reject("Không đọc được dữ liệu điểm từ file Excel.");
                        resolve(formatted);
                    } catch (err) { reject(err); }
                };
                reader.readAsBinaryString(uploadedFile);
            });

        } else {
            // --- LOGIC 2: Lấy từ Form nhập tay ---
            gradesPayload = manualGrades.filter(g => g.subject && g.grade);
            if (gradesPayload.length < 3) {
                alert("Vui lòng nhập ít nhất 3 môn đã có điểm để dự đoán chính xác.");
                setLoading(false);
                return;
            }
        }

        // --- TỰ ĐỘNG TÍNH TOÁN TARGET SUBJECTS ---
        // Logic: Target = (Tất cả môn của ngành) - (Môn đã có điểm đầu vào)
        const inputSubjectNames = gradesPayload.map(g => g.subject);
        const autoTargetSubjects = currentSubjects.filter(subj => !inputSubjectNames.includes(subj));

        if (autoTargetSubjects.length === 0) {
            alert("Bạn đã có điểm hết tất cả các môn trong ngành này rồi! Không còn gì để dự đoán.");
            setLoading(false);
            return;
        }

        // --- GỌI API ---
        const payload = {
            major: major,
            current_grades: gradesPayload,
            target_subjects: autoTargetSubjects // Gửi danh sách tự động này
        };

        const response = await predictionApi.PredictSubject(payload);
        const dataRes = Array.isArray(response) ? response : (response as any).data;
        
        setResults(dataRes);
        setOpenModal(true);

    } catch (err: any) {
        console.error(err);
        alert(typeof err === 'string' ? err : (err.response?.data?.detail || "Có lỗi xảy ra"));
    } finally {
        setLoading(false);
    }
  };

  return (
    <PredictLayout
      sidebarTitle="Thiết lập dữ liệu"
      sidebarContent={
        <>
            {/* 1. Chọn Ngành */}
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

            {/* 2. Chọn chế độ nhập liệu */}
            <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2 font-medium">Nguồn dữ liệu điểm</label>
                <ToggleButtonGroup
                    value={inputMode}
                    exclusive
                    onChange={(e, newMode) => { if(newMode) setInputMode(newMode); }}
                    fullWidth
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        '& .MuiToggleButton-root': { 
                            color: '#9ca3af', 
                            textTransform: 'none',
                            border: '1px solid rgba(255,255,255,0.1)',
                            '&.Mui-selected': { color: 'white', backgroundColor: '#ec4899', '&:hover': { backgroundColor: '#db2777' } }
                        }
                    }}
                >
                    <ToggleButton value="upload">
                        <FilePresentIcon fontSize="small" sx={{ mr: 1 }}/> File Excel
                    </ToggleButton>
                    <ToggleButton value="manual">
                        <EditNoteIcon fontSize="small" sx={{ mr: 1 }}/> Nhập tay
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/* 3. Hiển thị UI tương ứng */}
            <div className="mb-8 flex-1 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {inputMode === 'upload' ? (
                    // --- UI UPLOAD ---
                    !uploadedFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl bg-white/5 hover:bg-white/10 hover:border-pink-500 cursor-pointer transition-all group">
                            <CloudUploadIcon sx={{ fontSize: 40, color: '#9ca3af', mb: 1, transition: '0.3s', '.group-hover &': { color: '#ec4899'} }} />
                            <span className="text-xs text-gray-400 group-hover:text-white text-center px-2">Upload file (.xlsx, .csv)</span>
                            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])} />
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
                            <IconButton onClick={() => setUploadedFile(null)} sx={{ color: '#ef4444' }} size="small">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </div>
                    )
                ) : (
                    // --- UI NHẬP TAY ---
                    <div className="space-y-3">
                         {manualGrades.map((row, idx) => (
                             <div key={idx} className="flex gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/10">
                                 <div className="flex-1">
                                     <CustomSelect 
                                         label={!major ? "Chọn ngành trước" : `Môn học ${idx + 1}`}
                                         value={row.subject}
                                         onChange={(e: any) => handleManualChange(idx, 'subject', e.target.value)}
                                         options={currentSubjects.map(s => ({ value: s, label: s }))}
                                         disabled={!major}
                                     />
                                     <CustomSelect 
                                         label="Điểm"
                                         value={row.grade}
                                         onChange={(e: any) => handleManualChange(idx, 'grade', e.target.value)}
                                         options={GRADE_OPTIONS.map(g => ({ value: g, label: g }))}
                                         disabled={!major}
                                     />
                                 </div>
                                 <IconButton onClick={() => removeRow(idx)} color="error" disabled={manualGrades.length === 1}>
                                     <RemoveCircleOutlineIcon />
                                 </IconButton>
                             </div>
                         ))}
                         <Button 
                             fullWidth 
                             variant="outlined" 
                             startIcon={<AddCircleOutlineIcon />} 
                             onClick={addRow}
                             sx={{ color: '#ec4899', borderColor: '#ec4899', '&:hover': { borderColor: '#db2777', backgroundColor: 'rgba(236,72,153,0.1)' } }}
                         >
                             Thêm môn
                         </Button>
                    </div>
                )}
            </div>
            
            {/* Nút Predict ở Sidebar luôn cho tiện */}
             <div className="mt-auto pt-4 border-t border-white/10">
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoGraphIcon />}
                    onClick={handlePredict}
                    disabled={loading || (inputMode === 'upload' && !uploadedFile)}
                    sx={{
                        padding: '12px', fontWeight: 'bold', borderRadius: '12px',
                        backgroundColor: '#ec4899', boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)', textTransform: 'none',
                        '&:hover': { backgroundColor: '#db2777' },
                        '&.Mui-disabled': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                    }}
                >
                    {loading ? "Đang phân tích..." : "Dự đoán ngay"}
                </Button>
            </div>
        </>
      }
      headerContent={
         <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dự đoán Môn học</h1>
            {major ? (
                 <p className="text-gray-400 text-sm">Hệ thống sẽ dự đoán các môn <span className="text-pink-500 font-bold">chưa học</span> của ngành {major}</p>
            ) : (
                 <p className="text-gray-400 text-sm">Vui lòng chọn ngành để bắt đầu</p>
            )}
        </div>
      }
    >
      
      {/* --- MAIN CONTENT (ĐÃ XÓA LIST BÊN PHẢI) --- */}
      {/* Thay vào đó hiển thị trạng thái chờ đẹp mắt */}
      <Box 
        sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            opacity: 0.7 
        }}
      >
        <div className="p-8 rounded-full bg-white/5 border border-white/10 mb-6 animate-pulse">
            <PsychologyIcon sx={{ fontSize: 80, color: major ? '#ec4899' : '#4b5563' }} />
        </div>
        <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
            {major ? "Sẵn sàng dự đoán" : "Chờ dữ liệu"}
        </Typography>
        <Typography variant="body1" color="gray" align="center" sx={{ maxWidth: 500 }}>
            {major 
                ? "Hệ thống sẽ tự động phân tích điểm đầu vào của bạn và dự đoán kết quả cho TẤT CẢ các môn học còn lại trong chương trình." 
                : "Vui lòng chọn ngành và tải bảng điểm ở menu bên trái để bắt đầu."}
        </Typography>
      </Box>

      {/* MODAL KẾT QUẢ */}
      <Dialog 
        open={openModal} onClose={() => setOpenModal(false)}
        maxWidth="md" fullWidth
        PaperProps={{ style: { backgroundColor: '#1e1e1e', color: 'white', borderRadius: '16px', border: '1px solid #333' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoGraphIcon sx={{ color: '#ec4899' }}/> Kết quả dự đoán
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#9ca3af', borderBottom: '1px solid #333' }}>Môn học</TableCell>
                            <TableCell align="center" sx={{ color: '#9ca3af', borderBottom: '1px solid #333' }}>Dự đoán</TableCell>
                            <TableCell align="center" sx={{ color: '#9ca3af', borderBottom: '1px solid #333' }}>Thang 4</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((row, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{row.subject}</TableCell>
                                <TableCell align="center" sx={{ borderBottom: '1px solid #333' }}>
                                    <Chip label={row.predicted_letter} sx={{ backgroundColor: row.predicted_letter === 'N/A' ? '#374151' : 'rgba(236, 72, 153, 0.2)', color: row.predicted_letter === 'N/A' ? '#9ca3af' : '#ec4899', fontWeight: 'bold' }} />
                                </TableCell>
                                <TableCell align="center" sx={{ color: 'white', borderBottom: '1px solid #333' }}>{row.predicted_score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ color: 'white' }}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </PredictLayout>
  );
}