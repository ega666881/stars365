import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../../utils/mediaManager';


function WeekRewardCard({day, checked}) {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 360,
                borderColor: "#878787",
                border: '1px solid',
                backgroundColor: checked ? ("#7DC152"):(""),
                padding: 1,
                width: 30
            }}
        >
            {checked ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img 
                        src={mediaManager('successWhiteIcon')} 
                        style={{
                            marginTop: 5
                        }}
                    />
                </Box>
            ):(
                <Typography
                    sx={{
                        color: "#878787",
                        fontSize: 10,
                        textAlign: 'center'
                    }}    
                >
                    {day} <br />
                    день
                </Typography>
            )}
            
        </Box>
  );
}

export default WeekRewardCard;