import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import IntroductionPage from './pages/introduction/introductionPage';
import { Box, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainPage from './pages/mainPage/mainPage';
import mediaManager from './utils/mediaManager';
import RoutesComponent from './routes/routes';
import clientStore from './stores/clientStore';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { observer } from 'mobx-react';
import socketStore from './stores/socketStore';


const darkTheme = createTheme({
  palette: { 
    mode: 'dark',
    text: {
      primary: '#ffffff'
    }
   },
  typography: {
    fontFamily: 'Roboto',
    fontWeight: 'Regular',
    fontSize: 10,
    flexWrap: 'wrap',
    wordWrap: 'break-word',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          color: 'black',
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          height: 30,
        },
      },
    },
  },
});

function App() {
  document.body.style.backgroundColor = '#000000'
  document.body.style.backgroundImage = `url(${mediaManager('backgroundImage')})`
  // document.body.style.backgroundImage = `url(https://img.itch.zone/aW1nLzExODI2MTY0LmdpZg==/original/RUoRHO.gif)`
  console.log(Telegram.WebApp?.initDataUnsafe?.user?.photo_url)
  useEffect(() => {
    if (Telegram.WebApp.initDataUnsafe.user) {
        clientStore.getUser(Telegram.WebApp.initDataUnsafe.user.id)

    } else {
        clientStore.getUser(648698564)
    }
    setInterval(() => {
      socketStore.sendGetActiveUsersCount()
    }, [1000])
  }, [])
  Telegram.WebApp.disableVerticalSwipes()
  try {
    Telegram.WebApp.requestFullscreen()
  } catch {}
  return (
      <ThemeProvider theme={darkTheme}>
        <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/ega666881/Rust-test/refs/heads/main/manifest.json">
          <Box 
            sx={{
                width: "100%", 
                maxHeight: "90vh", 
                overflowY: 'hidden', 
                overflowX: 'hidden',
                padding: 0,
                marginTop: 10
              }}
            >
              {clientStore.user && (
                clientStore.user.subscripted ? (
                  <RoutesComponent />
                ):(
                  <IntroductionPage />
                )
              )}
              
          </Box>
        </TonConnectUIProvider>
      </ThemeProvider>
  )
}

export default observer(App)
