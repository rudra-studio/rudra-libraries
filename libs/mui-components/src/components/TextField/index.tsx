import styles from "./styles.module.scss";
import React from 'react';
import { TextField as MuiTextField, InputAdornment, IconButton } from '@mui/material';
import { InputAdornmentProps } from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from '@emotion/styled';

const StyledTextField = styled(MuiTextField)(({ theme }) => (
  {
    '& .MuiInputBase-input': {
      padding: '10px',
      borderRadius: '4px',
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    '& .MuiFormHelperText-root': {
      fontSize: '12px',
      color: theme.palette.text.secondary,
    },
  }
));

export interface TextFieldProps extends MuiTextFieldProps {
  /** @translate @textarea */
  label?: string;
  /** @type|json */
  helperText?: string;
  /** @select|none|start|end */
  inputAdornment?: 'none' | 'start' | 'end';
  /** @type|function */
  onPasswordVisibilityChange?: (visible: boolean) => void;
}

export function TextField({
  label = '',
  helperText = '',
  inputAdornment = 'none',
  onPasswordVisibilityChange,
  ...rest
}: TextFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleVisibilityChange = () => {
    setShowPassword(!showPassword);
    if (onPasswordVisibilityChange) {
      onPasswordVisibilityChange(!showPassword);
    }
  };

  const adornmentProps: InputAdornmentProps = {
    position: inputAdornment,
  };

  if (inputAdornment === 'start' || inputAdornment === 'end') {
    adornmentProps.startAdornment = inputAdornment === 'start' ? <InputAdornment position='start'>Start Adornment</InputAdornment> : undefined;
    adornmentProps.endAdornment = inputAdornment === 'end' ? <InputAdornment position='end'>End Adornment</InputAdornment> : undefined;
  }

  if (label.includes('Password') && onPasswordVisibilityChange) {
    adornmentProps.endAdornment = (
      <InputAdornment position='end'>
        <IconButton
          aria-label='toggle password visibility'
          onClick={handleVisibilityChange}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  }

  return (
    <StyledTextField
      label={label}
      helperText={helperText}
      InputProps={adornmentProps}
      {...rest}
    />
  );
}

export default TextField;