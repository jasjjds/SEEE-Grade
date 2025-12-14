import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
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
        label={label} 
        value={value}
        onChange={onChange}
        type={type}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
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