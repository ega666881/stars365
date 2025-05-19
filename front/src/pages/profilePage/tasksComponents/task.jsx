import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../../utils/mediaManager';

function Task({title, checked}) {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#fff',
                
            }}
        >
            <Box>
                <Typography>
                    {title}
                </Typography>
            </Box>
            <Box 
                sx={{
                    display: 'flex',
                    gap: 1,
                    backgroundColor: 'black',
                    borderRadius: 27,
                    border: '1px solid',
                    borderColor: checked ? ('#7DC152'):('#878787'),
                    padding: 1,
                    width: "40%",
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    sx={{
                        color: checked ? ("#7DC152"):('white'),
                    }}
                >
                    {checked ? ("Выполнено"):("Выполнить")}
                </Typography>
                {checked && <img src={mediaManager('successGreenIcon')} />}
            </Box>
        </Box>
  );
}

export default Task;