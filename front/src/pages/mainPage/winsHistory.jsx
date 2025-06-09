import React from 'react';
import { Box, Typography, Avatar, Button, IconButton, Dialog, DialogContent, DialogTitle} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import { observer } from 'mobx-react';
import clientStore from '../../stores/clientStore';
import WinUserCard from '../../sharedComponents/winUserCard';

function WinHistory() {
    const navigate = useNavigate()
    return (
        <Dialog 
            open={clientStore.winsUsersHistoryOpen} 
            onClose={() => clientStore.setWinsUsersHistoryOpen(false)}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: '#262626',
                    width: "100%",
                    padding: 0,
                    margin: 'auto',
                    marginTop: "30%",
                    zIndex: 9999,
                    height: "110%"
                },
            }}
        >
            <DialogTitle>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <IconButton 
                        onClick={() => clientStore.setWinsUsersHistoryOpen(false)}
                        sx={{
                            display: 'flex',
                            justifySelf: 'end',
                            marginLeft: "100%"
                        }}
                    >
                        <img  src={mediaManager('closeIcon')} />
                    </IconButton>
                    
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        margin: 'auto',
                        maxHeight: "50%",
                    }}
                >
                    {clientStore.winsUsers.map((winUser) => <WinUserCard data={winUser} />)}
                </Box>
            </DialogContent>
        </Dialog>
    )

}

export default observer(WinHistory);