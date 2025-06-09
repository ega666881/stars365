import React from 'react';
import { Box, Button, Switch, Typography, Avatar } from '@mui/material';
import { observer } from "mobx-react"
import mediaManager from '../utils/mediaManager';
import { formatNumber } from '../utils/formatNumber';
import clientStore from '../stores/clientStore';

function WinUserCard({data}) {
    return <Button
                sx={{
                    backgroundColor: 'black', 
                    padding: 0.05,
                    borderRadius: 27,
                    width: "100%",
                    marginRight: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 2,
                    height: 40,
                    color: 'white'
                }}
                onClick={() => clientStore.setWinsUsersHistoryOpen(true)}
            >
                <Avatar 
                    alt="User"
                    src={data.photo_url}
                    sx={{
                        display: 'flex',
                        width: 30,
                        height: 30,
                        borderRadius: 27,
                        borderColor: "red",
                        border: "1px solid",
                    }}
                    onClick={() => navigate('/profile')}
                />
                <Typography 
                    variant="h6"
                    sx={{
                        color: '#878787',
                        width: "100%"
                    }}
                >{data.username} </Typography>
                <Typography 
                    variant="h6" 
                    display={'flex'} 
                    alignItems={'center'}
                    width={"80%"}
                    >
                        <img src={mediaManager('starsOutlinedImage')} />{formatNumber(data.value)}
                    </Typography>
                <Typography variant="h6" 
                    sx={{
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#878787',
                        width: "50%"
                    }}>
                    {data.time}
                    <img src={mediaManager('x10Icon')} 
                        style={{
                            
                        }}
                        />
                    </Typography>
            
            </Button>
}

export default observer(WinUserCard)