import React from 'react';
import { Box, Slide, Typography } from '@mui/material';
import { observer } from 'mobx-react';


function BottomButtons() {
    
    return (
        <Box
            sx={{
                display: 'flex',
                color: '#fff',
                backgroundColor: '#888888',
                borderRadius: 27,
                padding: 3,
                marginTop: 10,
                justifyContent: 'center',
                position: 'absolute',
                bottom: 20,
                width: "75%"
            }}
        >
            <Typography
                sx={{
                    fontWeight: 'bold'
                }}
            >
                Соглашение
            </Typography>
        </Box>
    );
}

export default observer(BottomButtons);