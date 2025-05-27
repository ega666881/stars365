import React, { useEffect, useState } from 'react';
import { Box, Button, Slide, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import mediaManager from '../../utils/mediaManager';
import { useNavigate } from 'react-router-dom';
import clientStore from '../../stores/clientStore';


function ToolBar() {
    const navigate = useNavigate()
    const [takeRewardCount, setTakeRewardCount] = useState(0)

    useEffect(() => {
        let count = 0
        clientStore.user.referals.map((referal) => {
            count += referal.reward
        })
        setTakeRewardCount(count)
    }, [])

    return (
        <Box
            sx={{
                display: 'flex',
                color: '#fff',
                justifyContent: 'space-between',
                marginTop: 2
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    borderRadius: 27,
                    border: '1px solid',
                    borderColor: '#878787',
                    alignItems: 'center',
                    gap: 2,
                    padding: 1
                }}
            >
                <Typography
                    sx={{
                        fontSize: 20
                    }}
                >
                <a 
                    style={{
                        textDecoration: 'none',
                        color: "white",
                    }}
                    href={`https://t.me/share/url?url=https://t.me/starsgame365bot?start=${clientStore.user.id}&text=Переходи в Stars Game 365\n
                                                                                                                       И получи 365 возможностей собрать по 1 ⭐️\n
                                                                                                                       С каждого активного пользователя🚀\n`}>
                    Пригласить
                </a>
                </Typography>
                <img src={mediaManager('inviteFriendIcon')} />
            </Box>
            <Button
                sx={{
                    display: 'flex',
                    borderRadius: 27,
                    border: '1px solid',
                    borderColor: '#878787',
                    alignItems: 'center',
                    gap: 2,
                    padding: 1
                }}
                onClick={() => {clientStore.takeReferalReward(); setTakeRewardCount(0)}}
            >
                <Typography
                    sx={{
                        color: 'white',
                        fontSize: 20
                    }}
                >
                    Собрать {takeRewardCount}
                </Typography>
                <img src={mediaManager('candyWhiteIcon')} />
            </Button>
        </Box>
    );
}

export default observer(ToolBar);