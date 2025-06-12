import React, { useEffect } from 'react';
import { Box, Slide, Typography } from '@mui/material';

import { observer } from 'mobx-react';

import { useParams } from 'react-router-dom';
import ProfileHeader from '../profilePage/profileHeader';

function TopPage() {

    useEffect(() => {

    }, [])

    return <Box>
        <ProfileHeader />
    </Box>
}

export default observer(TopPage);