import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import { observer } from 'mobx-react';
import clientStore from '../../stores/clientStore';
import createTransactionModalStore from '../../stores/createTransactionModalStore';

function BalanceOperations() {
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
                gap: 3
            }}
        >
            <Button
                variant='outlined'
                sx={{
                    color: 'white',
                    fontSize: 20,
                    width: '100%',
                    borderColor: "#878787",
                    borderRadius: 27
                }}
                onClick={() => createTransactionModalStore.setOpenModal(true)}
            >
                Пополнить +
            </Button>
            <Button
                variant='outlined'
                sx={{
                    color: 'white',
                    fontSize: 20,
                    width: '100%',
                    borderColor: '#878787',
                    borderRadius: 27
                }}
            >
                Вывести
            </Button>
        </Box>
  );
}

export default observer(BalanceOperations);