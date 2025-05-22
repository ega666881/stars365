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

function MainPage() {

    useEffect(() => {
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
        <img src={mediaManager('tempEnergyImage')} />
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