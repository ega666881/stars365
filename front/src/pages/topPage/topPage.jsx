import React, { useEffect } from 'react';
import { Box, Button, Slide, Typography } from '@mui/material';

import { observer } from 'mobx-react';

import { useNavigate, useParams } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import topStore from '../../stores/topStore';
import WinUserCard from '../../sharedComponents/winUserCard';

function TopPage() {
    const navigate = useNavigate()
    useEffect(() => {
        topStore.getTopUsers()
    }, [])

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            width: "100%"
        }}
    >
        <Box
            sx={{
                display: 'flex',
                gap: 5
            }}
        >
            <img src={mediaManager('arrowLeftHeader')} onClick={() => navigate('/')}/>
            <Typography
                sx={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'white'
                }}
            >
                Таблица победителей
            </Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                marginTop: 2,
            }}
        >
            <Button
                sx={{
                    backgroundColor: topStore.selectedTop === "balanceTop" ? ("gray"):("")
                }}
                onClick={() => topStore.setSelectedTop(topStore.topTypes.balanceTop)}
            >
                <img src={mediaManager('starsOutlinedImage')} />
            </Button>
            <Button
                sx={{
                    backgroundColor: topStore.selectedTop === "candyTop" ? ("gray"):("")
                }}
                onClick={() => topStore.setSelectedTop(topStore.topTypes.candyTop)}
            >
                <img src={mediaManager('candyWhiteIcon')} />
            </Button>
        </Box>
        <Box
            sx={{
                maxHeight: "100vh",
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            {topStore.tops && topStore.tops[topStore.selectedTop].map((user) => <WinUserCard data={{
                photo_url: user.photo_url,
                username: user.username,
                value: topStore.selectedTop === topStore.topTypes.balanceTop ? (user.balance):(user.candy),
                valueIcon: topStore.selectedTop === topStore.topTypes.balanceTop ? ('starsOutlinedImage'):("candyWhiteIcon")
            }}/>)}
        </Box>
    </Box>
}

export default observer(TopPage);