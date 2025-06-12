import { Box, Typography, Avatar, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mediaManager from '../../utils/mediaManager';
import { useTonConnectUI } from '@tonconnect/ui-react'
import { observer } from 'mobx-react';
import clientStore from '../../stores/clientStore';
import createTransactionModalStore from '../../stores/createTransactionModalStore';
import walletInfoModalStore from '../../stores/walletInfoModalStore';

function ToolBar() {
    const [tonConnectUI, setOptions] = useTonConnectUI()
    const [connected, setConnected] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange(wallet => {
          clientStore.setWalletConnected(!!wallet);
          if (wallet) {
            clientStore.addWallet(tonConnectUI.wallet.account.address)

          } else {
            clientStore.addWallet("")
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, []);

    useEffect(() => {
        if (tonConnectUI.wallet) {
            clientStore.setWalletConnected(true)
        }
        
    }, [])

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                color: '#fff',
                
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center'
                }}
            >
                
                {clientStore.walletConnected ? (
                    <Button
                        onClick={() => walletInfoModalStore.setOpenModal(true)}
                    >
                        <img src={mediaManager('walletIcon')} width={30}/>
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: 'white',
                                marginLeft: 1
                            }}
                        >
                        {tonConnectUI.wallet.account.address.substring(0, 5)}...{tonConnectUI.wallet.account.address.substring(tonConnectUI.wallet.account.address.length - 5)}
                        </Typography>
                    </Button>
                ):(
                    <Button
                        onClick={() => {
                            tonConnectUI.openModal()
                        }}
                    >
                        <img src={mediaManager('notWalletIcon')} width={30}/>
                    </Button>
                )}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        backgroundColor: 'black',
                        borderRadius: 27,
                        border: '1px solid',
                        borderColor: '#878787',
                        padding: 1.5,
                        alignItems: 'center',
                        width: 130,
                        gap: 1
                    }}
                    onClick={() => navigate('/referals')}
                >
                    <Typography
                        sx={{
                            width: "100%",
                            fontWeight: 'bold'
                        }}    
                    >
                        Мои друзья    
                    </Typography> 
                    <img src={mediaManager('inviteFriendIcon')} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        backgroundColor: 'black',
                        borderRadius: 27,
                        border: '1px solid',
                        borderColor: '#878787',
                        padding: 1.5,
                        alignItems: 'center'
                    }}
                >
                    <img src={mediaManager('settingsIcon')} onClick={() => navigate('/settings')} />
                </Box>
            </Box>
        </Box>
  );
}

export default observer(ToolBar);