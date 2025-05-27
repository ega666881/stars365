import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../../utils/mediaManager';
import { observer } from 'mobx-react';
import clientStore from '../../../stores/clientStore';

function Task({task}) {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#fff',
                
            }}
        >
            <Box>
                <Typography>
                    {task.title}
                </Typography>
            </Box>
            <Box 
                sx={{
                    display: 'flex',
                    gap: 1,
                    backgroundColor: 'black',
                    borderRadius: 27,
                    border: '1px solid',
                    borderColor: task.complete ? ('#7DC152'):('#878787'),
                    padding: 1,
                    width: "40%",
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {task.complete ? (
                    <Button
                        sx={{
                            color: "#7DC152",
                            padding: 0
                        }}
                    >
                        Выполнено
                    </Button>
                ):(
                    <Button
                        sx={{
                            color: 'white',
                            padding: 0
                        }}
                        onClick={() => clientStore.checkTask(task.id)}
                    >
                        Выполнить
                    </Button>
                )}
                {task.complete && <img src={mediaManager('successGreenIcon')} />}
            </Box>
        </Box>
  );
}

export default observer(Task);