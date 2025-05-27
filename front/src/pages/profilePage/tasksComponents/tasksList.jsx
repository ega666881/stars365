import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Task from './task';
import clientStore from '../../../stores/clientStore';
import { observer } from 'mobx-react';

function TasksList() {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 1,
            }}
        >
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: 25,
                }}
                >
                ЗАДАНИЯ
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: "100%",
                    maxHeight: "30vh",
                    overflowY: 'auto',
                    marginTop: 1
                }}
            >
                {clientStore.tasks.map((task) => (<Task task={task} />))}
            </Box>
        </Box>
  );
}

export default observer(TasksList);