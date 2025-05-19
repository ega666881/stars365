import React from 'react';
import { Box, Slide, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import { useNavigate } from 'react-router-dom';
import ReferalCard from './referalCard';
import clientStore from '../../../stores/clientStore';

function ReferalsList() {
    const navigate = useNavigate()
    console.log(clientStore.user.referals)

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                padding: 2,
                maxHeight: "100%"
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    alignItems: 'center'
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        fontSize: 20
                    }}
                >
                    МОИ ДРУЗЬЯ
                </Typography>
                <Typography
                    sx={{
                        color: '#B5B5B5',
                        fontSize: 15
                    }}
                >
                    баланс
                </Typography>
                <Typography
                    sx={{
                        color: '#B5B5B5',
                        fontSize: 15
                    }}
                >
                    вознаграждение
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    marginTop: 2,
                    maxHeight: "60vh",
                    overflowY: 'auto',
                    paddingBottom: "30vh"
                }}
            >
                
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        marginBottom: "20%"
                    }}
                >
                    {
                        clientStore.user.referals.map((referal, index) => <ReferalCard referal={referal} key={index} />)
                    }
                </Box>
            
            </Box>
        </Box>
    );
}

export default observer(ReferalsList);