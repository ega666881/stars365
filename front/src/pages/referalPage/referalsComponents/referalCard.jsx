import React from 'react';
import { Box, Slide, Typography, Avatar } from '@mui/material';
import { observer } from 'mobx-react';

import { useNavigate } from 'react-router-dom';
import mediaManager from '../../../utils/mediaManager';

function ReferalCard({referal}) {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                color: '#fff', 
                gap: 1
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#262626',
                    borderRadius: 27,
                    width: "100%",
                    alignItems: 'center'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Avatar 
                        alt="User"
                        src={referal.user.photo_url}
                        sx={{
                            display: 'flex',
                            width: 30,
                            height: 30,
                            borderRadius: 27,
                            borderColor: "red",
                            border: "1px solid",
                        }}
                        onClick={() => navigate('/profile')}
                    />
                    <Typography
                        sx={{
                            color: '#878787'
                        }}
                    >
                        @{referal.user.username}
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        display: 'flex',
                        fontWeight: 'bold',
                        color: 'white',
                        gap: 0.5,
                        alignItems: 'center'
                    }}
                >
                    {referal.user.candy}
                    <img src={mediaManager('candyGrayIcon')} />
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#262626',
                    padding: 1,
                    borderRadius: 27,
                    width: "50%",
                    justifyContent: 'center'
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        color: 'white'
                    }}
                >
                    {referal.reward}
                </Typography>
            </Box>
        </Box>
    );
}

export default observer(ReferalCard);