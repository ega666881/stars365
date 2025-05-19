import React from 'react';
import { Box, Slide, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import mediaManager from '../../utils/mediaManager';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../profilePage/profileHeader';
import ToolBar from './toolBar';
import ReferalList from './referalsComponents/referalList';

function ReferalsPage() {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                
            }}
        >
            <ProfileHeader backLink={'/profile'} />
            <ToolBar /> 
            <Slide in={true} direction='up'>
                <Box>
                    <ReferalList />
                </Box>
            </Slide>
        </Box>
    );
}

export default observer(ReferalsPage);