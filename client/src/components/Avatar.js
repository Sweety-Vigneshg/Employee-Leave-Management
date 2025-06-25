import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';

const Avatar = ({ name, size = 40, fontSize = 16 }) => {
  const getInitials = () => {
    if (!name) return '';
    
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    
    return initials;
  };

  return (
    <MuiAvatar 
      sx={{ 
        bgcolor: '#1976d2', 
        color: 'white', 
        width: size, 
        height: size, 
        fontSize: fontSize 
      }}
    >
      {getInitials()}
    </MuiAvatar>
  );
};

export default Avatar;