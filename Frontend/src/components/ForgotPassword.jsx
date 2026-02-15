import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

export default function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      setEmailError(true);
      toast.error('Please enter a valid email');
      return;
    }

    toast.success('Reset link sent to your email!');
    setEmail('');
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <DialogContentText >
            Enter your account's email address. We'll send a reset link.
          </DialogContentText>
          <TextField
            autoFocus
            color='dark'
            required
            size='small'
            label="Email address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            error={emailError}
          />
        </DialogContent>
        <DialogActions>
          <Button color='dark' onClick={handleClose}>Cancel</Button>
          <Button color='dark' variant="contained" type="submit">
            Continue
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
