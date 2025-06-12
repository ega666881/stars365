import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import { observer } from 'mobx-react';
import clientStore from '../../stores/clientStore';
import createTransactionModalStore from '../../stores/createTransactionModalStore';
import { useTonConnectUI } from '@tonconnect/ui-react';

function BalanceOperations() {
    const [tonConnectUI, setOptions] = useTonConnectUI()
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
                disabled={!clientStore.walletConnected}
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
                disabled={!clientStore.walletConnected}
            >
                Вывести
            </Button>
        </Box>
  );
}

export default observer(BalanceOperations);