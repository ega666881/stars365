import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import { observer } from 'mobx-react';
import clientStore from '../../stores/clientStore';

function ToolBar() {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0',
                color: '#fff',
                width: "100%",
                position: 'absolute',
                top: "30%",
            }}
        >
            <Button>
                <img  src={mediaManager('infoIcon')} />
            </Button>
            <Button
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <a 
                    style={{
                        textDecoration: 'none',
                        color: "white",
                    }}
                    href={`https://t.me/share/url?url=https://t.me/starsgame365bot?start=${clientStore.user.id}&text=`}>
                    <img  src={mediaManager('friendsIconOutlined')} />
                </a>
            </Button>
        </Box>
  );
}

export default observer(ToolBar);