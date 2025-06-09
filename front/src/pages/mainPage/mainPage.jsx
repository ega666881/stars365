import React, { useEffect } from 'react';
import { Box, Slide, Typography } from '@mui/material';

import Header from './Header';
import Footer from './footer';
import mediaManager from '../../utils/mediaManager';
import StatsBar from './statsBar';
import SpinTest from './spinTest';
import BetModal from './changeBetModal/betModal';
import { observer } from 'mobx-react';
import clientStore from '../../stores/clientStore';
import socketStore from '../../stores/socketStore';
import x10SpinStore from '../../stores/x10SpinStore';
import X10Spin from './x10Spin';
import Toolbar from './toolbar';
import { useParams } from 'react-router-dom';
import { formatNumber } from './../../utils/formatNumber';
import WinsHistory from './winsHistory';

function MainPage() {
    const {id} = useParams()

    useEffect(() => {
        
        if (id) {
            clientStore.getUser(id)
        }
        socketStore.sendUserLogin({id: clientStore.user.id})
    }, [])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
            }}
        >
        <BetModal />
        <Slide in={true} direction='down'>
            <Box>
                <Header />
            </Box>
        </Slide>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    fontFamily: 'Roboto',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    background: `
                    linear-gradient(
                    to right,
                    #FFFCAE 0%,
                    #FFAE35 47%,
                    #AE4900 67%,
                    #FFB400 100%
                    )
                `,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    MozBackgroundClip: "text",
                    MozTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                }}
            >
                <img src={mediaManager('jackPodIcon')} />
                {formatNumber(Math.round(clientStore.settings.jackpod))}
            </Typography>  
        </Box>
        <Slide in={clientStore.winsUsersHistoryOpen} direction='up'>
            <Box>
                <WinsHistory />
            </Box>
        </Slide>
        <Slide in={true} direction='up'>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Toolbar />
                {x10SpinStore.x10 ? (<X10Spin 
                    segments={[
                        mediaManager('starsLogo'),
                        mediaManager('starsLogo'),
                        mediaManager('starsLogo'),
                        mediaManager('starsLogo')
                    ]}
                />):(<SpinTest />)}
               
                <StatsBar />
            </Box>
        </Slide>
        <Slide in={true} direction='left'>
            <Box>
                <Footer />
            </Box>
        </Slide>
        </Box>
    );
}

export default observer(MainPage);