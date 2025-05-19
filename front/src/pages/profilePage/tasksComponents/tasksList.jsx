import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Task from './task';

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
                {[
                    {title: "Пригласи 5 друзей", checked: false}, 
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},

                    {title: "Пригласи 5 друзей", checked: true},
                    {title: "Пригласи 5 друзей", checked: true},
                ].map((task) => (<Task title={task.title} checked={task.checked} />))}
            </Box>
        </Box>
  );
}

export default TasksList;