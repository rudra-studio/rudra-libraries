import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

interface ContactFormProps {
  onSubmit: (values: { name: string; email: string; message: string }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [values, setValues] = React.useState({ name: '', email: '', message: '' });
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', padding: '20px', backgroundColor: theme.palette.background.default, borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant='h6' align='center' color={theme.palette.text.primary} marginBottom={2}>Contact Us</Typography>
      <TextField
        label='Name'
        name='name'
        value={values.name}
        onChange={handleChange}
        required
        fullWidth
        margin='normal'
        variant='outlined'
        color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
      />
      <TextField
        label='Email'
        name='email'
        value={values.email}
        onChange={handleChange}
        required
        fullWidth
        margin='normal'
        variant='outlined'
        color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
      />
      <TextField
        label='Message'
        name='message'
        value={values.message}
        onChange={handleChange}
        required
        fullWidth
        margin='normal'
        variant='outlined'
        multiline
        rows={4}
        color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
      />
      <Button type='submit' variant='contained' color='primary' fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;