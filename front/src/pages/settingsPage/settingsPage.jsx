import React from 'react';
import { Box, Slide, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import mediaManager from '../../utils/mediaManager';
import { useNavigate } from 'react-router-dom';
import LangSwitch from './langSwitch';
import BottomButtons from './bottomButtons';

function SettingsPage() {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                padding: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: "center",
                    gap: "30%"
                }}
            >
                <img src={mediaManager('arrowLeftHeader')} onClick={() => navigate('/profile')} />
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        fontSize: 20
                    }}
                >
                    Настройки
                </Typography>
            </Box>
            <LangSwitch />
            <BottomButtons />
        </Box>
    );
}

export default observer(SettingsPage);