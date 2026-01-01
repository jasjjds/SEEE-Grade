import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import React from 'react';

interface InputProps {
  label: string,
  name: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  type?: string,
  error?: boolean,
  helperText?: string,
  required?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  startIcon?: React.ReactNode,
  endIcon?: React.ReactNode,
}

export function CustomInput(
  {
    label,
    name,
    value,
    onChange,
    type = "text", 
    error = false, 
    helperText = "",
    required = false,
    disabled = false,
    readOnly = false,
    startIcon,
    endIcon,
  }: InputProps
){

  return(
    <>
      <TextField
        fullWidth
        variant="standard"
        id={name}
        name={name}
        label={label} 
        value={value}
        onChange={onChange}
        type={type}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        
        // --- PHẦN STYLE QUAN TRỌNG ---
        sx={{
          // 1. Màu chữ người dùng nhập vào
          '& .MuiInputBase-input': {
            color: 'white', 
          },
          '& .MuiInputLabel-root': {
            color: '#d1d5db',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ec4899',
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: '#6b7280', // Màu xám khi bình thường
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'white', // Màu trắng khi di chuột vào
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#ec4899', // Màu hồng khi đang gõ (Active)
          },
          // 4. Màu của Icon (Adornment)
          '& .MuiInputAdornment-root': {
            color: 'white',
          },
          // Xử lý icon cụ thể bên trong nếu nó là SVG
          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
             color: 'white',
          }
        }}
        // -----------------------------

        slotProps={{
          input: {
            readOnly: readOnly,
            startAdornment: startIcon ? (
              <InputAdornment position="start">
                {startIcon}
              </InputAdornment>
            ) : null,
            endAdornment: endIcon ? (
              <InputAdornment position="end">
                {endIcon}
              </InputAdornment>
            ) : null,
          },
        }}
      />
    </>
  );
}