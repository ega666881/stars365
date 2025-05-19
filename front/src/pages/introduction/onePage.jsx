import { useState } from 'react'
import { observer } from 'mobx-react';
import { Box, Button, Typography } from '@mui/material';
import introductionStore from '../../stores/introductionStore';

function OnePage() {
  return (
    <Box 
        sx={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: "space-between", 
                padding: 2, 
                minHeight: "85vh"
            }}
        >
        <Box sx={{minHeight: "100%"}}>
            <Typography sx={{color: 'white', fontSize: 20}}>
            А что если бы каждый житель планеты скинулся вам по 1 рублю?
    Представьте сообщество, где каждый участник ежедневно отправляет всего 1 рубль в общий фонд. 
    Каждый день в 12:00 случайным образом выбирается один человек, которому перечисляются все собранные средства.
    ЭТО СВЕРШИЛОСЬ!
    Это сообщество взаимопомощи, где каждый получает шанс осуществить свою мечту.
            </Typography>
        </Box>
        <Box sx={{ alignSelf: 'center', width: "100%"}}> 
            <Button 
                sx={{ 
                    backgroundColor: "#6E6E6E", 
                    color: 'white', 
                    width: "100%", 
                    borderRadius: 27, 
                    height: "100%",
                }}
                onClick={introductionStore.nextPage}
                >
                    Далее
            </Button>
        </Box>
    </Box>
  )
}

export default observer(OnePage)
