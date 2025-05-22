import React from 'react';
import { Box, Button, Switch, Typography } from '@mui/material';
import ImageSwitch from '../../sharedComponents/customSwitcher';
import mediaManager from '../../utils/mediaManager';
import spinStore from '../../stores/spinStore';
import x10SpinStore from '../../stores/x10SpinStore';

function Footer() {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'fixed',
                bottom: 0,
                left: 0,
                alignItems: 'center',
                alignContent: 'center',
                padding: '16px',
                color: '#fff',
                backgroundColor: '#262626',
                width: "95%",
                overflowX: 'hidden'
            }}
        >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: "100%", marginRight: 1.5}}>
            <Box sx={{
                
            }}>
                <ImageSwitch onIcon={mediaManager('x10ActiveIcon')} offIcon={mediaManager('x10Icon')} onChange={x10SpinStore.setX10} />
                {/* <Typography variant="h6">x10</Typography> */}
            </Box>
            <Button 
                variant="outlined"
                sx={{
                    border: '2px solid',
                    borderColor: '#878787',
                    borderRadius: 27,
                    
                    backgroundColor: 'black'
                }}
            >
                <img src={mediaManager('topIcon')} />
            </Button>
            <Box
                
            >
                <ImageSwitch onIcon={mediaManager('autoActiveIcon')} offIcon={mediaManager('autoIcon')} onChange={spinStore.setAutoSpin} checked={spinStore.autoSpin}/>
            </Box>
        </Box>
        <Box
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
            }}
        >
            <Typography 
                variant="h6"
                sx={{
                    color: '#878787',
                    width: "100%"
                }}
            >@EmilGC </Typography>
            <Typography 
                variant="h6" 
                display={'flex'} 
                alignItems={'center'}
                width={"80%"}
                >
                    <img src={mediaManager('starsOutlinedImage')} />7.555K
                </Typography>
            <Typography variant="h6" 
                sx={{
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#878787',
                    width: "50%"
                }}>
                16:47*20
                <img src={mediaManager('x10Icon')} 
                    style={{
                        
                    }}
                    />
                </Typography>
             
        </Box>
        </Box>
    );
}

export default Footer;