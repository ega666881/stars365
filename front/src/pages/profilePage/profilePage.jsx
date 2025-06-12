import React from 'react';
import { Box, Slide, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import ProfileHeader from './profileHeader';
import ToolBar from './tollbar';
import TasksList from './tasksComponents/tasksList';
import WeekRewards from './weekRewardComponents/weekRewards';
import CreateTransactionModal from './createTransactionModal/createTransactionModal';
import BalanceOperations from './balanceOperations';

function ProfilePage() {
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                color: '#fff',
                
            }}
        >
            <CreateTransactionModal />
            <Slide in={true} direction='left'>
                <Box>
                    <ProfileHeader backLink={'/'} />
                </Box>
            </Slide>
            <Slide in={true} direction='up'>
                <Box>
                    <BalanceOperations />
                </Box>
            </Slide>
            <Slide in={true} direction='up'>
                <Box>
                    <ToolBar />
                </Box>
            </Slide>
            <Slide in={true} direction='down'>
                <Box>
                    <TasksList />
                </Box>
            </Slide>
            <Slide in={true} direction='up'>
                <Box>
                    <WeekRewards />
                </Box>
            </Slide>
        </Box>
    );
}

export default observer(ProfilePage);