import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import clientStore from '../../stores/clientStore';
import { observer } from 'mobx-react';
import CountdownTimer from '../profilePage/weekRewardComponents/weekRewardTimer'
import BalanceAnimation from './balanceAnimation/balanceAnimation';


function Header() {
    const navigate = useNavigate()
    return (
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0,
            color: '#fff',
            marginTop: 2,
            
        }}
        >
        <Box
        >
            <Typography 
                
                sx={{
                    fontSize: "17px",
                    color: '#FFD34F',
                    
                }}
            >
                Бонус дня
            </Typography>
            <Typography 
                
                sx={{
                    color: '#fff',
                    fontSize: "22px"
                }}
                >
                    {clientStore.settings && <CountdownTimer targetDate={new Date(clientStore.settings.lotteryDate)} />}
            </Typography>
            <Typography 
                sx={{
                    color: '#FFD34F',
                    fontSize: "17px"
                }}
                >
                    {clientStore.everyDayReward}
            </Typography>
        </Box>
        <Box 
            sx={{ 
                display: 'flex', 
                gap: 2,
                
                padding: 2,
                height: "40px",
                width: "40%",
                alignItems: 'center',
            }}
            >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                    alignItems: 'end',
                    alignContent: 'center',
                    width: "60%",
                    gap: 0.1,
                    marginTop: 2,
                    maxHeight: "100%"
                }}
                
            >
                <BalanceAnimation typeBalance={Number(clientStore.user.balance)} image={"starsOutlinedImage"} elementId={"balanceMain"}/>
                {/* <Typography
                    sx={{
                        fontFamily: "Roboto",
                        fontSize: "20px",
                        fontWeight: 'bold',
                        display: "flex",
                        gap: 1,
                        
                    }}
                    >
                        {clientStore.user.balance}
                        <img src={mediaManager('starsOutlinedImage')} />
                </Typography> */}
                {/* <Typography 
                    sx={{
                        fontFamily: "Roboto",
                        fontSize: "20px",
                        fontWeight: 'bold',
                        display: "flex",
                        gap: 1,
                    }}
                >
                    {clientStore.user.candy}
                    <img src={mediaManager('candyWhiteIcon')} />
                </Typography> */}
                <BalanceAnimation typeBalance={Number(clientStore.user.candy)} image={"candyWhiteIcon"} elementId={"candyMain"}/>
            </Box>
            <Avatar 
                alt="User"
                src={Telegram.WebApp?.initDataUnsafe?.user?.photo_url}
                sx={{
                    position: 'absolute',
                    width: 70,
                    height: 70,
                    right: 5,
                    top: 103,
                    borderRadius: 27,
                    borderColor: "red",
                    border: "1px solid",
                    userSelect: 'none',
                }}
                onClick={() => navigate('/profile')}
                />
            </Box>
        </Box>
  );
}

export default observer(Header);