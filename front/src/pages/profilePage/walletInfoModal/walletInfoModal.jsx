import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
} from '@mui/material';
import changeBetModalStore from '../../../stores/changeBetModalStore';
import { observer } from 'mobx-react';
import mediaManager from '../../../utils/mediaManager';
import x10SpinStore from '../../../stores/x10SpinStore';
import clientStore from '../../../stores/clientStore';
import createTransactionModalStore from '../../../stores/createTransactionModalStore';
import { useTonConnectUI } from '@tonconnect/ui-react';
import InputAdornment from '@mui/material/InputAdornment';
import walletInfoModalStore from '../../../stores/walletInfoModalStore';

const WalletInfoModal = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI()

    return (
        <Dialog 
            open={walletInfoModalStore.isOpenModal} 
            onClose={() => walletInfoModalStore.setOpenModal(false)}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: '#262626',
                    borderRadius: '30px',
                    width: "110%",
                    marginTop: "25%",
                    zIndex: 9999,
                    height: "40%"
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
                        onClick={() => walletInfoModalStore.setOpenModal(false)}
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
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box  
                    sx={{
                        display: "grid",
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 16,
                            textAlign: 'center'
                        }}
                    >
                        Wallet
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            width: "100%"
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRadius: 27,
                                backgroundColor: 'black',
                                padding: 3,
                                width: "90%",
                                gap: 10
                            }}
                        >
                            <Typography
                                sx={{
                                    width: "100%",
                                    fontSize: 15
                                }}
                            >
                                {tonConnectUI.wallet?.account.address.substring(0, 5)}...{tonConnectUI.wallet?.account.address.substring(tonConnectUI.wallet?.account.address.length - 5)}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#7DC152',
                                    width: "100%",
                                    fontSize: 15
                                }}
                            >
                                Активный
                            </Typography>
                        </Box>
                        <Button
                            variant='outlined'
                            sx={{
                                borderRadius: 27,
                                borderColor: 'red',
                                padding: 2,
                                fontSize: 20,
                                color: 'red',
                                marginTop: 3,
                                width: "90%"
                            }}
                            onClick={() => {walletInfoModalStore.setOpenModal(false); tonConnectUI.disconnect()}}
                        >
                            Отвязать
                        </Button>
                    </Box>
                </Box>             
            </DialogContent>
        </Dialog>
    );
};

export default observer(WalletInfoModal);