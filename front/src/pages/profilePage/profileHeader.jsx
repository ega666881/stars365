import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import { observer } from 'mobx-react';
import clientStore from '../../stores/clientStore';

function ProfileHeader({backLink}) {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                color: '#fff',
                gap: 3
            }}
        >
        <img src={mediaManager('arrowLeftHeader')} onClick={() => navigate(backLink)}/>
        <Box 
            sx={{ 
                display: 'flex', 
                gap: 2,
                padding: 2,
                width: "90%",
                height: 30
            }}
            >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    alignItems: 'center',
                    width: "90%",
                    gap: 1
                }}
                
            >
                
                <Typography
                    sx={{
                        display: 'flex',
                        gap: 1,
                        fontFamily: "Roboto",
                        fontSize: "20px",
                        fontWeight: 'bold'
                    }}
                    >
                        {clientStore.user.winStarsBalance}
                        <img src={mediaManager('starsOutlinedImage')} />
                </Typography>
                <Typography
                    sx={{
                        display: 'flex',
                        gap: 1,
                        fontFamily: "Roboto",
                        fontSize: "20px",
                        fontWeight: 'bold'
                    }}
                    >
                        {clientStore.user.balance}
                        <img src={mediaManager('starsOutlinedImage')} />
                </Typography>
                <Typography 
                    sx={{
                        display: 'flex',
                        fontFamily: "Roboto",
                        fontSize: "20px",
                        fontWeight: 'bold',
                        gap: 0.5,
                    }}
                >
                    {clientStore.user.candy}
                    <img src={mediaManager('candyWhiteIcon')} />
                </Typography>
            </Box>
            <Avatar 
                alt="User"
                src={Telegram.WebApp?.initDataUnsafe?.user?.photo_url}
                sx={{
                    position: 'absolute',
                    width: 60,
                    height: 60,
                    right: 0,
                    top: 95,
                    borderRadius: 27,
                    borderColor: "red",
                    border: "1px solid",
                }}
                onClick={() => navigate('/profile')}
                />
            </Box>
        </Box>
  );
}

export default observer(ProfileHeader);