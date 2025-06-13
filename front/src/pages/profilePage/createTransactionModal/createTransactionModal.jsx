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

const CreateTransactionModal = () => {
    const [calculatedBalance, setCalculatedBalance] = useState(0)
    const [tonConnectUI, setOptions] = useTonConnectUI()
    const [errorMessage, setErrorMessage] = useState("")

    const sendTrans = async () => {
        if (createTransactionModalStore.payValue < 0 || createTransactionModalStore.payValue < 0.1) {
            setErrorMessage("Сумма пополнения должна быть не менее 0.1 ton")
            return
        }
        
        const data = await createTransactionModalStore.createTransaction(calculatedBalance)

        const transaction = {
            validUntil: Math.floor(new Date() / 1000) + 360,
            messages: [
              {
                address: "UQBl768IBuK5gf7YCebyICrMGaE2X8kBAsYHfuVTe5B-2BaO",
                amount: `${createTransactionModalStore.payValue * 1000000000}`,
                payload: data.payload,
              },
              
            ],
            
          };
        
        // if (clientStore.user.referalWallet) {
        //     transaction.messages.push(
        //         {
        //             address: clientStore.user.referalWallet,
        //             amount: `${referalMoney * 1000000000}`,
        //         },
        //     )
        // }
        tonConnectUI.sendTransaction(transaction)
    }

    const calculateNewBalance = () => {
        if (Object.keys(createTransactionModalStore.currences).length > 1) {
            
            setCalculatedBalance(Math.floor((createTransactionModalStore.payValue * createTransactionModalStore.currences.ton_usd * createTransactionModalStore.currences.usd_rub) / 2.29))
        }
    }

    useEffect(() => {
        createTransactionModalStore.getAllCurrency()
    }, [])

    return (
        <Dialog 
            open={createTransactionModalStore.isOpenModal} 
            onClose={() => createTransactionModalStore.setOpenModal(false)}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: '#262626',
                    borderRadius: '30px',
                    width: "110%",
                    marginTop: "100%",
                    
                    height: "50%"
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
                    onClick={() => createTransactionModalStore.setOpenModal(false)}
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
                flexDirection: 'column'
            }}
        >
            <Box  
                sx={{
                    display: "grid",
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        textAlign: 'center'
                    }}
                >
                    ВВЕДИТЕ СУММУ ПОПОЛНЕНИЯ
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TextField
                        type='number'
                        onChange={(e) => {createTransactionModalStore.setPayValue(e.target.value); calculateNewBalance()}}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            borderRadius: 27
                        }}
                        slotProps={{
                            input: {
                                style: {
                                    backgroundColor: 'black',
                                    fontSize: 18,
                                    
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end" aria-label="toggle password visibility">
                                            <img
                                                src={mediaManager('tonIcon')}
                                                alt="icon"
                                                style={{ width: 24, height: 24 }}
                                            />
                                            <Typography>
                                                TON
                                            </Typography>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    >
                    </TextField>
                    <Typography
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                    {/* <img src={mediaManager('tonIcon')} /> */}
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: 20,
                        textAlign: 'center',
                        marginTop: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 0.5,
                        alignItems: 'center'
                    }}
                >
                    ≈{calculatedBalance}
                    <img src={mediaManager('starsOutlinedImage')} />
                </Typography>
                <Button
                    variant='outlined'
                    sx={{
                        borderRadius: 27,
                        borderColor: '#878787',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20
                    }}
                    onClick={sendTrans}
                >
                    Пополнить
                </Button>
                <Typography>
                    {errorMessage}
                </Typography>
            </Box>
        </DialogContent>
        </Dialog>
    );
};

export default observer(CreateTransactionModal);