import React from 'react';
import { Box, Slide, Typography } from '@mui/material';
import { observer } from 'mobx-react';


function LangSwitch() {
    
    return (
        <Box
            sx={{
                display: 'flex',
                color: '#fff',
                backgroundColor: '#484848',
                borderRadius: 27,
                padding: 3,
                marginTop: 10
            }}
        >
            <Typography
                sx={{
                    fontWeight: 'bold'
                }}
            >
                Язык
            </Typography>
        </Box>
    );
}

export default observer(LangSwitch);