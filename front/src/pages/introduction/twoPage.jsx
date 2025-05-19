import { useState } from 'react'
import { observer } from 'mobx-react';
import { Box, Button, Typography } from '@mui/material';
import introductionStore from '../../stores/introductionStore';
import mediaManager from '../../utils/mediaManager';
import clientStore from '../../stores/clientStore';
import { useNavigate } from 'react-router-dom';

function TwoPage() {
    console.log('Telegram WebApp:', window.Telegram?.WebApp ? 'Доступен' : 'Не найден');
    const navigate = useNavigate()
    
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
                Как это работает?
    Минимальный вклад – всего 365 рублей в год (1 рубль в день).
    Максимальная возможность – 365 шансов в год стать тем самым счастливчиком, которому помогут все участники.
    Долгосрочная перспектива – 3650 попыток за 10 лет, 18 250 возможностей за 50 лет!
    Вы готовы стать частью этой идеи и поддерживать единомышленников? 
                </Typography>
            </Box>
            <Box sx={{ alignSelf: 'center', width: "100%"}}> 
                <Button 
                    sx={{ 
                        backgroundColor: "#6E6E6E", 
                        color: 'white', 
                        width: "100%", 
                        borderRadius: 27, 
                        height: 40
                    }}
                    onClick={() => clientStore.createInvoice(navigate)}
                    >
                        <Typography 
                            sx={{
                                fontSize: 30
                            }}
                        >
                            КУПИТЬ {<img src={mediaManager('starsLogo')} width={"22px"} />}365
                        </Typography>
                </Button>
            </Box>
        </Box>
    )
}

export default observer(TwoPage)
