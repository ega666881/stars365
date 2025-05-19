import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';

function ToolBar() {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                color: '#fff',
                
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center'
                }}
            >
                <img src={mediaManager('walletIcon')} width={30}/>
                <Typography
                    sx={{
                        fontSize: 13
                    }}
                    >
                    адресс кошелька
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        backgroundColor: 'black',
                        borderRadius: 27,
                        border: '1px solid',
                        borderColor: '#878787',
                        padding: 1.5,
                        alignItems: 'center',
                        width: 130,
                        gap: 1
                    }}
                    onClick={() => navigate('/referals')}
                >
                    <Typography
                        sx={{
                            width: "100%",
                            fontWeight: 'bold'
                        }}    
                    >
                        Мои друзья    
                    </Typography> 
                    <img src={mediaManager('inviteFriendIcon')} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        backgroundColor: 'black',
                        borderRadius: 27,
                        border: '1px solid',
                        borderColor: '#878787',
                        padding: 1.5,
                        alignItems: 'center'
                    }}
                >
                    <img src={mediaManager('settingsIcon')} onClick={() => navigate('/settings')} />
                </Box>
            </Box>
        </Box>
  );
}

export default ToolBar;