import React from 'react';
import { Box, Button, Switch, Typography } from '@mui/material';
import ImageSwitch from '../../sharedComponents/customSwitcher';
import mediaManager from '../../utils/mediaManager';
import clientStore from '../../stores/clientStore';
import { observer } from 'mobx-react';

function StatsBar() {

    return <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                marginLeft: 0,
                position: 'fixed',
                top: "80%",
                zIndex: 70,
                marginTop: -7,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <img src={mediaManager('x10GrayIcon')} />
                <img src={mediaManager('peoplesGrayIcon')} />
                <Typography
                    sx={{
                        color: '#D9D9D9',
                        fontSize: 20
                    }}
                >
                    {clientStore.activeUsersCount}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    width: '50%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Typography
                    sx={{
                        color: '#D9D9D9',
                        fontSize: 20
                    }}
                >
                    367.816
                </Typography>
                <img src={mediaManager('peoplesGrayIcon')} />
                <img src={mediaManager('x10TextGrayIcon')} />
            </Box>
        </Box>
}

export default observer(StatsBar);