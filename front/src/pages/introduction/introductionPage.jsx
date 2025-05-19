import { useState } from 'react'
import { observer } from 'mobx-react';
import { Box, Button, Typography } from '@mui/material';
import introductionStore from '../../stores/introductionStore';
import OnePage from './onePage';
import TwoPage from './twoPage'

function IntroductionPage() {
    const pages = {
        1: <OnePage />,
        2: <TwoPage />
      }
    

    return (
        <Box>
            {pages[introductionStore.currentPage]}
        </Box>
    )
}

export default observer(IntroductionPage)
