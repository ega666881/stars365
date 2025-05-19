import React from 'react';
import { Box, Typography, Avatar, Grid2, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WeekRewardCard from './weekRewardCard';
import CountdownTimer from './weekRewardTimer'
import clientStore from '../../../stores/clientStore';
import { useState } from 'react';
import { observer } from 'mobx-react';

function WeekRewards() {
    const navigate = useNavigate()
    const [takeReward, setTakeReward] = useState(false)

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                marginTop: 2,
                justifyContent: 'center'
            }}
        >
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: 25,
                }}
                >
                Бонус за ежедневный вход
            </Typography>

            <Grid2
                sx={{
                    display: 'flex',
                    maxWidth: "100%",
                    gap: 0.2,
                    width: "100%",
                    maxHeight: "30vh",
                    overflowY: 'auto',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: 1,
                }}
            >
                {
                    [
                        {day: 1},
                        {day: 2},
                        {day: 3},
                        {day: 4},
                        {day: 5},
                        {day: 6},
                        {day: 7},
                    ].map((weekReward) => {
                        let checked = false
                        if (weekReward.day <= clientStore.user.dayRewardCount) checked = true 
                        return <WeekRewardCard day={weekReward.day} checked={checked} />
                    })
                }
            </Grid2>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    borderRadius: 27,
                    border: '1px solid',
                    borderColor: "#878787",
                    padding: 1,
                    marginTop: 2,
                    
                }}
            >
                {clientStore.user.nextTakeDayReward ? (
                    <>{takeReward ? (
                        <Button
                            sx={{
                                color: "white",
                                fontSize: "15px",
                            }}
                            onClick={() => clientStore.takeDayReward(setTakeReward)}
                        >
                            ЗАБРАТЬ
                        </Button>
                    ):(
                        <Typography
                            sx={{
                                    textAlign: 'center',
                                    color: "#878787",
                                    fontWeight: 'bold'
                                }}
                            >
                            Приходи через {<CountdownTimer targetDate={new Date(clientStore.user.nextTakeDayReward)} setTakeReward={setTakeReward}/>}
                        </Typography>
                    )}</>
                ):(
                    <Button
                        sx={{
                            color: "white",
                            fontSize: "15px",
                        }}
                        onClick={() => clientStore.takeDayReward(setTakeReward)}
                    >
                        ЗАБРАТЬ
                    </Button>
                )}
            </Box>
        </Box>
  );
}

export default observer(WeekRewards);