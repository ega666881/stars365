import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import changeBetModalStore from '../../../stores/changeBetModalStore';
import { observer } from 'mobx-react';
import mediaManager from '../../../utils/mediaManager';

const BetModal = () => {

  return (
    <Dialog 
        open={changeBetModalStore.isOpenModal} 
        onClose={() => changeBetModalStore.setOpenModal(false)}
        sx={{
            '& .MuiPaper-root': {
                backgroundColor: '#262626',
                borderRadius: '30px',
                width: "110%",
                marginTop: "100%",
                zIndex: 9999,
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
                onClick={() => changeBetModalStore.setOpenModal(false)}
                sx={{
                    display: 'flex',
                    justifySelf: 'end',
                    marginLeft: "100%"
                }}
            >
                <img  src={mediaManager('closeIcon')} />
            </IconButton>
            <Box
                sx={{
                    borderRadius: 21,
                    backgroundColor: "#000000",
                    padding: 2,
                    justifyContent: 'center',
                    
                }}
            >
                <Typography 
                    sx={{
                        fontSize: '20px'
                    }}    
                >ДРУГАЯ СТАВКА</Typography>
            </Box>
          
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={0}>
          {changeBetModalStore.betOptions.map((option) => (
            <Button
              key={option.value}
              variant={changeBetModalStore.bet.value === option.value ? 'outlined' : 'text'}
              color="primary"
              fullWidth
              onClick={() => changeBetModalStore.setBetValue(option)}
              sx={{
                borderRadius: '20px',
                borderColor: '#878787',
                padding: '12px',
                '&.Mui-disabled': { opacity: 0.5 },
              }}
            >
              <Typography
                sx={{
                    color: changeBetModalStore.bet.value === option.value ? 'white':'#878787',
                    fontSize: '20px',
                    display: 'flex',
                    gap: 0.3,
                }}
              >
                {option.value}
                <img src={mediaManager(changeBetModalStore.betValue === option.value ? 'starsOutlinedImage':'starsOutlinedImageDisabled')} />
              </Typography>
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default observer(BetModal);